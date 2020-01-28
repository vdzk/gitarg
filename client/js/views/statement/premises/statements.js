import { html } from '../../../../third_party/lit-html/lit-html.js'
import { $ } from '../../../state.js'
import { actions } from '../../../actions/actions.js'
import { Open, Paster, Remove } from '../../shared.js'

const Premise = (pid) => html`
  <div class="list-item">
    ${ $.statements[pid].modText }
    ${ Open(pid) }
    ${ Remove((e) => actions.remove.premise(pid)) }
  </div>
`

const getPremiseEditor = () => Paster({
  label: 'Посылки',
  content: $.statement.premises.ids.map(Premise),
  source: 'statements',
  target: 'premises',
})

const SimplePremise = (pid) => html`
  <li>
    ${ $.statements[pid].modText }
    ${Open(pid)}
  </li>
`

const PremiseViewer = () => html`
  <div class="field">
    <label class="label">Посылки</label>
    <div class="content">
      <ul>
        ${$.statement.premises.ids.map(SimplePremise)}
      </ul>
    </div>
  </div>
`

export const StatementsPremises = () => ($.editing)
  ? getPremiseEditor()
  : PremiseViewer()
