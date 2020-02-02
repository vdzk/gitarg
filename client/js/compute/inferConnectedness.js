import { $, stateChange } from '../state.js'
import { getAllEdges, getConnected, getDescendants, getGraph } from './graph.js'
import { getInference } from '../server.js'
import { getBayesNet, P2cpt } from './probabilities.js'

// Calculate probabilities as in inferProbabilities
// Calculate probability of evidence after a negative intervention X
// Create a separate network by taking all dependants of X from nodes object
// Set uproot X and set it to appropriate value
// Uproot missing parrents and set their priors to the previous probabilities from inferProbabilities
// Calculate posterior probability of evidence
// Compare this to the same calculation but with X set to prob from inferProbabilities as the prior
// Show probability delta caused by intervention

export const inferConnectedness = async () => {
  const { observations, hiddenVariables } = $.statement.premises
  if (observations.length === 0 || Object.keys(hiddenVariables).length === 0) {
    return false
  }

  //build the network
  const { effect2statement, effect2causes, cause2effects } = getAllEdges()
  $.effect2statement = effect2statement
  const rootEvent = $.statements[observations[0]].observation.event
  const connected = getConnected(rootEvent, effect2causes, cause2effects)
  $.graph = getGraph(connected, cause2effects)
  const nodes = getBayesNet(connected, effect2causes, {})

  //TODO: implement a better caching strategy
  const chacheKey = JSON.stringify({nodes, allObs: $.observations, observations, hiddenVariables})
  if ($.inferenceCacheKey !== chacheKey) {

    const realEvidence = {}
    for (const { id } of nodes) {
      if ($.observations.hasOwnProperty(id)) {
        const { happened } = $.observations[id]
        realEvidence[id] = (happened) ? 'T' : 'F'
      }
    }

    const mainRoots = Object.keys(hiddenVariables)
    const descendants = getDescendants(mainRoots, cause2effects)
    let allRoots = []
    for (const did of descendants) {
      const newNodes = effect2causes[did]
        .filter(pid => !descendants.includes(pid) && !allRoots.includes(pid))
      allRoots = allRoots.concat(newNodes)
    }

    $.inferenceCacheKey = chacheKey
    $.probabilities = {}
    $.bayesConditions = {}
    const allGraphData = {}
    const realProbs = await getInference({nodes, evidence: realEvidence})
    allGraphData.withEvidence = {
      probabilities: realProbs,
      bayesConditions: realEvidence,
    }
    const altNodes = nodes
      .map((node) => {
        if (descendants.includes(node.id)) {
          return node
        } else if (allRoots.includes(node.id)) {
          return ({
            id: node.id,
            states: ['T', 'F'],
            parents: [],
            cpt: P2cpt(realProbs[node.id]),
          })
        } else {
          return null
        }
      })
      .filter(n => n !== null)
    const altEvidence = {}
    observations
      .map((sid) => $.statements[sid].observation)
      .filter(({event, happened}) => descendants.includes(event))
      .forEach(({event, happened}) => altEvidence[event] = happened)
    if (Object.keys(altEvidence).length === 0) {
      console.log('No observations affected by the prevention')
      //TODO: return 0 connectedness
      return false
    }



    //Probabilities with/without prevention
    const allProbs = {true: {}, false: {}}
    const prevEvidence = {}
    const allPromises = []
    for ( const eid in altEvidence ) {
      for ( const prevent of [true, false]) {
        const bayesConditions = {}
        if (prevent) {
          for ( const hid in hiddenVariables) {
            const happened = hiddenVariables[hid]
            bayesConditions[hid] = (happened) ? 'F' : 'T'
          }
        }
        for (const prevId in prevEvidence) {
          bayesConditions[prevId] = (prevEvidence[prevId]) ? 'T' : 'F'
        }
        const inferenceData = { nodes: altNodes, evidence: bayesConditions }
        const inferencePromise = getInference(inferenceData)
        const noEvidence = Object.keys(prevEvidence).length === 0
        inferencePromise.then((probabilities) => {
          allProbs[prevent][eid] = probabilities
          if (noEvidence) {
            const view = (prevent) ? 'prevent' : 'replay'
            allGraphData[view] = { probabilities, bayesConditions }
          }
        })
        allPromises.push(inferencePromise)
      }
      prevEvidence[eid] = altEvidence[eid]
    }

    await Promise.all(allPromises)
    const probsOfEvidences = {}
    for ( const prevent of [true, false]) {
      probsOfEvidences[prevent] = Object.entries(allProbs[prevent])
      .reduce((acc, [eid, probs]) => {
        const probObs = (altEvidence[eid]) ? probs[eid] : (1 - probs[eid])
        return acc * probObs
      }, 1)
    }
    const p_e_prevent = probsOfEvidences[true]
    const p_e = probsOfEvidences[false]
    //Formula inspired by Bayes factor
    const score = Math.log(p_e * (1 - p_e_prevent)/ (p_e_prevent * (1 - p_e)))
    Object.assign($.connectedness, { p_e_prevent, p_e, score, allGraphData })
    updateGraphData()
    stateChange()
  } else {
    updateGraphData()
  }
}

const updateGraphData = () => {
  const { view, allGraphData } = $.connectedness
  Object.assign($, allGraphData[view])
}
