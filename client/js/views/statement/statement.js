import { html } from '../../../third_party/lit-html/lit-html.js'
import { $ } from '../../state.js'
import { actions } from '../../actions/actions.js'
import { Premises } from './premises/premises.js'
import { Conclusion } from './conclusion/conclusion.js'
import { Copy } from '../shared.js'

const EditBtn = () => html`
  <button class="button" @click=${() => actions.set.editing(true)} >
    Редактировать
  </botton>
`

const NextConclusionBtn = () => html`
  <button
    class="button is-pulled-right"
    @click=${() => actions.set.curId($.nextConclusion)}
    ?disabled=${$.nextConclusion === null}
  >
    Следовательно...
  </botton>
`

const ReadBtn = () => html`
  <button class="button" @click=${() => actions.set.editing(false)} >
    Читать
  </botton>
`

const DeleteBtn = () => html`
  <button class="button is-danger is-pulled-right" @click=${actions.remove.statement} >
    Удалить
  </botton>
`

const CopyBtn = () => Copy('statements', $.statement.id, true)



const Actions = () => ($.editing)
  ? [ReadBtn(), CopyBtn(), DeleteBtn()]
  : [EditBtn(), CopyBtn(), NextConclusionBtn()]

export const Statement = () => html`
  ${Premises()}
  ${Conclusion()}
  ${Actions()}
`
