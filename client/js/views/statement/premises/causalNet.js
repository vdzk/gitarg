import { html } from '../../../../third_party/lit-html/lit-html.js'
import { $ } from '../../../state.js'
import { actions } from '../../../actions/actions.js'
import { Graph } from '../../graph.js'
import { Assignment, Paster, Remove } from '../../shared.js'

const Event = (eid) => html`
  <div class="list-item">
    ${ $.events[eid].text }
    ${ Remove(actions.remove.premiseEvent) }
  </div>
`

const getEventEditor = () => {
  const eid = $.statement.premises.event
  return Paster({
    label: 'Событие',
    content: (eid) ? Event(eid) : '',
    source: 'events',
    target: 'event',
  })
}

const getConditions = () => Object.entries($.statement.premises.conditions)
  .map(([eid, happened]) => Assignment({
    eid, happened,
    toggle: () => actions.set.premiseCondition(eid, !happened),
    remove: () => actions.remove.premiseCondition(eid)
  }))

const getConditionsEditor = () => Paster({
  label: 'Условия',
  content: getConditions(),
  source: 'events',
  target: 'conditions',
})

const CausalNetQuery = () => html`
  ${getConditionsEditor()}
  ${getEventEditor()}
`

const CausalNet = () => html`
  <label class="label">Причинно-следственная сеть</label>
  ${Graph()}
`

export const CausalNetPremises = () => ($.editing) ? CausalNetQuery() : CausalNet()
