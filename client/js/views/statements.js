import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions.js'
import { Copy } from './shared.js'

const Statement = ({id, modText}) => html`
  <a class="panel-block" @click=${() => actions.showId(id)}>
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

const TreeView = () => 'в разработке'

export const Statements = () => html`
  <div class="field">
    <button class="button" @click=${actions.toggleTreeView} ?disabled=${!$.treeView}>
      <span class="icon">
        <i class="fas fa-th-list"></i>
      </span>
      <span>Список</span>
    </button>
    <button
      class="button"
      @click=${actions.toggleTreeView}
      ?disabled=${$.treeView || $.mainStatement === null}
    >
      <span class="icon">
        <i class="far fa-folder-open"></i>
      </span>
      <span>Дерево</span>
    </button>
  </div>
  ${($.treeView) ? TreeView() : ListView()}
`
