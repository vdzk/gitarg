import { $ } from '../state.js'
import { modifyText } from './modifyText.js'
import { infer } from './infer.js'
import { getNextConclusion, getAltConditions } from './related.js'
import { getPremisesTree } from './premiseTree.js'

export const compute = () => {
  $.statement = ($.curId === null) ? null : $.statements[$.curId]
  modifyText()
  infer()
  getNextConclusion()
  getAltConditions()
  getPremisesTree()
}
