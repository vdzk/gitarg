import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions/actions.js'

const itemTypes = [
  { type: 'statement', screen: 'statements', title: 'Суждения'},
  { type: 'event', screen: 'events', title: 'События'},
]

const ItemType = ({ type, screen, title }) => html`
  <div class="field has-addons is-inline-flex">
    <p class="control">
      <button
        class="button"
        @click=${() => actions.set.screen(screen)}
        ?disabled=${$.screen === screen}
      >
        ${title}
      </button>
    </p>
    <p class="control">
      <button
        class="button"
        @click=${actions.add[type]}
        title="Добавить"
      >
        <span class="icon">
          <i class="fas fa-plus"></i>
        </span>
      </button>
    </p>
  </div>
`

const HomeBtn = () => html`
  <button
    class="button"
    @click=${() => actions.set.curId($.mainStatement)}
    ?disabled=${$.mainStatement === null}
    title="Перейти к тезису"
  >
    <span class="icon">
      <i class="fas fa-home"></i>
    </span>
  </button>
`

const Saves = () => html`
  <button
    class="button"
    @click=${() => actions.set.screen('saves')}
    ?disabled=${$.screen === 'saves'}
    title="Сохранения"
  >
    <span class="icon">
      <i class="fas fa-save"></i>
    </span>
  </button>
`

const Settings = () => html`
  <button
    class="button"
    @click=${() => actions.set.screen('settings')}
    ?disabled=${$.screen === 'settings'}
    title="Настройки"
  >
    <span class="icon">
      <i class="fas fa-cog"></i>
    </span>
  </button>
`

const Guide = () => html`
  <a
    class="button"
    title="Руководство"
    href="https://dante-ga.gitbook.io/gitarg/"
    target="_blank"
  >
    <span class="icon">
      <i class="fas fa-info"></i>
    </span>
  </a>
`

const Perspective = () => html`
  <button
    class="button"
    @click=${actions.toggle.userId}
    title='переключить пользователя'
  >
    <span class="icon" >
      <i class="fas fa-user"></i>
    </span>
    <span>
      ${$.users[$.userId]}
    </span>
  </button>
`

export const Controls = () => html`
  <div class="field">
    ${HomeBtn()}
    ${itemTypes.map(ItemType)}
    ${Perspective()}
    <span class="is-pulled-right">
      ${Guide()}
      ${Saves()}
      ${Settings()}
    </span>
  </div>
`
