import { $ } from '../state.js'
import { modVar, holeStr } from '../constants.js'

export const modifyText = () => {
  Object.values($.statements).forEach((statement) => {
    let modText = ''
    const { type } = statement
    if (type === 'causation') {
      let modTextFull = ''
      let missingData = false
      const { effect, causes } = statement.causation
      const cl = Object.keys(causes).length
      if (effect === null) {
        modText += holeStr
        modTextFull += holeStr
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
            if (P === null) {
              missingData = true
              return holeStr.replace('(', '').replace(')', '')
            } else {
              return P
            }
          })
          .join('/')
        modTextFull += '('+ pStr +')% '
        modTextFull += $.events[effect].text
        modText += 'Вероятность: "' + $.events[effect].text + '"'
      }
      if (cl > 0) {
        modTextFull += ' <='
        for (const cid in causes) {
          const w = causes[cid][$.userId]
          let W
          if (w === null) {
            W = holeStr
            missingData = true
          } else {
            W = w
          }
          modTextFull += ' ' + W + ' ' + $.events[cid].text
        }
      }
      if (missingData) {
        modText += ' ' + holeStr
      }
      statement.modTextFull = modTextFull
    } else if (type === 'observation') {
      const { event, happened } = statement.observation
      modText = ''
      modText += (happened) ? 'Cвершилось: ' : 'Не свершилось: '
      if (event === null) {
        modText += holeStr
      } else {
        modText += '"' + $.events[event].text + '"'
      }
    } else {
      const { modifiers, text, modQuest } = statement
      if (modifiers && text.includes(modVar)) {
        let modifier = modifiers[$.userId]
        if (modifier === null) {
          modifier = '(' + modQuest + holeStr.replace('(', '')
        }
        modText = text.replace(modVar, modifier)
      } else {
        modText = text
      }
    }
    statement.modText = modText
  })
}
