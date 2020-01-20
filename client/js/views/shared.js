import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions/actions.js'

export const Copy = (type, id) => {
  const inBuffer = $.buffer[type].includes(id)
  const iconClass = `fa${(inBuffer) ? 's' : 'r'} fa-copy`
  const iconText = (inBuffer) ? 'убрать из буфера' : 'копировать'
  return html`
    <span
      class="icon" title=${iconText}
      @click=${(e) => actions.toggle.buffer(e, id, type)}
    >
      <i class=${iconClass}></i>
    </span>
  `
}

export const Hint = (text) => html`
  <div class="control has-tooltip-bottom has-tooltip-multiline" data-tooltip=${text}>
    <a class="button is-static">
      <span class="icon ">
        <i class="far fa-question-circle"></i>
      </span>
    </a>
  </div>
`

export const Open = (id) => html`
  <span
    class="icon is-clickable"
    title="открыть"
    @click=${() => actions.set.curId(id)}
  >
    <i class="far fa-arrow-alt-circle-right"></i>
  </span>
`
