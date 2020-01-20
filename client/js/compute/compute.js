import { $ } from '../state.js'
import { modifyText } from './modifyText.js'
import { infer } from './infer.js'
import { getNextConclusion, getAltConditions } from './related.js'
import { getPremisesTree } from './premiseTree.js'

export const compute = () => {
  $.statement = ($.curId === null) ? null : $.statements[$.curId]
  $.observations = {}
  for (const sid in $.statements) {
    const { type, observation } = $.statements[sid]
    if (type === 'observation' && observation.event !== null) {
      const { event, happened } = observation
      $.observations[event] = { happened, sid }
    }
  }
  modifyText()
  infer()
  getNextConclusion()
  getAltConditions()
  getPremisesTree()
}
