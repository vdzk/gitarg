import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions/actions.js'
import { Copy, Open } from './shared.js'
import { eventIdPrefix } from '../constants.js'

const Statement = ({id, modText}) => html`
  <a class="panel-block" @click=${() => actions.set.curId(id)}>
    <span class="flex-1">${modText}</span>
    ${Copy('statements', id)}
  </a>
`

const ListView = () => html`
  <article class="panel is-primary has-background-white">
    <p class="panel-heading">
      Утверждения
    </p>
    ${Object.values($.statements).map(Statement)}
  </article>
`

const AddPremise = (sid) => html`
  <span
    class="icon is-clickable"
    @click=${() => actions.add.premise(sid)}
    title="добавить посылку"
  >
    <i class="fas fa-plus-square"></i>
  </span>
`

const TreeViewItem = ({pid, indent, type, id}) => {
  let text, expanded, canExpand
  let canAddPremise = false
  let expId = id
  if (type === 'statement') {
    const { modText, premises, event } = $.statements[id]
    text = modText
    expanded = $.expanded[id] === pid
    if (premises.type === 'statements') {
      canExpand = premises.ids.length > 0
      canAddPremise = true
    } else if (premises.type === 'causalNet') {
      canExpand = event !== null
    } else if (premises.type === 'connectedness') {
      canExpand = (premises.observations.length > 0)
        && $.statements[premises.observations[0]].observation.event !== null
    } else if (premises.type === 'links') {
      canExpand = premises.links.length > 0
    }
  } else if (type === 'causalNet') {
    text = 'Причинно-следственная сеть: "' + $.events[id].text + '"'
    expId = eventIdPrefix + id
    expanded = $.expanded[expId] === pid
    canExpand = true
  } else if (type === 'link') {
    const { title, url } = $.statements[pid].premises.links[id]
    text = html`
      <a href=${url} target="_blank">
        ${title}
      </a>
    `
    canExpand = false
  }

  let expander
  if (expanded) {
    expander = html`
      <span class="icon is-clickable" @click=${() => actions.remove.expanded(expId)}>
        <i class="far fa-minus-square"></i>
      </span>
    `
  } else if (canExpand) {
    expander = html`
      <span class="icon is-clickable" @click=${() => actions.add.expanded(expId, pid)}>
        <i class="far fa-plus-square"></i>
      </span>
    `
  } else {
    expander = html`
      <span class="icon is-invisible">
        <i class="far fa-plus-square"></i>
      </span>
    `
  }

  return html`
    <div class="tree-view-item is-flex" style=${'--indent:' + indent}>
      <div>${expander}</div>
      <div class="flex-1">
        ${text}
        ${(type === 'statement') ? Open(id) : ''}
        ${(canAddPremise) ? AddPremise(id) : ''}
        ${(type === 'statement') ? Copy('statements', id) : ''}
      </div>
    </div>
  `
}


const TreeView = () => {
  if ($.mainStatement === null) {
    return html`
      <article class="message">
        <div class="message-body">
          Пожалуйста сначала выбирите главное утверждение в настройках.
        </div>
      </article>
    `
  } else {
    return html`
      ${$.premisesTree.map(TreeViewItem)}
    `
  }
}

export const Statements = () => html`
  <div class="field">
    <button class="button" @click=${actions.toggle.treeView} ?disabled=${!$.treeView}>
      <span class="icon">
        <i class="fas fa-th-list"></i>
      </span>
      <span>Список</span>
    </button>
    <button
      class="button"
      @click=${actions.toggle.treeView}
      ?disabled=${$.treeView || $.mainStatement === null}
    >
      <span class="icon">
        <i class="fas fa-sitemap"></i>
      </span>
      <span>Дерево</span>
    </button>
  </div>
  ${($.treeView) ? TreeView() : ListView()}
`
