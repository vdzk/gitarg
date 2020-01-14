export let $

export const initSate = () => $ = {
  screen: 'statements',
  treeView: false,
  expanded: {},
  editing: false,
  users: ['A', 'B'],
  userId: 0,
  statements: {},
  curId: null,
  statement: null,
  mainStatement: null,
  events: {},
  lastId: {
    event: 0,
    statement: 0,
  },
  buffer: {
    events: [],
    statements: [],
  },
  unexported: 0,
  projectName: 'unnamed'
}


//Notify only about the last state change in the call stack
//TODO: do not notify after @change if it was "caused" by following @click (use small timeout?)
let notify = null
let numChanges = 0
export const stateChange = () => {
  if (notify !== null) {
    numChanges++
    setTimeout(() => {
      numChanges--
      if (numChanges === 0) {
        notify()
      }
    })
  }
}
export const onStateChange = (fn) => notify = fn
