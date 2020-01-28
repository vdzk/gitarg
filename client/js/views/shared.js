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

export const Remove = (remove) => html`
  <span
    class="icon is-pulled-right is-clickable"
    @click=${remove}
  >
    <i class="fas fa-times"></i>
  </span>
`

export const Assignment = ({eid, happened, toggle, remove}) => html`
  <div class="list-item">
    ${$.events[eid].text}
    <button
      class=${'button is-list-item-button ' + ((happened) ? 'is-success' : 'is-light')}
      @click=${toggle}
      ?disabled=${!toggle}
    >
      ${(happened) ? 'свершилось': 'не свершилось'}
    </button>
    ${(remove) ? Remove(remove) : ''}
  </div>
`

export const Paster = ({ label, content, source, target, noList  }) => html`
  <div class="field">
    <label class="label">${label}</label>
    <div class="control">
      <div class=${(noList) ? '' : 'list'} >
        ${content}
      </div>
    </div>
    <button
      class="button"
      ?disabled=${$.buffer[source].length === 0}
      @click=${actions.paste[target]}
    >
      Вставить
    </button>
  </div>
`
