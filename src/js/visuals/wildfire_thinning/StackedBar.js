import React from 'react'
import { useNodeDimensions } from 'ap-react-hooks'
import riskTotals from '../../../live-data/risk_totals.json'
import { stateCodes } from './utils'
import { scaleLinear, sum } from 'd3'
import { colors } from './utils'
import PropTypes from 'prop-types'

const formatNum = (n) => Math.round(n).toLocaleString('en')

const StackedBar = ({ selectedArea }) => {
  const [node, dimensions] = useNodeDimensions()

  const stateCode =
    selectedArea.length > 2
      ? selectedArea.padStart(5, 0).slice(0, 2)
      : selectedArea.padStart(2, 0)

  console.log(stateCode)

  const data = stateCodes[stateCode]
    ? riskTotals.find((d) => d.state.padStart(2, 0) === stateCodes[stateCode])
    : {
        state: 'All States',
        exp_zone: sum(riskTotals, (d) => d.exp_zone),
        exp_total: sum(riskTotals, (d) => d.exp_total),
        exp_wild: sum(riskTotals, (d) => d.exp_wild),
      }

  const expOutside = data.exp_total - data.exp_wild - data.exp_zone

  const X = scaleLinear()
    .domain([0, data.exp_total])
    .range([0, dimensions.width])

  return (
    <div style={{ height: '100%' }} ref={node}>
      <svg height={dimensions.height} width={dimensions.width}>
        <text x={0} y={15}>
          {stateCodes[stateCode] ?? 'All'} {data.pct_saved}
        </text>
        <rect
          x={X(0)}
          fill={colors.red}
          y={20}
          height={5}
          width={X(expOutside)}
          stroke='#FFF'
        ></rect>
        <rect
          x={X(data.exp_total - data.exp_wild - data.exp_zone)}
          fill={colors.blue}
          y={20}
          height={5}
          width={X(data.exp_zone)}
          stroke='#FFF'
        ></rect>
        <rect
          x={X(data.exp_total - data.exp_wild)}
          fill={colors.grey}
          y={20}
          height={5}
          width={X(data.exp_wild)}
          stroke='#FFF'
        ></rect>
        <text x={0} y={40} fontSize='12px' fill='#121212'>
          <tspan fill={colors.red}>{formatNum(expOutside)} |</tspan>{' '}
          <tspan fill={colors.blue}>{formatNum(data.exp_zone)} | </tspan>
          <tspan fill={colors.grey}>{formatNum(data.exp_wild)}</tspan> Buildings
        </text>
      </svg>
    </div>
  )
}

StackedBar.propTypes = {
  selectedArea: PropTypes.string,
}

export default StackedBar
