import { html } from '../../../third_party/lit-html/lit-html.js'
import { $ } from '../../state.js'
import { actions } from '../../actions.js'
import { Graph } from '../graph.js'
import { Open } from '../shared.js'

const Premise = (pid) => html`
  <div class="list-item">
    ${ $.statements[pid].modText }
    ${Open(pid)}
    <span
      class="icon is-pulled-right is-clickable"
      @click=${(e) => actions.removePremise(pid)}
    >
      <i class="fas fa-times"></i>
    </span>
  </div>
`

const Paste = () => html`
  <button
    class="button"
    ?disabled=${$.buffer.statements.length === 0}
    @click=${actions.paste2premises}
  >
    Вставить
  </button>
`

const PremiseEditor = () => html`
  <div class="control">
    <div class="list">
      ${$.statement.premises.ids.map(Premise)}
    </div>
  </div>
  ${Paste()}
`

const SimplePremise = (pid) => html`
  <li>
    ${ $.statements[pid].modText }
    ${Open(pid)}
  </li>
`

const PremiseViewer = () => html`
  <div class="content">
    <ul>
      ${$.statement.premises.ids.map(SimplePremise)}
    </ul>
  </div>
`

const premiseTypeLabels = {
  statements: 'список утверждений',
  causalNet: 'причино-следственная сеть',
  links: 'cсылки',
}

const PremiseTypeOption = (type) => html`
  <option value=${type} ?selected=${type === $.statement.premises.type}>
    ${premiseTypeLabels[type]}
  </option>
`

const PremisesType = () => html`
  <div class="field">
    <label class="label">Тип посылок</label>
    <div class="control">
      <div class="select is-danger">
        <select
          .value=${$.statement.premises.type}
          @change=${(e) => actions.setPremisesType(e.target.value)}
        >
          ${['statements', 'causalNet', 'links'].map(PremiseTypeOption)}
        </select>
      </div>
    </div>
  </div>
`

const StatementsPremises = () => html`
  <div class="field">
    <label class="label">Посылки</label>
    ${($.editing) ? PremiseEditor() : PremiseViewer()}
  </div>
`

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
        @change=${(e) => actions.setLinkTitle(i, e.target.value)}
        class="input"
        type="text"
      >
    </p>
    <p class="control">
      <a class="button is-static">
        <span class="icon" titl="URL">
          <i class="fas fa-link"></i>
        </span>
      </a>
    </p>
    <p class="control is-expanded">
      <input
        .value=${url}
        @change=${(e) => actions.setLinkUrl(i, e.target.value)}
        class="input"
        type="text"
      >
    </p>
    <p class="control">
      <a
        class="button is-danger"
        @click=${() => actions.removeLink(i)}
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
  <button class="button" @click=${actions.addLink}>
    Добавить
  </button>
`

const LinkPremises = () => html`
  <div class="field">
    <label class="label">Ссылки</label>
    ${($.editing) ? LinksEditor() : LinksViewer()}
  </div>
`

const Event = (eid) => html`
  <div class="list-item">
    ${ $.events[eid].text }
    <span
      class="icon is-pulled-right is-clickable"
      @click=${() => actions.removePremiseEvent()}
    >
      <i class="fas fa-times"></i>
    </span>
  </div>
`

const EventEditor = () => {
  const eid = $.statement.premises.event
  return html`
    <div class="field">
      <label class="label">Событие</label>
      <div class="control">
        <div class="list">
          ${(eid) ? Event(eid) : ''}
        </div>
      </div>
      <button
        class="button"
        ?disabled=${$.buffer.events.length === 0}
        @click=${actions.paste2event}
      >
        Вставить
      </button>
    </div>
  `
}

const Condition = ([cid, happened]) => html`
  <div class="list-item">
    ${$.events[cid].text}
    <button
      class=${'button is-list-item-button ' + ((happened) ? 'is-success' : 'is-light')}
      @click=${() => actions.setPremiseCondition(cid, !happened)}
    >
      ${(happened) ? 'свершилось': 'не свершилось'}
    </button>
    <span
      class="icon is-pulled-right is-clickable"
      @click=${() => actions.removePremiseCondition(cid)}
    >
      <i class="fas fa-times"></i>
    </span>
  </div>
`

const ConditionsEditor = () => html`
  <div class="field">
    <label class="label">Условия</label>
    <div class="control">
      <div class="list">
        ${Object.entries($.statement.premises.conditions).map(Condition)}
      </div>
    </div>
    <button
      class="button"
      ?disabled=${$.buffer.events.length === 0}
      @click=${actions.paste2conditions}
    >
      Вставить
    </button>
  </div>
`

const CausalNetQuery = () => html`
  ${ConditionsEditor()}
  ${EventEditor()}
`

const CausalNet = () => html`
  <label class="label">Причино-следственная сеть</label>
  ${Graph()}
`

const CausalNetPremises = () => ($.editing) ? CausalNetQuery() : CausalNet()

const premisesTypeViews = {
  statements: StatementsPremises,
  causalNet: CausalNetPremises,
  links: LinkPremises,
}

export const Premises = () => html`
  ${($.editing) ? PremisesType() : ''}
  ${premisesTypeViews[$.statement.premises.type]()}
`
