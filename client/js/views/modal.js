import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions/actions.js'

const modalTypes = {
  duplicateCausation: ({ eid, sid }) => html`
    <article class="message is-warning">
      <div class="message-header">
        <p>Ошибка ввода</p>
        <button
          class="delete"
          aria-label="close"
          @click=${actions.remove.modal}
        ></button>
      </div>
      <div class="message-body">
        Функция вероятности события "${$.events[eid].text}" уже
        <a @click=${() => actions.set.curId(sid)}>
          существует
        </a>.
      </div>
    </article>
  `
}

export const Modal = () => html`
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      ${ modalTypes[$.modal.type]($.modal) }
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click=${actions.remove.modal}
    ></button>
  </div>
`
