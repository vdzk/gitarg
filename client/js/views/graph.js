import { html, svg } from '../../third_party/lit-html/lit-html.js'
import { styleMap } from '../../third_party/lit-html/directives/style-map.js'
import { $ } from '../state.js'
import { actions } from '../actions.js'
import { Open } from './shared.js'
import { holeStr } from '../constants.js'

const Arrow = ({v, w}) => {
  const p = $.graph.edge(v, w).points
  let d
  if (p.length > 3) {
    d = p.map(({x, y}, i) => [(i > 0) ? 'L' : 'M', x, y].join(' ')).join(' ')
  } else {
    d = `M ${p[0].x} ${p[0].y} L ${p[p.length - 1].x} ${p[p.length - 1].y}`
  }
  const sid = $.effect2statement[w]
  const weight = $.statements[sid].causation.causes[v][$.userId]
  let arrowClass = 'causation '
  if (weight > 0) {
    arrowClass += 'positive'
  } else if (weight < 0) {
    arrowClass += 'negative'
  }
  return svg`<path d=${d} class=${arrowClass} />`
}

const Arrows = () => {
  const { width, height } = $.graph.graph()
  return svg`
    <svg
      width=${width}
      height=${height}
    >
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z"></path>
        </marker>
      </defs>
      <defs>
        <marker id="arrow_positive" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z"></path>
        </marker>
      </defs>
      <defs>
        <marker id="arrow_negative" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z"></path>
        </marker>
      </defs>
      ${$.graph.edges().map(Arrow)}
    </svg>
  `
}

const Node = (id) => {
  let { label, width, height, x, y } = $.graph.node(id)
  const hPad = 2
  const wPad = 2
  height = height - 2 * hPad
  width = width - 2 * wPad
  const style = {
    width: width + 'px',
    height: height + 'px',
    top: (y - height / 2) + 'px',
    left: (x - width / 2) + 'px',
  }
  const hasCause = $.graph.predecessors(id).length > 0
  const sid = $.effect2statement[id]
  const open = (hasCause) ? Open(sid) : ''
  const { event, conditions } = $.statement.premises
  if (id == event) {
    label = '★'+label
  }
  let value
  if (conditions.hasOwnProperty(id)) {
    value = (conditions[id]) ? 'да' : 'нет'
  } else {
    value = ($.inference.hasOwnProperty(id)) ? ($.inference[id] * 100).toFixed(1) + '%' : holeStr
  }
  return html`
    <div class="box is-absolute node" style=${styleMap(style)} >
        ${label}
        ${open}
        <span class="is-pulled-right">${value}</span>
    </div>
  `
}

export const Graph = () => {
  const { height } = $.graph.graph()
  const placeholderStyle = {
    height: height + 30 + 'px',
  }
  return html`
    <div class="graph-cont">
      <div class="graph-cont-inner">
        ${$.graph.nodes().map(Node)}
        ${Arrows()}
      </div>
    </div>
    <div style=${styleMap(placeholderStyle)}></div>
  `

}
