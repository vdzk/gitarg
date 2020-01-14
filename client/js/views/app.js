const screens = {}
import { html } from '../../third_party/lit-html/lit-html.js'
import { Controls } from './controls.js'
import { Events } from './events.js'; screens.events = Events
import { Statement } from './statement/statement.js'; screens.statement = Statement
import { Statements } from './statements.js'; screens.statements = Statements
import { Saves } from './saves.js'; screens.saves = Saves
import { $ } from '../state.js'

export const App = () => html`
  <div class="section">
    <div class="container is-static">
      ${Controls()}
      ${screens[$.screen]()}
    </div>
  </div>
`
