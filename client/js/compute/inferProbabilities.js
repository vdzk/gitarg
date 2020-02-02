import { $, stateChange } from '../state.js'
import { getAllEdges, getConnected, getGraph } from './graph.js'
import { getInference } from '../server.js'
import { getBayesNet } from './probabilities.js'

export const inferProbabilities = () => {
  const { event, conditions } = $.statement.premises
  if (event === null) {
    return false
  }

  //build the network
  const { effect2statement, effect2causes, cause2effects } = getAllEdges()
  $.effect2statement = effect2statement
  const connected = getConnected(event, effect2causes, cause2effects)
  $.graph = getGraph(connected, cause2effects)
  const nodes = getBayesNet(connected, effect2causes, conditions)

  //Collect conditions
  let bayesConditions = {}
  for (const { id } of nodes) {
    if ($.observations.hasOwnProperty(id)) {
      const { happened } = $.observations[id]
      bayesConditions[id] = (happened) ? 'T' : 'F'
    }
  }
  for (const cid in conditions) {
    bayesConditions[cid] = (conditions[cid]) ? 'T' : 'F'
  }

  //TODO: implement a better caching strategy
  const inferenceData = { nodes, evidence: bayesConditions }
  const chacheKey = JSON.stringify({inferenceData})
  if ($.inferenceCacheKey !== chacheKey) {
    $.inferenceCacheKey = chacheKey
    $.probabilities = {}
    getInference(inferenceData)
      .then((probabilities) => {
        $.probabilities = probabilities
        stateChange()
      })
  }
}
