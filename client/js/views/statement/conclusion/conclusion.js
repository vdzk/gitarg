import { html } from '../../../../third_party/lit-html/lit-html.js'
import { $ } from '../../../state.js'
import { actions } from '../../../actions/actions.js'
import { modVar } from '../../../constants.js'
import { Hint, Paster, Remove } from '../../shared.js'
import { TextConclusion } from './text.js'
import { Quote } from './quote.js'
import { Causation } from './causation.js'
import { Observation } from './observation.js'

//TODO: rename 'causation' => 'probFunc' in code and data
//TODO: rename 'simple' => 'text' in code and data
const types = {
  simple: {
    label: 'текст',
    view: TextConclusion,
  },
  quote: {
    label: 'цитата',
    view: Quote,
  },
  causation: {
    label: 'функция вероятности',
    view: Causation,
  },
  observation: {
    label: 'наблюдение',
    view: Observation,
  },
}

const TypeOption = ([type, { label }]) => html`
  <option value=${type} ?selected=${type === $.statement.type}>
    ${label}
  </option>
`

const SelectType = () => html`
  <div class="field">
    <label class="label">Тип утверждения</label>
    <div class="control">
      <div class="select is-danger">
        <select
          .value=${$.statement.type}
          @change=${(e) => actions.set.type(e.target.value)}
        >
          ${Object.entries(types).map(TypeOption)}
        </select>
      </div>
    </div>
  </div>
`

export const Conclusion = () => html`
  ${($.editing) ? SelectType() : ''}
  ${types[$.statement.type].view()}
`
