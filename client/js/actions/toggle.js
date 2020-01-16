import { $ } from '../state.js'
import { db } from '../db.js'
import { actions } from './actions.js'

export const toggle = {
  treeView: () => $.treeView = !$.treeView,
  eventEdit: (id) => $.events[id].editing = !$.events[id].editing,
  buffer: (e, id, type) => {
    const i = $.buffer[type].indexOf(id)
    if (i === -1) {
      $.buffer[type].push(id)
    } else {
      $.buffer[type].splice(i, 1)
    }
    e.stopPropagation()
  },
  userId: () => {
    $.userId = ($.userId + 1) % $.users.length
  },
}
