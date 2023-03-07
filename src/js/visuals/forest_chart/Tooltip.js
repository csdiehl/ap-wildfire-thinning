import React from 'react'
import { format } from 'd3'
import PropTypes from 'prop-types'

const Tooltip = ({ data, rank }) => {
  return (
    <g>
      <rect
        fillOpacity={0.5}
        fill='#FFF'
        x={0}
        y={80}
        height={20}
        width={100}
      />
      <text fontWeight={400} fontSize='10px' x={0} y={100}>
        <tspan>{format('.1s')((data ?? 0) * 0.0001)} Hectares at Risk</tspan>
        <tspan>{rank} out of 21</tspan>
      </text>
    </g>
  )
}

Tooltip.propTypes = {
  data: PropTypes.number,
  rank: PropTypes.number,
}

Tooltip.defaultProps = {
  rank: 0,
}

export default Tooltip
