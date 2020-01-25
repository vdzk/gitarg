from pybbn.graph.dag import Bbn
from pybbn.graph.edge import Edge, EdgeType
from pybbn.graph.jointree import EvidenceBuilder
from pybbn.graph.node import BbnNode
from pybbn.graph.variable import Variable
from pybbn.pptc.inferencecontroller import InferenceController

def lambda_handler(event, context):
  network = Bbn()

  bbnNodes = {}
  for idx, node in enumerate(event['nodes']):
    variable = Variable(idx, node['id'], node['states'])
    bbnNode = BbnNode(variable, node['cpt'])
    bbnNodes[node['id']] = bbnNode
    network.add_node(bbnNode)

  for node in event['nodes']:
    for pid in node['parents']:
      source = bbnNodes[pid]
      target = bbnNodes[node['id']]
      edge = Edge(source, target, EdgeType.DIRECTED)
      network.add_edge(edge)

  join_tree = InferenceController.apply(network)

  for id, value in event['observations'].items():
    ev = EvidenceBuilder() \
      .with_node(join_tree.get_bbn_node_by_name(id)) \
      .with_evidence(value, 1.0) \
      .build()
    join_tree.set_observation(ev)

  # print the marginal probabilities
  probabilities = {}
  for node in join_tree.get_bbn_nodes():
    potential = join_tree.get_bbn_potential(node)
    probabilities[node.variable.name] = potential.entries[0].value

  return probabilities
