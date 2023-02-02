import React, { useRef } from 'react'
import { useNodeDimensions } from 'ap-react-hooks'
import riskTotals from '../../../live-data/risk_totals.json'
import { stateCodes } from './utils'
import { scaleLinear, scaleOrdinal, sum, stack } from 'd3'
import { colors } from './utils'
import PropTypes from 'prop-types'

const formatNum = (n) => Math.round(n).toLocaleString('en')
const cols = ['exp_outside', 'exp_zone', 'exp_wild']

const StackedBar = ({ selectedArea }) => {
  const [node, dimensions] = useNodeDimensions()
  const svgRef = useRef()

  const stateCode =
    selectedArea.length > 2
      ? selectedArea.padStart(5, 0).slice(0, 2)
      : selectedArea.padStart(2, 0)

  const data = stateCodes[stateCode]
    ? riskTotals.filter((d) => d.state.padStart(2, 0) === stateCodes[stateCode])
    : [
        {
          state: 'All States',
          exp_zone: sum(riskTotals, (d) => d.exp_zone),
          exp_outside: sum(riskTotals, (d) => d.exp_outside),
          exp_wild: sum(riskTotals, (d) => d.exp_wild),
        },
      ]

  const stackedData = stack().keys(cols)(data)

  const total = data[0].exp_outside + data[0].exp_wild + data[0].exp_zone

  const X = scaleLinear().domain([0, total]).range([0, dimensions.width])
  const color = scaleOrdinal()
    .domain(cols)
    .range([colors.red, colors.blue, colors.grey])

  return (
    <div style={{ height: '100%' }} ref={node}>
      <svg ref={svgRef} height={dimensions.height} width={dimensions.width}>
        <text x={0} y={15}>
          {stateCodes[stateCode] ?? 'All'} {data.pct_saved}
        </text>
        {stackedData.map((d) => {
          return (
            <rect
              y={20}
              x={X(d[0][0])}
              width={X(d[0][1] - d[0][0])}
              height={5}
              key={d.key}
              stroke='#FFF'
              fill={color(d.key)}
            ></rect>
          )
        })}
        <text x={0} y={40} fontSize='12px' fill='#121212'>
          <tspan fill={colors.red}>{formatNum(data[0].exp_outside)} |</tspan>{' '}
          <tspan fill={colors.blue}>{formatNum(data[0].exp_zone)} | </tspan>
          <tspan fill={colors.grey}>{formatNum(data[0].exp_wild)}</tspan>{' '}
          Buildings affected by fires starting in this state
        </text>
      </svg>
    </div>
  )
}

StackedBar.propTypes = {
  selectedArea: PropTypes.string,
}

export default StackedBar
