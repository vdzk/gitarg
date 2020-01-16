import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions/actions.js'
import { Copy } from './shared.js'

const Edit = (id) => {
  const { editing } = $.events[id]
  const iconClass = `fa${(editing) ? 's' : 'r'} fa-edit`
  const iconText = (editing) ? 'закончить редактирование' : 'редактировать'
  return html`
    <span
      class="icon" title=${iconText}
      @click=${() => actions.toggle.eventEdit(id)}
    >
      <i class=${iconClass}></i>
    </span>
  `
}

const Editor = (id, text) => html`
  <input
    class="input is-panel-input"
    type="text"
    .value=${text}
    @change=${(e) => actions.set.eventText(id, e.target.value)}
  >
  <span
    class="icon" title="удалить"
    @click=${() => actions.delete.event(id)}
  >
    <i class="fas fa-times"></i>
  </span>
`

const Text = (text) => html`
  <span class="flex-1">${text}</span>
`

const Event = ({id, text, editing}) => html`
  <a class="panel-block">
    ${(editing) ? Editor(id, text) : Text(text)}
    ${Edit(id)}
    ${Copy('events', id)}
  </a>
`

export const Events = () => html`
  <article class="panel is-primary has-background-white">
    <p class="panel-heading">
      События
    </p>
    ${Object.values($.events).map(Event)}
  </article>
`
