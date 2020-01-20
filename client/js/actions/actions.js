export const actions = {}
import { add } from './add.js'; actions.add = add
import { paste } from './paste.js'; actions.paste = paste
import { set } from './set.js'; actions.set = set
import { toggle } from './toggle.js'; actions.toggle = toggle
import { remove } from './remove.js'; actions.remove = remove
import { stateChange } from '../state.js'

const stateChangeAfter = (obj) => {
  for (const key in obj) {
    const a = obj[key]
    if (typeof a === 'function') {
      obj[key] = (...args) => {
        const result = a(...args)
        stateChange()
        return result
      }
    } else {
      stateChangeAfter(a)
    }
  }
}
stateChangeAfter(actions)
