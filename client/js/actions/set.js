import { $ } from '../state.js'
import { db } from '../db.js'
import { actions } from './actions.js'

export const set = {
  screen: (screen) => $.screen = screen,
  userId: (userId) => $.userId = userId,
  editing: (editing) => $.editing = editing,
  treeView: (treeView) => $.treeView = treeView,
  connectednessView: (v) => $.connectedness.view = v,
  curId: (id) => {
    set.screen('statement')
    set.editing(false)
    actions.remove.modal()
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
  hiddenVariable: (eid, happened) => {
    const { id, premises } = $.statement
    premises.hiddenVariables[eid] = happened
    db.statements.update(id, {premises})
  },
  observation: (happened) => {
    const { id, observation } = $.statement
    observation.happened = happened
    db.statements.update(id, {observation})
  },
  text: (text) => {
    $.statement.text = text
    db.statements.update($.curId, { text })
  },
  modQuest: (modQuest) => {
    $.statement.modQuest = modQuest
    db.statements.update($.curId, { modQuest })
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
    const props = {
      type, causation: null,
      observation: null,
      quote: null
    }
    if (type === 'causation') {
      actions.add.causation()
      delete props['causation']
    } else if (type === 'observation') {
      actions.add.observation()
      delete props['observation']
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
    } else if (type === 'links') {
      premises.links = []
    } else if (type === 'causalNet') {
      premises.event = null
      premises.conditions = {}
    } else if (type === 'connectedness') {
      premises.observations = []
      premises.hiddenVariables = {}
    }
    $.statement.premises = premises
    db.statements.update($.curId, {premises})
  },
}
