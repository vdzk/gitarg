import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions.js'

const HomeBtn = () => html`
  <button
    class="button"
    @click=${() => actions.showId($.mainStatement)}
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
    @click=${() => actions.showScreen('statements')}
    ?disabled=${$.screen === 'statements'}
  >
    Утверждения
  </button>
`

const AddBtn = () => html`
  <button
    class="button is-pulled-right"
    @click=${actions.addItem}
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
    @click=${() => actions.showScreen('events')}
    ?disabled=${$.screen === 'events'}
  >
    События
  </button>
`

const Saves = () => html`
  <button
    class="button"
    @click=${() => actions.showScreen('saves')}
    ?disabled=${$.screen === 'saves'}
  >
    <span class="icon">
      <i class="fas fa-save"></i>
    </span>
    <span>Сохранения</span>
  </button>
`

const Perspective = () => html`
  <button
    class="button is-pulled-right"
    @click=${actions.toggleUserId}
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
    ${AddBtn()}
    <span class="is-pulled-right">
      &nbsp;
    </span>
    ${Perspective()}
  </div>
`
