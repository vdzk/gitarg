import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions/actions.js'

const HomeBtn = () => html`
  <button
    class="button"
    @click=${() => actions.set.curId($.mainStatement)}
    ?disabled=${$.mainStatement === null}
    title="Перейти к главному утверждению"
  >
    <span class="icon">
      <i class="fas fa-home"></i>
    </span>
  </button>
`

const AllBtn = () => html`
  <button
    class="button"
    @click=${() => actions.set.screen('statements')}
    ?disabled=${$.screen === 'statements'}
  >
    Утверждения
  </button>
`

const AddBtn = () => html`
  <button
    class="button is-pulled-right"
    @click=${actions.add.item}
    title="Новое утверждение/событие"
  >
    <span class="icon">
      <i class="fas fa-plus"></i>
    </span>
  </button>
`

const Events = () => html`
  <button
    class="button"
    @click=${() => actions.set.screen('events')}
    ?disabled=${$.screen === 'events'}
  >
    События
  </button>
`

const Saves = () => html`
  <button
    class="button"
    @click=${() => actions.set.screen('saves')}
    ?disabled=${$.screen === 'saves'}
  >
    <span class="icon">
      <i class="fas fa-save"></i>
    </span>
    <span>Сохранения</span>
  </button>
`

const Settings = () => html`
  <button
    class="button"
    @click=${() => actions.set.screen('settings')}
    ?disabled=${$.screen === 'settings'}
  >
    <span class="icon">
      <i class="fas fa-cog"></i>
    </span>
    <span>Настройки</span>
  </button>
`

const Perspective = () => html`
  <button
    class="button is-pulled-right"
    @click=${actions.toggle.userId}
    title='переключить пользователя модификаторов'
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
    ${AllBtn()}
    ${Events()}
    ${Saves()}
    ${Settings()}
    ${AddBtn()}
    <span class="is-pulled-right">
      &nbsp;
    </span>
    ${Perspective()}
  </div>
`
