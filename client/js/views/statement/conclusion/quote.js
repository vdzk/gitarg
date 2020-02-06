import { html } from '../../../../third_party/lit-html/lit-html.js'
import { $ } from '../../../state.js'
import { actions } from '../../../actions/actions.js'
import { TextConclusion } from './text.js'

const QuoteEditor = () => html`
  <textarea
    class="textarea"
    .value=${$.statement.quote}
    @change=${(e) => actions.set.quote(e.target.value)}
  >
  </textarea>
`

const QuoteText = () => $.statement.quote.split(/\r?\n/).map((line) => html`
  <div>${line}</div>
`)

export const Quote = () => html`
  <div class="field">
    <label class="label">Цитата</label>
    <div class="control">
      ${($.editing) ? QuoteEditor() : QuoteText()}
    </div>
  </div>
  ${ TextConclusion() }
`
