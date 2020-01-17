import { $ } from './state.js'
import { actions } from './actions/actions.js'
import createMatcher from '../third_party/feather-route-matcher.js'

const routes = {
  events: () => ({
    segments: ['events'],
    title: 'События',
  }),
  statement: () => ({
    segments: ['statement', $.statement.id, $.userId, ($.editing) ? '1' : '0'],
    title: $.statement.modText,
  }),
  statements: () => ({
    segments: ['statements', ($.treeView) ? '1' : '0', $.userId],
    title: (($.treeView) ? 'Дерево' : 'Список') + ' утверждений',
  }),
  saves: () => ({
    segments: ['saves'],
    title: 'Сохранения'
  }),
  settings: () => ({
    segments: ['settings'],
    title: 'Настройки'
  }),
}

const getRoute = () => {
  const { title, segments } = routes[$.screen]()
  const path = '/' + segments.join('/')
  return ({path, title})
}

const replaceRoute = () => {
  const {path, title} = getRoute()
  history.replaceState({}, '', path)
  window.document.title = title
}

export const updateRoute = () => {
  const {path, title} = getRoute()
  if (document.location.pathname !== path) {
    window.history.pushState({}, '', path)
  }
  window.document.title = title
}

const matcher = createMatcher({
  '/': () => {
    replaceRoute()
  },
  '/events': () => {
    actions.set.screen('events')
  },
  '/statement/:statementId/:userId/:editing': ({statementId, userId, editing}) => {
    const id = statementId
    if ($.statements.hasOwnProperty(id)) {
      actions.set.curId(id)
      actions.set.userId(parseInt(userId))
      actions.set.editing(editing === '1')
    } else {
      replaceRoute()
    }
  },
  '/statements/:treeView/:userId': ({userId, treeView}) => {
    actions.set.userId(parseInt(userId))
    actions.set.screen('statements')
    actions.set.treeView(treeView === '1')
  },
  '/saves': () => {
    actions.set.screen('saves')
  },
  '/settings': () => {
    actions.set.screen('settings')
  },
  '/*': () => {
    //Route not matched
    replaceRoute()
  },
})

export const applyRoute = () => {
  const { page, params } = matcher(document.location.pathname)
  page(params)
}
window.onpopstate = applyRoute
