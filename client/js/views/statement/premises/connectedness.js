import { html } from '../../../../third_party/lit-html/lit-html.js'
import { $ } from '../../../state.js'
import { actions } from '../../../actions/actions.js'
import { Paster, Assignment } from '../../shared.js'
import { Graph } from '../../graph.js'

const getConnObs = () => $.statement.premises.observations
  .map((sid) => {
    const { event, happened } = $.statements[sid].observation
    return Assignment({
      eid: event,
      happened,
      remove: () => actions.remove.connOb(sid),
    })
  })

const getHiddenVariables = () => Object.entries($.statement.premises.hiddenVariables)
  .map(([eid, happened]) => Assignment({
    eid, happened,
    toggle: () => actions.set.hiddenVariable(eid, !happened),
    remove: () => actions.remove.hiddenVariable(eid),
  }))

const getConnectednessEditor = () => [
  Paster({
    label: 'Наблюдения',
    content: getConnObs(),
    source: 'statements',
    target: 'connObs',
  }),
  Paster({
    label: 'Скрытые события',
    content: getHiddenVariables(),
    source: 'events',
    target: 'hiddenVariables',
  })
]

const views = {
  'withEvidence': 'c наблюдениями',
  'replay': 'переигровка',
  'prevent': 'предотвращение',
}

const Tab = ([value, label]) => html`
  <li class=${($.connectedness.view === value) ? 'is-active': ''}>
    <a @click=${() => actions.set.connectednessView(value)}>
      <span>${label}</span>
    </a>
  </li>
`

const p2str = (p) => (p * 100).toFixed(1) + '%'

const Calculations = () => html`
  <table class="table">
    <tbody>
      <tr>
        <td>Вероятность наблюдения после переигровки</td>
        <td>${($.connectedness.score === null) ? '' : p2str($.connectedness.p_e)}</td>
      </tr>
      <tr>
        <td>Вероятность наблюдения после предотвращения</td>
        <td>${($.connectedness.score === null) ? '' : p2str($.connectedness.p_e_prevent)}</td>
      </tr>
      <tr>
        <td>Сила объяснения</td>
        <td>${($.connectedness.score === null) ? '' : $.connectedness.score.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
`

const ConnectednessViewer = () => {
  const { observations, hiddenVariables } = $.statement.premises
  const missingData = observations.length === 0 || Object.keys(hiddenVariables).length === 0
  let content
  if (missingData) {
    content = html`
      <span>Некоторые данные отсутствуют.</span>
    `
  } else {
    content = html`
      <div class="tabs is-boxed">
        <ul>
          ${Object.entries(views).map(Tab)}
        </ul>
      </div>
      ${Graph()}
      ${Calculations()}
    `
  }
  return html`
    <label class="label">Причинно-следственная сеть</label>
    ${content}
  `
}

export const Connectedness = () => ($.editing)
  ? getConnectednessEditor()
  : ConnectednessViewer()
