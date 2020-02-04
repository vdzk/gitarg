import { $ } from '../state.js'
import { getAllEdges, getConnected } from './graph.js'
import { eventIdPrefix } from '../constants.js'

export const getPremisesTree = () => {
  if ( $.mainStatement === null) return null

  const premisesTree = []
  const lostExpand = new Set(Object.keys($.expanded))
  let boundary = [{
    pid: null,
    indent: 0,
    type: 'statement',
    id: $.mainStatement,
  }]
  while (boundary.length > 0) {
    const item = boundary.shift()
    const { pid, indent, type, id } = item
    premisesTree.push(item)
    if (type === 'statement') {
      if ($.expanded[id] === pid && (pid !== $._reExpanded || pid === null)) {
        lostExpand.delete(id)
        const { premises } = $.statements[id]
        if (premises.type === 'statements') {
          boundary = premises.ids
            .map(sid => ({
              pid: id,
              indent: indent + 1,
              type: 'statement',
              id: sid,
            }))
            .concat(boundary)
        } else if (premises.type === 'causalNet') {
          //TODO: do not duplicate 'causalNet' nodes if different premises.event in different statemetns are part of the same nework
          boundary.unshift({
            pid: id,
            indent: indent + 1,
            type: 'causalNet',
            id: premises.event,
          })
        } else if (premises.type === 'connectedness') {
          boundary.unshift({
            pid: id,
            indent: indent + 1,
            type: 'causalNet',
            id: $.statements[premises.observations[0]].observation.event,
          })
        } else if (premises.type === 'links') {
          boundary = premises.links
            .map((l, i) => ({
              pid: id,
              indent: indent + 1,
              type: 'link',
              id: i,
            }))
            .concat(boundary)
        }
      }
    } else if (type === 'causalNet') {
      const expId = eventIdPrefix + id
      if ($.expanded[expId] === pid && pid !== $._reExpanded) {
        lostExpand.delete(expId)
        const { effect2statement, effect2causes, cause2effects } = getAllEdges()
        const connected = getConnected(id, effect2causes, cause2effects)
        boundary = connected
          .map(eid => ({
            pid: expId,
            indent: indent + 1,
            type: 'statement',
            id: effect2statement[eid],
          }))
          .filter(({id}) => !!id)
          .concat(connected
            .filter(eid => $.observations.hasOwnProperty(eid))
            .map(eid => ({
              pid: expId,
              indent: indent + 1,
              type: 'statement',
              id: $.observations[eid].sid,
            }))
          )
          .concat(boundary)
      }
    }
  }
  //Epand can be lost because one of the ancestors was unexpanded.
  lostExpand.forEach(id => delete $.expanded[id])
  $._reExpanded = null

  return premisesTree
}
