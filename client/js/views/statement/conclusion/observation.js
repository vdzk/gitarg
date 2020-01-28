import { html } from '../../../../third_party/lit-html/lit-html.js'
import { $ } from '../../../state.js'
import { actions } from '../../../actions/actions.js'
import { Paster } from '../../shared.js'

const getObservation = () => {
  const { event, happened }= $.statement.observation
  if (event === null) {
    return ''
  } else {
    return Assignment({
      eid: event,
      happened,
      toggle: () => actions.set.observation(!happened),
      remove: () => actions.remove.observation,
    })
  }
}

const getObservationEditor = () => Paster({
  label: 'Наблюдение',
  content: getObservation(),
  source: 'events',
  target: 'observation',
})

const ObservationViewer = () => html`
  <div class="field">
    <label class="label">
      Вывод
    </label>
    ${$.statement.modText}
  </div>
`

export const Observation = () => ($.editing) ? getObservationEditor() : ObservationViewer()
