import { $ } from '../state.js'
import { db } from '../db.js'
import { actions } from './actions.js'

export const add = {
  statement: () => {
    actions.set.screen('statement')
    actions.set.editing(true)
    let id
    if ($.freshStatement === null) {
      id = (++$.lastId.statement).toString()
      db.params.update('lastId', {statement: id})
      $.curId = id
      const statement = {
        id: id,
        type: 'simple',
        text: '',
        modQuest: '',
        causation: null,
        observation: null,
        quote: null,
        premises: {
          type: 'statements',
          ids: [],
        },
        modifiers: $.users.map(() => null),
      }
      $.statements[id] = statement
      db.statements.add(statement)
      $.freshStatement = id
    } else {
      id = $.freshStatement
    }
    return { id }
  },
  probFunc: (eid) => {
    const { id } = add.statement()
    $.statement = $.statements[id]
    actions.set.type('causation')
    actions.set.causationEffect(eid)
  },
  observationStatement: (eid) => {
    const { id } = add.statement()
    $.statement = $.statements[id]
    actions.set.type('observation')
    actions.set.observationEvent(eid)
  },
  premise: (sid) => {
    const { id } = add.statement()
    const { premises } = $.statements[sid]
    premises.ids.push(id)
    db.statements.update(sid, {premises})
  },
  event: () => {
    actions.set.screen('events')
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
  observation: () => {
    const observation = {
      event: null,
      happened: true,
    }
    $.statement.observation = observation
    db.statements.update($.curId, { observation })
  },
  expanded: (expId, pid) => {
    if ($.expanded.hasOwnProperty(expId)) {
      $._reExpanded = expId
    }
    $.expanded[expId] = pid
  },
}
