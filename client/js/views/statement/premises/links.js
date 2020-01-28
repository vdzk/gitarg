import { html } from '../../../../third_party/lit-html/lit-html.js'
import { $ } from '../../../state.js'
import { actions } from '../../../actions/actions.js'

const Link = ({title, url}) => html`
  <li>
    <a href=${url} target="_blank">
      ${title}
    </a>
  </li>
`

const LinksViewer = () => html`
  <div class="content">
    <ul>
      ${$.statement.premises.links.map(Link)}
    </ul>
  </div>
`

const LinkEditor = ({title, url}, i) => html`
  <div class="field has-addons">
    <p class="control">
      <a class="button is-static">
        <span class="icon" titl="Название">
          <i class="far fa-bookmark"></i>
        </span>
      </a>
    </p>
    <p class="control is-expanded">
      <input
        .value=${title}
        @change=${(e) => actions.set.linkTitle(i, e.target.value)}
        class="input"
        type="text"
      >
    </p>
    <p class="control">
      <a class="button is-static">
        <span class="icon" title="URL">
          <i class="fas fa-link"></i>
        </span>
      </a>
    </p>
    <p class="control is-expanded">
      <input
        .value=${url}
        @change=${(e) => actions.set.linkUrl(i, e.target.value)}
        class="input"
        type="text"
      >
    </p>
    <p class="control">
      <a
        class="button is-danger"
        @click=${() => actions.remove.link(i)}
      >
        <span class="icon">
          <i class="fas fa-times"></i>
        </span>
      </a>
    </p>
  </div>
`

const LinksEditor = () => html`
  ${$.statement.premises.links.map(LinkEditor)}
  <button class="button" @click=${actions.add.link}>
    Добавить
  </button>
`

export const LinkPremises = () => html`
  <div class="field">
    <label class="label">Ссылки</label>
    ${($.editing) ? LinksEditor() : LinksViewer()}
  </div>
`
