import { $ } from './state.js'
import { actions } from './actions.js'
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
    segments: ['statements', $.userId],
    title: 'Утверждения',
  }),
  saves: () => ({
    segments: ['saves'],
    title: 'Сохранения'
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
    actions.showScreen('events')
  },
  '/statement/:statementId/:userId/:editing': ({statementId, userId, editing}) => {
    const id = statementId
    if ($.statements.hasOwnProperty(id)) {
      actions.showId(id)
      actions.setUserId(parseInt(userId))
      ;(editing === '1') ? actions.edit() : actions.stopEdit()
    } else {
      replaceRoute()
    }
  },
  '/statements/:userId': ({userId}) => {
      actions.setUserId(parseInt(userId))
      actions.showScreen('statements')
  },
  '/saves': () => {
    actions.showScreen('saves')
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
