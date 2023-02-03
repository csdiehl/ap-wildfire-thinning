import React, { useEffect, useRef } from 'react'
import { useNodeDimensions } from 'ap-react-hooks'
import riskTotals from '../../../live-data/risk_totals.json'
import { stateCodes } from './utils'
import * as d3 from 'd3'
import { colors } from './utils'
import PropTypes from 'prop-types'

const formatNum = (n) => Math.round(n).toLocaleString('en')
const cols = ['exp_outside', 'exp_in_zone', 'exp_in_wild']

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
          exp_in_zone: d3.sum(riskTotals, (d) => d.exp_in_zone),
          exp_outside: d3.sum(riskTotals, (d) => d.exp_outside),
          exp_in_wild: d3.sum(riskTotals, (d) => d.exp_in_wild),
        },
      ]

  const stackedData = d3.stack().keys(cols)(data)

  const total = data[0].exp_outside + data[0].exp_in_wild + data[0].exp_in_zone

  const X = d3.scaleLinear().domain([0, total]).range([0, dimensions.width])
  const color = d3
    .scaleOrdinal()
    .domain(cols)
    .range([colors.red, colors.blue, colors.grey])

  useEffect(() => {
    d3.select(svgRef.current)
      .selectAll('rect')
      .data(stackedData)
      .transition()
      .duration(1000)
      .attr('x', (d) => X(d[0][0]))
      .attr('width', (d) => X(d[0][1] - d[0][0]))
  }, [stackedData, X])

  return (
    <div style={{ height: '100%' }} ref={node}>
      <svg ref={svgRef} height={dimensions.height} width={dimensions.width}>
        <text x={0} y={15}>
          {stateCodes[stateCode] ?? 'All'}{' '}
          {stateCodes[stateCode] &&
            `- Zones cover ${(data[0].pct_saved * 100).toFixed(
              1
            )}% of building exposure`}
        </text>
        {stackedData.map((d) => {
          return (
            <rect
              y={20}
              height={5}
              key={d.key}
              stroke='#FFF'
              fill={color(d.key)}
            ></rect>
          )
        })}
        <text x={0} y={40} fontSize='12px' fill='#121212'>
          <tspan fill={colors.red}>{formatNum(data[0].exp_outside)} |</tspan>{' '}
          <tspan fill={colors.blue}>{formatNum(data[0].exp_in_zone)} | </tspan>
          <tspan fill={colors.grey}>
            {formatNum(data[0].exp_in_wild)}
          </tspan>{' '}
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
