import { $ } from '../state.js'
import { modVar, holeStr } from '../constants.js'

export const modifyText = () => {
  Object.values($.statements).forEach((statement) => {
    let modText = ''
    const { type } = statement
    if (type === 'causation') {
      const { effect, causes } = statement.causation
      const cl = Object.keys(causes).length
      if (effect === null) {
        modText += holeStr
      } else {
        let mps
        if (cl === 0) {
          mps = ['midP']
        } else if (cl === 1) {
          mps = ['minP', 'maxP']
        } else {
          mps = ['minP', 'midP', 'maxP']
        }
        const pStr = mps
          .map((mp) => {
            const P = statement.causation[mp][$.userId]
            return (P === null) ? holeStr.replace('(', '').replace(')', '') : P
          })
          .join('/')
        modText += '('+ pStr +')% '
        modText += $.events[effect].text
      }
      if (cl > 0) {
        modText += ' <='
        for (const cid in causes) {
          const w = causes[cid][$.userId]
          const W = (w === null) ? holeStr : w
          modText += ' ' + W + ' ' + $.events[cid].text
        }
      }
    } else {
      const { modifiers, text } = statement
      if (modifiers && text.includes(modVar)) {
        let modifier = modifiers[$.userId]
        if (modifier === null) modifier = holeStr
        modText = text.replace(modVar, modifier)
      } else {
        modText = text
      }
    }
    statement.modText = modText
  })
}
