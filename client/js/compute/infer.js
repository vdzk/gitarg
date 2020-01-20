import { $ } from '../state.js'
import { getAllEdges, getConnected } from './graph.js'

//w - total weight of parameters between 0 and 1
//m - probability at w = 0.5
//https://www.desmos.com/calculator/ovfg74i7nd
const wm2p = (w, m) => (m*w)/(1-m-w+2*m*w)
const P2cpt = (P) => ({T: P, F: 1 - P})

const getCombosRec = (parents) => {
  if (parents.length === 0) return [{}]
  const [head, ...tail] = parents
  const combos = []
  const tailCombos = getCombosRec(tail)
  for (const tailCombo of tailCombos) {
    for (const v of ['T', 'F']) {
      const combo = {[head]: v, ...tailCombo}
      combos.push(combo)
    }
  }
  return combos
}

export const infer = () => {
  //check if in the right state of view
  if (
    $.screen !== 'statement'
    || $.editing
    || $.statement.premises.type !== 'causalNet'
    || $.statement.premises.event === null
  ) {
    return false
  }

  //build the network
  const { effect2statement, effect2causes, cause2effects } = getAllEdges()
  $.effect2statement = effect2statement
  const { event, conditions } = $.statement.premises
  const connected = getConnected(event, effect2causes, cause2effects)

  //create graph
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
  $.graph = graph

  //extrapolate conditional probabilities
  //Each cause has a weight. Combination weight is adjusted according to midP. Resulting ratio determines probability within minP, maxP range.
  let nodes = []
  for (const eid of connected) {
    const sid = $.effect2statement[eid]
    let parents, cpt
    if (!sid) {
      if (conditions.hasOwnProperty(eid)) {
        parents = []
        cpt = P2cpt(0.5)
      } else {
        continue
      }
    } else if (effect2causes[eid] === undefined) {
      const uMidP = $.statements[sid].causation.midP[$.userId]
      if (uMidP === null) {
        continue
      } else {
        parents = []
        cpt = P2cpt(parseFloat(uMidP) / 100)
      }
    } else {
      parents = effect2causes[eid]
      const { causation } = $.statements[sid]
      const { causes } = causation
      const u = {}
      for (const pp of ['minP', 'midP', 'maxP']) {
        u[pp] = parseFloat(causation[pp][$.userId]) / 100
      }
      if (
          u.minP === null
          || u.maxP === null
          || (parents.length > 1 && u.midP === null)
      ) {
        continue
      }

      let maxWeight = 0
      for ( const cid in causes ) {
        const weight = causes[cid][$.userId]
        if (weight === null) {
          //Remove parent with missing data
          parents = parents.filter(pid => pid !== cid)
        } else {
          maxWeight += Math.abs(weight)
        }
      }
      if (parents.length === 0) {
        if (conditions.hasOwnProperty(eid)) {
          cpt = P2cpt(0.5)
        } else {
          continue
        }
      } else {
        cpt = []
        const combos = getCombosRec(parents)
        for (const combo of combos) {
          let comboWeight = 0
          for (const cid in combo) {
            const weight = parseFloat(causes[cid][$.userId])
            if ((weight > 0 && combo[cid] === 'T')
            || (weight < 0 && combo[cid] === 'F')) {
              comboWeight += Math.abs(weight)
            }
          }
          const w = comboWeight / maxWeight
          let p
          if (parents.length === 1) {
            p = w
          } else if (u.minP === u.maxP) {
            p = u.minP
          } else {
            const m = (u.midP - u.minP) / (u.maxP - u.minP)
            if (m === 0) {
              p = (w === 1) ? 1 : 0
            } else if (m === 1) {
              p = (w > 0) ? 1 : 0
            } else {
              p = wm2p(w, m)
            }
          }
          const P = u.minP + p * (u.maxP - u.minP)
          cpt.push({
            when: combo,
            then: P2cpt(P)
          })
        }
      }
    }
    nodes.push({
      id: eid,
      states: ['T', 'F'],
      parents,
      cpt,
    })
  }

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

  //run inference
  //NOTE: getNet() was manually added to bayesjs source code by exporting createNetwork()
  const network = bayesjs.getNet(...nodes)
  //NOTE: infer() source code was manually modified to return all probabilities
  $.inference = bayesjs.infer(network, {}, bayesConditions)
}
