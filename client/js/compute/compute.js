import { $ } from '../state.js'
import { modifyText } from './modifyText.js'
import { inferProbabilities } from './inferProbabilities.js'
import { inferConnectedness } from './inferConnectedness.js'
import { getNextConclusion, getAltConditions } from './related.js'
import { getPremisesTree } from './premiseTree.js'

const getObservations = () => {
  const observations = {}
  for (const sid in $.statements) {
    const { type, observation } = $.statements[sid]
    if (type === 'observation' && observation.event !== null) {
      const { event, happened } = observation
      observations[event] = { happened, sid }
    }
  }
  return observations
}

const linkGroupFuncs = () => {
  for (const sid in $.statements) {
    const { type, causation } = $.statements[sid]
    if (type === 'causation' && causation.effect !== null) {
      $.events[causation.effect].probFunc = sid
    }
  }
}

const getSatement = () => ($.curId === null) ? null : $.statements[$.curId]

export const compute = () => {
  $.statement = getSatement()
  $.observations = getObservations()
  modifyText()
  linkGroupFuncs()

  if ($.screen === 'statement' && !$.editing) {
    $.nextConclusion = getNextConclusion()
    const { type } = $.statement.premises
    if (type === 'causalNet') {
      $.altConditions = getAltConditions()
      inferProbabilities()
    } else if (type === 'connectedness') {
      inferConnectedness()
    }
  } else if ($.screen === 'statements' && $.treeView) {
    $.premisesTree = getPremisesTree()
  }

}
