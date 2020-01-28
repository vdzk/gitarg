import { html } from '../../../../third_party/lit-html/lit-html.js'
import { $ } from '../../../state.js'
import { actions } from '../../../actions/actions.js'
import { StatementsPremises } from './statements.js'
import { LinkPremises } from './links.js'
import { CausalNetPremises } from './causalNet.js'
import { Connectedness } from './connectedness.js'

const premiseTypes = {
  statements: {
    label: 'список утверждений',
    view: StatementsPremises
  },
  links: {
    label: 'cсылки',
    view: LinkPremises
  },
  causalNet: {
    label: 'причино-следственная сеть',
    view: CausalNetPremises
  },
  // //NOTE: work in progress
  // connectedness: {
  //   label: 'связанность',
  //   view: Connectedness
  // },
}

const PremiseTypeOption = (type) => html`
  <option value=${type} ?selected=${type === $.statement.premises.type}>
    ${premiseTypes[type].label}
  </option>
`

const PremisesType = () => html`
  <div class="field">
    <label class="label">Тип посылок</label>
    <div class="control">
      <div class="select is-danger">
        <select
          .value=${$.statement.premises.type}
          @change=${(e) => actions.set.premisesType(e.target.value)}
        >
          ${['statements', 'causalNet', 'links'].map(PremiseTypeOption)}
        </select>
      </div>
    </div>
  </div>
`

export const Premises = () => html`
  ${($.editing) ? PremisesType() : ''}
  ${premiseTypes[$.statement.premises.type].view()}
`
