import { $ } from '../state.js'
import { getAllEdges, getConnected } from './graph.js'

export const getNextConclusion = () => {
  $.nextConclusion = null
  if ($.screen !== 'statement' || $.editing) return false
  if ($.statement.type === 'causation') {
    const { effect } = $.statement.causation
    if (effect !== null) {
      const { effect2causes, cause2effects } = getAllEdges()
      const connected = getConnected(effect, effect2causes, cause2effects)
      for (const sid in $.statements) {
        const { type, event } = $.statements[sid].premises
        if (type === 'causalNet' && connected.includes(event)) {
          $.nextConclusion = sid
          return true
        }
      }
    }
  } else {
    for (const sid in $.statements) {
      const { type, ids } = $.statements[sid].premises
      if (type === 'statements' && ids.includes($.curId)) {
        $.nextConclusion = sid
        return true
      }
    }
  }
}

export const getAltConditions = () => {
  $.altConditions = {}

  //check if in the right state of view
  if (
    $.screen !== 'statement'
    || $.editing
    || $.statement.premises.type !== 'causalNet'
  ) {
    return false
  }

  for (const cid in $.statement.premises.conditions) {
    const condVal = $.statement.premises.conditions[cid]
    for (const sid in $.statements) {
      const { type, conditions } = $.statements[sid].premises
      if (
        type === 'causalNet'
        && conditions.hasOwnProperty(cid)
        && conditions[cid] !== condVal
      ) {
        $.altConditions[cid] = sid
      }
    }
  }
}
