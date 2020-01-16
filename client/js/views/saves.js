import { html } from '../../third_party/lit-html/lit-html.js'
import { $ } from '../state.js'
import { actions } from '../actions/actions.js'
import { exportDb, importDb } from '../db.js'

export const Saves = () => html`
  <div class="field">
    <button class="button is-success is-medium" @click=${exportDb}>
      <span class='icon'>
        <i class="fas fa-download"></i>
      </span>
      <span>Экспортировать сохранение</span>
    </button>
  </div>

  <article class=${'message '+ (($.unexported > 0) ? 'is-danger' : 'is-warning')}>
    <div class="message-body">
      <div class="content">
        <p>
          <strong>Внимание!</strong> Ваше текущее сохранение будет стёрто после импорта. Сначала экспортируйте его чтобы не потерять.
        </p>
        <p>
          Количество изменений с прошлого экспорта: ${$.unexported}.
        </p>
      </div>
      <div class="file">
        <label class="file-label">
          <input class="file-input  " type="file" @change=${importDb}>
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">
              Импортировать сохранение
            </span>
          </span>
        </label>
      </div>
    </div>
  </article>
`
