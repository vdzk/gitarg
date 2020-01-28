import { html } from '../../../../third_party/lit-html/lit-html.js'
import { $ } from '../../../state.js'
import { actions } from '../../../actions/actions.js'
import { Hint, Paster, Remove } from '../../shared.js'

const Effect = (eid) => html`
  <div class="list-item">
    ${ $.events[eid].text }
    ${ Remove(actions.remove.causationEffect) }
  </div>
`

const getEffectEditor = () => {
  const eid  = $.statement.causation.effect
  return Paster({
    label: 'Событие',
    content: (eid) ? Effect(eid) : '',
    source: 'events',
    target: 'effect',
  })
}

const Cause = ([eid, weights]) => html`
  <div class="box is-inline-block">
    <div class="field">
      <div class="control">
        ${$.events[eid].text}
        ${ Remove(() => actions.remove.causationCause(eid)) }
      </div>
    </div>
    <div class="field">
      <div class="control">
        <div class="field has-addons">
          <div class="control">
            <a class="button is-static">
              <span class="icon">
                <i class="fas fa-user"></i>
              </span>
              <span>
                ${$.users[$.userId]}
              </span>
            </a>
          </div>
          <div class="control">
            <a class="button is-static">
              <span class="icon">
                <i class="fas fa-balance-scale-right"></i>
              </span>
            </a>
          </div>
          ${Hint('Весовой коэффициент. Он отрицательный у причины которая противодействует следствию. Если причина одна то важен только знак (+/-).')}
          <div class="control">
            <input
              class="input"
              type="number"
              max="999"
              min="-999"
              .value=${weights[$.userId]}
              @change=${(e) => actions.set.weight(eid, e.target.value)}
            >
          </div>
          <div class="control">
            <a
              class="button"
              @click=${() => actions.set.weight(eid, null)}
            >
              <span class="icon">
                <i class="fas fa-trash-alt"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
`

const getCauses = (causes) => Paster({
  label: 'Причины',
  content: causes.map(Cause),
  source: 'events',
  target: 'causes',
  noList: true,
})

const probFieldLabels = {
  minP: 'минимальная',
  midP: 'cредняя',
  maxP: 'максимальная',
}

const probFieldHints = {
  minP: 'Найхудшая комбинация причин (в смысле влияния на вероятность следствия).',
  midP: 'Комбинации причин где половина хорошая а другая плохая (в смысле влияния на вероятность следствия).',
  maxP: 'Найлучшая комбинации причин (в смысле влияния на вероятность следствия).',
}

const ProbFieldDesc = (key) => html`
  <div class="control">
    <a class="button is-static">
      ${probFieldLabels[key]}
    </a>
  </div>
  ${Hint(probFieldHints[key])}
`

const ProbField = (key, showDesc) => html`
  ${(showDesc) ? ProbFieldDesc(key) : ''}
  <div class="control">
    <input
      class="input"
      type="number"
      min="0"
      max="100"
      .value=${$.statement.causation[key][$.userId]}
      @change=${(e) => actions.set.prob(key, e.target.value)}
    >
  </div>
  <div class="control">
    <a class="button is-static">
      %
    </a>
  </div>
`

const Probability = (fieldKeys, showDesc) => html`
  <div class="label">Вероятность события</div>
  <div class="field has-addons">
    <div class="control">
      <a class="button is-static">
        <span class="icon">
          <i class="fas fa-user"></i>
        </span>
        <span>
          ${$.users[$.userId]}
        </span>
      </a>
    </div>
    ${fieldKeys.map(key => ProbField(key, showDesc))}
    <div class="control">
      <a
        class="button"
        @click=${() => actions.remove.probs()}
      >
        <span class="icon">
          <i class="fas fa-trash-alt"></i>
        </span>
      </a>
    </div>
  </div>
`

const CausationEditor = () => {
  const causes = Object.entries($.statement.causation.causes)
  let fieldKeys
  if (causes.length === 0) {
    fieldKeys = ['midP']
  } else if (causes.length === 1) {
    fieldKeys = ['minP', 'maxP']
  } else {
    fieldKeys = ['minP', 'midP', 'maxP']
  }
  const showDesc = causes.length > 0
  return html`
    ${getCauses(causes)}
    ${getEffectEditor()}
    ${Probability(fieldKeys, showDesc)}
  `
}

const CausationViewer = () => html`
  <div class="field">
    <label class="label">
      Вывод
    </label>
    ${$.statement.modTextFull}
  </div>
`

export const Causation = () => ($.editing) ? CausationEditor() : CausationViewer()
