import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions/actions.js'
import { Paster, Remove } from './shared.js'

const ProjectName = () => html`
  <div class="field">
    <label class="label">Название файла спора</label>
    <div class="control">
      <input
        class="input"
        type="text"
        .value=${$.projectName}
        @change=${e => actions.set.projectName(e.target.value)}
      >
    </div>
  </div>
`

const Statement = (sid) => html`
  <div class="list-item">
    ${ $.statements[sid].modText }
    ${ Remove(actions.remove.mainStatement) }
  </div>
`

const getMainStatement = () => Paster({
  label: 'Тезис',
  content: ($.mainStatement) ? Statement($.mainStatement) : '',
  source: 'statements',
  target: 'mainStatement',
})

const User = (name, i) => html`
  <div class="field">
    <label class="label">Псевдоним №${i + 1}</label>
    <div class="control">
      <input
        class="input"
        type="text"
        .value=${$.users[i]}
        @change=${e => actions.set.userName(i, e.target.value)}
      >
    </div>
  </div>
`

export const Settings = () => html`
  ${ProjectName()}
  ${getMainStatement()}
  ${$.users.map(User)}
`
