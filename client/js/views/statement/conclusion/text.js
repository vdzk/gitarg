import { html } from '../../../../third_party/lit-html/lit-html.js'
import { $ } from '../../../state.js'
import { actions } from '../../../actions/actions.js'
import { modVar, holeStr } from '../../../constants.js'
import { Hint } from '../../shared.js'

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
    <label class="label">Квантор</label>
  </div>
  <div class="field has-addons">
    ${Hint('Короткая форма вопроса которая описывает что нужно вставить вместо \\1 каждому из пользователей.')}
    <p class="control">
      <a class="button is-static">
        (
      </a>
    </p>
    <p class="control">
      <input
        .value=${$.statement.modQuest}
        @change=${(e) => actions.set.modQuest(e.target.value)}
        class="input"
        type="text"
      >
    </p>
    <p class="control">
      <a class="button is-static">
        ${holeStr.replace('(', '')}
      </a>
    </p>
    ${Hint('Ответ на вопрос слева который этот пользователь хочет вставить вместо \\1.')}
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

export const TextConclusion = () => html`
  <div class="field">
    <label class="label">Вывод</label>
    ${($.editing) ? TextInput() : Text()}
  </div>
  ${($.editing) ? Modifier() : ''}
`
