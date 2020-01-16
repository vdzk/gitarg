import { $ } from '../state.js'
import { db } from '../db.js'
import { actions } from './actions.js'

export const paste = {
  premises: () => {
    const { id, premises } = $.statement
    $.buffer.statements.forEach((pid) => {
      if (!premises.ids.includes(pid)) {
        premises.ids.push(pid)
      }
    })
    db.statements.update(id, {premises})
    $.buffer.statements = []
  },
  mainStatement: () => {
    const sid = $.buffer.statements.shift()
    $.mainStatement = sid
    db.params.update('mainStatement', { sid })
    $.buffer.statements = []
  },
  event: () => {
    const { id, premises } = $.statement
    premises.event = $.buffer.events.shift()
    db.statements.update(id, {premises})
  },
  conditions: () => {
    const { id, premises } = $.statement
    $.buffer.events.forEach((eid) => {
      if (!premises.conditions.hasOwnProperty(eid)) {
        premises.conditions[eid] = true
      }
    })
    db.statements.update(id, {premises})
    $.buffer.events = []
  },
  causes: () => {
    const { id, causation } = $.statement
    $.buffer.events.forEach((eid) => {
      if (!causation.causes.hasOwnProperty(eid)) {
        causation.causes[eid] = $.users.map(() => null)
      }
    })
    db.statements.update(id, {causation})
    $.buffer.events = []
  },
  effect: () => {
    const { id, causation } = $.statement
    causation.effect = $.buffer.events.shift()
    db.statements.update(id, {causation})
  },
}
