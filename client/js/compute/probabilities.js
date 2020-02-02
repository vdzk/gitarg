import { $ } from '../state.js'

//w - total weight of parameters between 0 and 1
//m - probability at w = 0.5
//https://www.desmos.com/calculator/ovfg74i7nd
const wm2p = (w, m) => (m*w)/(1-m-w+2*m*w)
export const P2cpt = (P) => ({T: P, F: 1 - P})

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

//extrapolate conditional probabilities
//Each cause has a weight. Combination weight is adjusted according to midP. Resulting ratio determines probability within minP, maxP range.
export const getBayesNet = (connected, effect2causes, conditions) => {
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
  return nodes
}
