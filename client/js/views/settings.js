import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions.js'

const ProjectName = () => html`
  <div class="field">
    <label class="label">Название проекта</label>
    <div class="control">
      <input
        class="input"
        type="text"
        .value=${$.projectName}
        @change=${e => actions.setProjectName(e.target.value)}
      >
    </div>
  </div>
`

const Statement = (sid) => html`
  <div class="list-item">
    ${ $.statements[sid].modText }
    <span
      class="icon is-pulled-right is-clickable"
      @click=${() => actions.removeMainStatement()}
    >
      <i class="fas fa-times"></i>
    </span>
  </div>
`

const MainStatement = () => html`
  <div class="field">
    <label class="label">Главное утверждение</label>
    <div class="control">
      <div class="list">
        ${($.mainStatement) ? Statement($.mainStatement) : ''}
      </div>
    </div>
    <button
      class="button"
      ?disabled=${$.buffer.statements.length === 0}
      @click=${actions.paste2mainStatement}
    >
      Вставить
    </button>
  </div>
`

const User = (name, i) => html`
  <div class="field">
    <label class="label">Псевдоним №${i + 1}</label>
    <div class="control">
      <input
        class="input"
        type="text"
        .value=${$.users[i]}
        @change=${e => actions.setUserName(i, e.target.value)}
      >
    </div>
  </div>
`

export const Settings = () => html`
  ${ProjectName()}
  ${MainStatement()}
  ${$.users.map(User)}
`
