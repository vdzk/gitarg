import { html } from '../../../third_party/lit-html/lit-html.js'
import { $ } from '../../state.js'
import { actions } from '../../actions/actions.js'
import { modVar } from '../../constants.js'
import { Hint } from '../shared.js'

//TODO: rename 'causation' => 'probFunc' in code and data
const TypeLabels = {
  simple: 'простое',
  quote: 'цитата',
  causation: 'функция вероятности',
  observation: 'наблюдение',
}

const TypeOption = ([type, label]) => html`
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
          ${Object.entries(TypeLabels).map(TypeOption)}
        </select>
      </div>
    </div>
  </div>
`

const Effect = (eid) => html`
  <div class="list-item">
    ${ $.events[eid].text }
    <span
      class="icon is-pulled-right is-clickable"
      @click=${() => actions.remove.causationEffect()}
    >
      <i class="fas fa-times"></i>
    </span>
  </div>
`

const EffectEditor = () => {
  const eid = $.statement.causation.effect
  return html`
    <div class="field">
      <label class="label">Событие</label>
      <div class="control">
        <div class="list">
          ${(eid) ? Effect(eid) : ''}
        </div>
      </div>
      <button
        class="button"
        ?disabled=${$.buffer.events.length === 0}
        @click=${actions.paste.effect}
      >
        Вставить
      </button>
    </div>
  `
}

const Cause = ([eid, weights]) => html`
  <div class="box is-inline-block">
    <div class="field">
      <div class="control">
        ${$.events[eid].text}
        <span
          class="icon is-clickable is-pulled-right"
          @click=${() => actions.remove.causationCause(eid)}
          title="Удалить причину"
        >
        <i class="fas fa-times"></i>
      </span>
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

const Causes = (causes) => html`
  <div class="field">
    <label class="label">Причины</label>
    <div class="control">
      ${causes.map(Cause)}
    </div>
    <div class="field">
      <button
        class="button"
        ?disabled=${$.buffer.events.length === 0}
        @click=${actions.paste.causes}
      >
        Вставить
      </button>
    </div>
  </div>
`

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
    ${Causes(causes)}
    ${EffectEditor()}
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

const Causation = () => ($.editing) ? CausationEditor() : CausationViewer()

//TODO: merge with Condition() ?
const ObservationItem = () => {
  const { event, happened }= $.statement.observation
  return html`
    <div class="list-item">
      ${$.events[event].text}
      <button
        class=${'button is-list-item-button ' + ((happened) ? 'is-success' : 'is-light')}
        @click=${() => actions.set.observation(!happened)}
      >
        ${(happened) ? 'свершилось': 'не свершилось'}
      </button>
      <span
        class="icon is-pulled-right is-clickable"
        @click=${() => actions.remove.observation()}
      >
        <i class="fas fa-times"></i>
      </span>
    </div>
  `
}

//TODO: merge with ConditionsEditor?
const ObservationEditor = () => html`
  <div class="field">
    <label class="label">Наблюдение</label>
    <div class="control">
      <div class="list">
        ${($.statement.observation.event === null) ? '' : ObservationItem()}
      </div>
    </div>
    <button
      class="button"
      ?disabled=${$.buffer.events.length === 0}
      @click=${actions.paste.observation}
    >
      Вставить
    </button>
  </div>
`

const ObservationViewer = () => html`
  <div class="field">
    <label class="label">
      Вывод
    </label>
    ${$.statement.modText}
  </div>
`

const Observation = () => ($.editing) ? ObservationEditor() : ObservationViewer()

const QuoteEditor = () => html`
  <textarea
    class="textarea"
    .value=${$.statement.quote}
    @change=${(e) => actions.set.quote(e.target.value)}
  >
  </textarea>
`

const QuoteText = () => $.statement.quote.split(/\r?\n/).map((line) => html`
  <div>${line}</div>
`)

const Quote = () => html`
  <div class="field">
    <label class="label">Цитата</label>
    <div class="control">
      ${($.editing) ? QuoteEditor() : QuoteText()}
    </div>
  </div>
`

const Text = () => html`
  <div>
    ${$.statement.modText}
  </div>
`

const TextInput = () => html`
  <div class="control">
    <input
      class="input"
      type="text"
      .value=${$.statement.text}
      @change=${(e) => actions.set.text(e.target.value)}
    >
  </div>
`

const Modifier = (name, i) => html`
  <div class="field">
    <label class="label">Модификатор</label>
  </div>
  <div class="field has-addons">
    <p class="control">
      <a class="button is-static">
        <span class="icon">
          <i class="fas fa-user"></i>
        </span>
        <span>
          ${$.users[$.userId]}
        </span>
      </a>
    </p>
    <p class="control">
      <a class="button is-static">
        ${modVar} =
      </a>
    </p>
    <p class="control">
      <input
        .value=${$.statement.modifiers[$.userId]}
        @change=${(e) => actions.set.modifier(e.target.value)}
        class="input"
        type="text"
      >
    </p>
    <p class="control">
      <a
        class="button"
        @click=${() => actions.set.modifier(null)}
      >
        <span class="icon">
          <i class="fas fa-trash-alt"></i>
        </span>
      </a>
    </p>
  </div>
`

const TextConclusion = () => html`
  <div class="field">
    <label class="label">Вывод</label>
    ${($.editing) ? TextInput() : Text()}
  </div>
  ${($.editing) ? Modifier() : ''}
`

export const Conclusion = () => {
  const { type } = $.statement
  return html`
    ${($.editing) ? SelectType() : ''}
    ${(type === 'quote') ? Quote() : ''}
    ${(type === 'causation') ? Causation() : '' }
    ${(type === 'observation') ? Observation() : '' }
    ${(['simple', 'quote'].includes(type)) ? TextConclusion() : ''}
  `
}
