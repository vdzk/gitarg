import { html } from '../../../../third_party/lit-html/lit-html.js'
import { $ } from '../../../state.js'
import { actions } from '../../../actions/actions.js'
import { Paster, Assignment } from '../../shared.js'

const getConnObs = () => $.statement.premises.observations
  .map((sid) => {
    const { event, happened } = $.statements[sid].observation
    return Assignment({
      eid: event,
      happened,
      remove: () => actions.remove.connOb(sid),
    })
  })

const getHiddenVariables = () => Object.entries($.statement.premises.hiddenVariables)
  .map(([eid, happened]) => Assignment({
    eid, happened,
    toggle: actions.set.hiddenVariable(eid, !happened),
    remove: () => actions.remove.hiddenVariable(eid),
  }))

const getConnectednessEditor = () => [
  Paster({
    label: 'Наблюдения',
    content: getConnObs(),
    source: 'statements',
    target: 'connObs',
  }),
  Paster({
    label: 'Скрытые события',
    content: getHiddenVariables(),
    source: 'events',
    target: 'hiddenVariables',
  })
]

const ConnectednessViewer = () => 'work in progress'

export const Connectedness = () => ($.editing)
  ? getConnectednessEditor()
  : ConnectednessViewer()
