import React from 'react'
import { useNodeDimensions } from 'ap-react-hooks'
import { zones } from '../wildfire_thinning/data'
import * as d3 from 'd3'

const ForestChart = () => {
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions

  return (
    <div style={{ height: '90vh', width: '100%' }} ref={node}>
      {zones.map((d) => {
        // each grid square has its own projection
        const projection = d3
          .geoAlbersUsa()
          .fitSize([width / 5 - 10, height / 6 - 10], d)
        const path = d3.geoPath(projection)
        return (
          <svg key={d.properties.name} width={width / 5} height={height / 6}>
            <text x={0} y={20}>
              {d.properties.state}
            </text>
            <path stroke='#121212' fill='none' d={path(d)}></path>
          </svg>
        )
      })}
    </div>
  )
}

export default ForestChart
