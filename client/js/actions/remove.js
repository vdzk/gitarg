import { $ } from '../state.js'
import { db } from '../db.js'
import { actions } from './actions.js'

export const remove = {
  modal: () => $.modal = null,
  expanded: (expId) => delete $.expanded[expId],
  link: (i) => {
    const { id, premises } = $.statement
    premises.links.splice(i, 1)
    db.statements.update(id, { premises })
  },
  probs: () => {
    const { id, causation } = $.statement
    for (const key of ['minP', 'midP', 'maxP']) {
      causation[key][$.userId] = null
    }
    db.statements.update(id, {causation})
  },
  premise: (pid, sid=$.curId) => {
    const { id, premises } = $.statements[sid]
    const i = premises.ids.indexOf(pid)
    if (i !== -1) {
      premises.ids.splice(i, 1)
      db.statements.update(id, {premises})
    }
  },
  connOb: (oid, sid=$.curId) => {
    const { id, premises } = $.statements[sid]
    const i = premises.observations.indexOf(oid)
    if (i !== -1) {
      premises.observations.splice(i, 1)
      db.statements.update(id, {premises})
    }
  },
  mainStatement: () => {
    $.mainStatement = null
    db.params.update('mainStatement', { sid: null })
  },
  premiseEvent: (sid=$.curId) => {
    const { id, premises } = $.statements[sid]
    premises.event = null
    db.statements.update(id, {premises})
  },
  premiseCondition: (cid, sid=$.curId) => {
    const { id, premises } = $.statements[sid]
    delete premises.conditions[cid]
    db.statements.update(id, {premises})
  },
  hiddenVariable: (eid, sid=$.curId) => {
    const { id, premises } = $.statements[sid]
    delete premises.hiddenVariables[eid]
    db.statements.update(id, {premises})
  },
  observation: (sid=$.curId) => {
    const { id, observation } = $.statements[sid]
    observation.event = null
    observation.happened = true
    db.statements.update(id, { observation })
  },
  causationEffect: (sid=$.curId) => {
    const { id, causation } = $.statements[sid]
    causation.effect = null
    db.statements.update(id, {causation})
  },
  causationCause: (eid, sid=$.curId) => {
    const { id, causation } = $.statements[sid]
    delete causation.causes[eid]
    if (Object.keys(causation.causes).length < 2) {
      causation.midP[$.userId] = null
    }
    db.statements.update(id, {causation})
  },
  statement: () => {
    const id = $.curId
    delete $.statements[id]
    db.statements.where('id').equals(id).delete()
    $.curId = null
    actions.set.screen('statements')
    const bi = $.buffer.statements.indexOf(id)
    if (bi !== -1) {
      $.buffer.statements.splice(bi, 1)
    }
    for (const sid in $.statements) {
      const { type, ids, observations } = $.statements[sid].premises
      if (type === 'statements' && ids.includes(id)) {
        remove.premise(id, sid)
      } else if (type === 'connectedness' && observations.includes(id)) {
        remove.connObs(id, sid)
      }
    }
    if ($.mainStatement === id) {
      remove.mainStatement()
    }
  },
  event: (eid) => {
    delete $.events[eid]
    db.events.where('id').equals(eid).delete()
    const bi = $.buffer.events.indexOf(eid)
    if (bi !== -1) {
      $.buffer.events.splice(bi, 1)
    }
    for (const sid in $.statements) {
      const { type, premises, causation, observation } = $.statements[sid]
      if (premises.type === 'causalNet') {
        const { event, conditions } = premises
        if (event === eid) {
          remove.premiseEvent(sid)
        }
        if (conditions.hasOwnProperty(eid)) {
          remove.premiseCondition(eid, sid)
        }
      } else if (premises.type === 'connectedness') {
        if (premises.hiddenVariables.hasOwnProperty(eid)) {
          remove.hiddenVariable(eid, sid)
        }
      }
      if (type === 'causation') {
        const { causes, effect } = causation
        if (effect === eid) {
          remove.causationEffect(sid)
        }
        if (causes.hasOwnProperty(eid)) {
          remove.causationCause(eid, sid)
        }
      } else if (type === 'observation' && observation.event === eid) {
        remove.observation(sid)
      }
    }
  },
}
