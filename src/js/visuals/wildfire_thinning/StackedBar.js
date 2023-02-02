import React from 'react'
import { useNodeDimensions } from 'ap-react-hooks'
import { firesheds } from './data'
import { stateCodes } from './utils'
import { rollups, scaleLinear, sum, stack, max } from 'd3'

const StackedBar = ({ selectedArea, fireshedColor }) => {
  const [node, dimensions] = useNodeDimensions()

  const data = stateCodes[selectedArea]
    ? firesheds.filter(
        (d) => d.properties.fireshed_state === stateCodes[selectedArea]
      )
    : firesheds

  const chartData = rollups(
      data,
      (v) => v.length,
      (d) => d.properties.exp_level_out
    ),
    total = sum(chartData, (d) => d[1])

  const X = scaleLinear().domain([0, total]).range([0, dimensions.width])

  function formatData(data) {
    let total = 0
    let rects = []

    data.forEach((d) => {
      rects.push(
        <rect
          key={d[0]}
          x={X(total)}
          y={10}
          height={10}
          width={X(d[1])}
          fill={fireshedColor(d[0])}
        ></rect>
      )
      total += d[1]
    })

    return rects
  }

  const rectangles = formatData(chartData)
  return (
    <div ref={node}>
      <svg height={dimensions.height} width={dimensions.width}>
        {rectangles}
      </svg>
    </div>
  )
}

export default StackedBar

/**
 *      {chartData.map((d, i) => (
          <rect
            key={d.level}
            x={X(d.buildings)}
            y={10}
            height={10}
            width={X(d.buildings)}
            fill={fireshedColor(d.level)}
          ></rect>
        ))}
 */
