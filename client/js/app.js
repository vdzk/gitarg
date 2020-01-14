import { compute } from './compute.js'
import { render } from '../third_party/lit-html/lit-html.js'
import { App } from './views/app.js'
import { updateRoute, applyRoute } from './router.js'
import { loadDb } from './db.js'
import { onStateChange } from './state.js'

const update = () => {
  compute()
  updateRoute()
  render(App(), document.getElementById('App'))
}

const init = async () => {
  await loadDb()
  applyRoute()
  update()
  onStateChange(update)
}

init()
