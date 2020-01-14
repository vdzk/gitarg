import { html } from '../../../third_party/lit-html/lit-html.js'
import { $ } from '../../state.js'
import { actions } from '../../actions.js'
import { Premises } from './premises.js'
import { Conclusion } from './conclusion.js'

const EditBtn = () => html`
  <button class="button" @click=${actions.edit} >
    Редактировать
  </botton>
`

const NextConclusionBtn = () => html`
  <button
    class="button is-pulled-right"
    @click=${() => actions.showId($.nextConclusion)}
    ?disabled=${$.nextConclusion === null}
  >
    Следовательно...
  </botton>
`

const ReadBtn = () => html`
  <button class="button" @click=${actions.stopEdit} >
    Читать
  </botton>
`

const DeleteBtn = () => html`
  <button class="button is-danger is-pulled-right" @click=${actions.delete} >
    Удалить
  </botton>
`

const Actions = () => ($.editing)
  ? [ReadBtn(), DeleteBtn()]
  : [EditBtn(), NextConclusionBtn()]

export const Statement = () => html`
  ${Premises()}
  ${Conclusion()}
  ${Actions()}
`
