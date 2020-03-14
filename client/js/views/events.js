import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions/actions.js'
import { Copy, Remove } from './shared.js'

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

const ProbFunc = (id, probFunc) => {
  const iconClass = 'fas fa-percentage ' + ((probFunc) ? '' : 'has-text-grey-lighter')
  const iconText = ((probFunc) ? 'редактировать' : 'добавить') + ' функцию вероятности'
  const onClick = (probFunc)
    ? () => actions.set.curId(probFunc, true)
    : () => actions.add.probFunc(id)
  return html`
    <span class="icon" title=${iconText} @click=${onClick}>
      <i class=${iconClass}></i>
    </span>
  `
}

const Observe = (id) => {
  const observation = $.observations[id]
  let iconClass, iconText, onClick
  if (!observation) {
    iconText = 'добавить наблюдение'
    iconClass = 'far fa-eye has-text-grey-lighter'
    onClick = () => actions.add.observationStatement(id)
  } else if (observation.happened) {
    iconText = 'сбылось, открыть'
    iconClass = 'far fa-eye'
    onClick = () => actions.set.curId(observation.sid)
  } else {
    iconText = 'не сбылось, открыть'
    iconClass = 'far fa-eye-slash'
    onClick = () => actions.set.curId(observation.sid)
  }
  return html`
    <span class="icon" title=${iconText} @click=${onClick}>
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
    @click=${() => actions.remove.event(id)}
  >
    <i class="fas fa-times"></i>
  </span>
`

const Text = (text) => html`
  <span class="flex-1">${text}</span>
`

const Event = ({id, text, editing, probFunc}) => html`
  <a class="panel-block">
    ${(editing) ? Editor(id, text) : Text(text)}
    ${Edit(id)}
    ${ProbFunc(id, probFunc)}
    ${Observe(id)}
    ${Copy('events', id)}
  </a>
`

export const Events = () => html`
  <article class="panel is-primary has-background-white">
    <p class="panel-heading">
      События
    </p>
    ${Object.values($.events).reverse().map(Event)}
  </article>
`
