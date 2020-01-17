import { $ } from '../state.js'
import { db } from '../db.js'
import { actions } from './actions.js'

export const set = {
  screen: (screen) => $.screen = screen,
  userId: (userId) => $.userId = userId,
  editing: (editing) => $.editing = editing,
  treeView: (treeView) => $.treeView = treeView,
  curId: (id) => {
    set.screen('statement')
    set.editing(false)
    $.curId = id
  },
  linkTitle: (i, title) => {
    const { id, premises } = $.statement
    premises.links[i].title = title
    db.statements.update(id, { premises })
  },
  linkUrl: (i, url) => {
    const { id, premises } = $.statement
    premises.links[i].url = url
    db.statements.update(id, { premises })
  },
  premiseCondition: (cid, happened) => {
    const { id, premises } = $.statement
    premises.conditions[cid] = happened
    db.statements.update(id, {premises})
  },
  text: (text) => {
    $.statement.text = text
    db.statements.update($.curId, { text })
  },
  quote: (quote) => {
    $.statement.quote = quote
    db.statements.update($.curId, { quote })
  },
  modifier: (t) => {
    const { id, modifiers } = $.statement
    modifiers[$.userId] = t
    db.statements.update($.statement.id, {modifiers})
  },
  prob: (key, p) => {
    let { id, causation } = $.statement
    causation[key][$.userId] = p
    db.statements.update(id, {causation})
  },
  weight: (eid, w) => {
    const { id, causation } = $.statement
    causation.causes[eid][$.userId] = w
    db.statements.update(id, {causation})
  },
  projectName: (name) => {
    $.projectName = name
    db.params.update('project', { name })
  },
  userName: (i, name) => {
    $.users[i] = name
    db.params.update('users', { names: $.users })
  },
  eventText: (id, text) => {
    $.events[id].text = text
    db.events.update(id, { text })
  },
  type: (type) => {
    $.statement.type = type
    const props = { type, causation: null, quote: null }
    if (type === 'causation') {
      actions.add.causation()
      delete props['causation']
    } else if (type === 'quote') {
      props.quote = ''
    }
    Object.assign($.statement, props)
    db.statements.update($.curId, props)
  },
  premisesType: (type) => {
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
}
