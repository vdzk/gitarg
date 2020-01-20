import { $ } from '../state.js'
import { db } from '../db.js'
import { actions } from './actions.js'

export const add = {
  statement: () => {
    actions.set.screen('statement')
    actions.set.editing(true)
    const id = (++$.lastId.statement).toString()
    db.params.update('lastId', {statement: id})
    $.curId = id
    const statement = {
      id: id,
      type: 'simple',
      text: '',
      causation: null,
      quote: null,
      premises: {
        type: 'statements',
        ids: [],
      },
      modifiers: $.users.map(() => null),
    }
    $.statements[id] = statement
    db.statements.add(statement)
    return { id }
  },
  premise: (sid) => {
    const { id } = add.statement()
    const { premises } = $.statements[sid]
    premises.ids.push(id)
    db.statements.update(sid, {premises})
  },
  event: () => {
    const id = (++$.lastId.event).toString()
    db.params.update('lastId', {event: id})
    const event = {
      id: id,
      text: '',
    }
    $.events[id] = event
    db.events.add(event)
    event.editing = true
  },
  item: () => {
    if ($.screen === 'events') {
      actions.add.event()
    } else {
      actions.add.statement()
    }
  },
  link: () => {
    const { id, premises } = $.statement
    premises.links.push({
      title: '',
      url: '',
    })
    db.statements.update(id, { premises })
  },
  causation: () => {
    const causation = {
      causes: {},
      minP: $.users.map(() => null),
      maxP: $.users.map(() => null),
      midP: $.users.map(() => null),
      effect: null,
    }
    $.statement.causation = causation
    db.statements.update($.curId, { causation })
  },
  expanded: (expId, pid) => {
    if ($.expanded.hasOwnProperty(expId)) {
      $.reExpanded = expId
    }
    $.expanded[expId] = pid
  },
}
