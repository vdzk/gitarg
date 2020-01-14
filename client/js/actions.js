import { $, stateChange } from './state.js'
import { db } from './db.js'

export const actions = {
  showScreen: (s) => $.screen = s,
  toggleTreeView: () => $.treeView = !$.treeView,
  showId: (id) => {
    actions.showScreen('statement')
    $.editing = false
    $.curId = id
  },
  addStatement: () => {
    actions.showScreen('statement')
    $.editing = true
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
  },
  addEvent: () => {
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
  addLink: () => {
    const { id, premises } = $.statement
    premises.links.push({
      title: '',
      url: '',
    })
    db.statements.update(id, { premises })
  },
  setLinkTitle: (i, title) => {
    const { id, premises } = $.statement
    premises.links[i].title = title
    db.statements.update(id, { premises })
  },
  setLinkUrl: (i, url) => {
    const { id, premises } = $.statement
    premises.links[i].url = url
    db.statements.update(id, { premises })
  },
  removeLink: (i) => {
    const { id, premises } = $.statement
    premises.links.splice(i, 1)
    db.statements.update(id, { premises })
  },
  toggleEventEdit: (id) => {
    $.events[id].editing = !$.events[id].editing
  },
  addItem: () => {
    if ($.screen === 'events') {
      actions.addEvent()
    } else {
      actions.addStatement()
    }
  },
  setType: (type) => {
    $.statement.type = type
    //TODO: refactor with addCausation / removeCausation
    const props = { type, causation: null, quote: null }
    if (type === 'causation') {
      props.causation = {
        causes: {},
        minP: $.users.map(() => null),
        maxP: $.users.map(() => null),
        midP: $.users.map(() => null),
        effect: null,
      }
    } else if (type === 'quote') {
      props.quote = ''
    }
    Object.assign($.statement, props)
    db.statements.update($.curId, props)
  },
  setText: (text) => {
    //TODO: debounce most keystrokes
    $.statement.text = text
    db.statements.update($.curId, { text })
  },
  setEventText: (id, text) => {
    $.events[id].text = text
    db.events.update(id, { text })
  },
  setQuote: (quote) => {
    $.statement.quote = quote
    db.statements.update($.curId, { quote })
  },
  setModifier: (t) => {
    const { id, modifiers } = $.statement
    modifiers[$.userId] = t
    db.statements.update($.statement.id, {modifiers})
  },
  setProb: (key, p) => {
    let { id, causation } = $.statement
    // id = parseInt(id)
    causation[key][$.userId] = p
    db.statements.update(id, {causation})
  },
  removeProbs: () => {
    const { id, causation } = $.statement
    for (const key of ['minP', 'minP', 'maxP']) {
      causation[key][$.userId] = null
    }
    db.statements.update(id, {causation})
  },
  setWeight: (eid, w) => {
    const { id, causation } = $.statement
    causation.causes[eid][$.userId] = w
    db.statements.update(id, {causation})
  },
  paste2premises: () => {
    const { id, premises } = $.statement
    $.buffer.statements.forEach((pid) => {
      if (!premises.ids.includes(pid)) {
        premises.ids.push(pid)
      }
    })
    db.statements.update(id, {premises})
    $.buffer.statements = []
  },
  removePremise: (pid, sid=$.curId) => {
    const { id, premises } = $.statements[sid]
    const i = premises.ids.indexOf(pid)
    if (i !== -1) {
      premises.ids.splice(i, 1)
      db.statements.update(id, {premises})
    }
  },
  paste2event: () => {
    const { id, premises } = $.statement
    premises.event = $.buffer.events.shift()
    db.statements.update(id, {premises})
  },
  paste2conditions: () => {
    const { id, premises } = $.statement
    $.buffer.events.forEach((eid) => {
      if (!premises.conditions.hasOwnProperty(eid)) {
        premises.conditions[eid] = true
      }
    })
    db.statements.update(id, {premises})
    $.buffer.events = []
  },
  paste2causes: () => {
    const { id, causation } = $.statement
    $.buffer.events.forEach((eid) => {
      if (!causation.causes.hasOwnProperty(eid)) {
        causation.causes[eid] = $.users.map(() => null)
      }
    })
    db.statements.update(id, {causation})
    $.buffer.events = []
  },
  paste2effect: () => {
    const { id, causation } = $.statement
    causation.effect = $.buffer.events.shift()
    db.statements.update(id, {causation})
  },
  setPremiseCondition: (cid, happened) => {
    const { id, premises } = $.statement
    premises.conditions[cid] = happened
    db.statements.update(id, {premises})
  },
  removePremiseEvent: (sid=$.curId) => {
    const { id, premises } = $.statements[sid]
    premises.event = null
    db.statements.update(id, {premises})
  },
  removePremiseCondition: (cid, sid=$.curId) => {
    const { id, premises } = $.statements[sid]
    delete premises.conditions[cid]
    db.statements.update(id, {premises})
  },
  removeCausationEffect: (sid=$curId) => {
    const { id, causation } = $.statements[sid]
    causation.effect = null
    db.statements.update(id, {causation})
  },
  removeCausationCause: (eid, sid=$.curId) => {
    const { id, causation } = $.statements[sid]
    delete causation.causes[eid]
    if (Object.keys(causation.causes).length < 2) {
      causation.midP[$.userId] = null
    }
    db.statements.update(id, {causation})
  },
  setPremisesType: (type) => {
    //TODO: prevent loss of data
    const premises = { type }
    if (type === 'statements') {
      premises.ids = []
    } else if (type === 'causalNet') {
      premises.event = null
      premises.conditions = {}
    } else if (type === 'links') {
      premises.links = []
    }
    $.statement.premises = premises
    db.statements.update($.curId, {premises})
  },
  delete: () => {
    const id = $.curId
    delete $.statements[id]
    db.statements.where('id').equals(id).delete()
    $.curId = null
    actions.showScreen('statements')
    const bi = $.buffer.statements.indexOf(id)
    if (bi !== -1) {
      $.buffer.statements.splice(bi, 1)
    }
    for (const sid in $.statements) {
      const { type, ids } = $.statements[sid].premises
      if (type === 'statements' && ids.includes(id)) {
        actions.removePremise(id, sid)
      }
    }
  },
  deleteEvent: (eid) => {
    delete $.events[eid]
    db.events.where('id').equals(eid).delete()
    const bi = $.buffer.events.indexOf(eid)
    if (bi !== -1) {
      $.buffer.events.splice(bi, 1)
    }
    for (const sid in $.statements) {
      const { type, premises, causation } = $.statements[sid]
      if (premises.type === 'causalNet') {
        const { event, conditions } = premises
        if (event === eid) {
          actions.removePremiseEvent(sid)
        }
        if (conditions.hasOwnProperty(eid)) {
          actions.removePremiseCondition(eid, sid)
        }
      }
      if (type === 'causation') {
        const { causes, effect } = causation
        if (effect === eid) {
          actions.removeCausationEffect(sid)
        }
        if (causes.hasOwnProperty(eid)) {
          actions.removeCausationCause(eid, sid)
        }
      }
    }
  },
  toggleBuffer: (e, id, type) => {
    const i = $.buffer[type].indexOf(id)
    if (i === -1) {
      $.buffer[type].push(id)
    } else {
      $.buffer[type].splice(i, 1)
    }
    e.stopPropagation()
  },
  toggleUserId: () => {
    $.userId = ($.userId + 1) % $.users.length
  },
  setUserId: (userId) => {
    $.userId = userId
  },
  edit: () => $.editing = true,
  stopEdit: () => $.editing = false,
}

const stateChangeAfter = (obj) => {
  for (const key in obj) {
    const a = obj[key]
    if (typeof a === 'function') {
      obj[key] = (...args) => {
        const msg = a(...args)
        if (msg !== 'noChange') {
          stateChange()
        }
      }
    } else {
      stateChangeAfter(a)
    }
  }
}
stateChangeAfter(actions)
