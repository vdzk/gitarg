import { $ } from '../state.js'

export const getAllEdges = () => {
  const effect2statement = {}
  const effect2causes = {}
  const cause2effects = {}
  for (const sid in $.statements) {
    const { type, causation } = $.statements[sid]
    if (type === 'causation') {
      const { causes, effect } = causation
      if (effect !== null) {
        effect2statement[effect] = sid
        const cids = Object.keys(causes)
        if (cids.length > 0) {
          if (!effect2causes[effect]) effect2causes[effect] = []
          for (const cause of cids) {
            if (!cause2effects[cause]) cause2effects[cause] = []
            effect2causes[effect].push(cause)
            cause2effects[cause].push(effect)
          }
        }
      }
    }
  }
  return { effect2statement, effect2causes, cause2effects }
}

export const getConnected = (event, effect2causes, cause2effects) => {
  const connected = []
  let boundary = [ event ]
  while (boundary.length > 0) {
    const id = boundary.pop()
    for (const edges of [effect2causes, cause2effects]) {
      const neighbours = edges[id]
      if (neighbours) {
        const newNodes = neighbours
        .filter(eid => !connected.includes(eid) && !boundary.includes(eid))
        boundary = boundary.concat(newNodes)
      }
    }
    connected.push(id)
  }
  return connected
}

export const getDescendants = (roots, cause2effects) => {
  let descendants = []
  let boundary = roots.slice()
  while (boundary.length > 0) {
    const id = boundary.pop()
    const children = cause2effects[id]
    if (children) {
      const newNodes = children.filter(eid => !descendants.includes(eid))
      boundary = boundary.concat(newNodes)
      descendants = descendants.concat(newNodes)
    }
  }
  return descendants
}

export const getGraph = (connected, cause2effects) => {
  const graph = new dagre.graphlib.Graph()
  graph.setGraph({
    rankdir: 'LR',
    edgesep: 20,
    nodesep: 12,
    ranksep: 35,
    marginy: 20,
    marginx: 20,
  })
  graph.setDefaultEdgeLabel(function() { return {} })
  for (const cid of connected) {
    graph.setNode(cid, {
      label: $.events[cid].text,
      width: 250,
      height: 80,
    })
    for (const eid of cause2effects[cid] || []) {
      graph.setEdge(cid, eid)
    }
  }
  dagre.layout(graph)
  return graph
}
