import React, { useRef, useState } from 'react'
import * as d3 from 'd3'
import {
  counties,
  wilderness,
  thinning,
  firesheds,
  states,
  outline,
} from './data'

// FFF4EB

function zoomed(e) {
  const g = d3.select(document.getElementById('map-content'))
  g.attr('transform', e.transform)
}

const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)

const thinningColor = d3
  .scaleSequential()
  .domain([0, 6])
  .interpolator(d3.interpolateBlues)

const fireshedColor = d3
  .scaleSequential()
  .domain([0, 6])
  .interpolator(d3.interpolateOranges)

const Map = ({ width, height }) => {
  const [stateIsZoomed, setStateIsZoomed] = useState(false)
  const svgRef = useRef()

  function onClick(data) {
    setStateIsZoomed(true)
    const [[x0, y0], [x1, y1]] = path.bounds(data)

    const svg = d3.select(svgRef.current)

    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(
            Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
          )
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
      )
  }

  function reset() {
    setStateIsZoomed(false)
    const svg = d3.select(svgRef.current)

    svg
      .transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1))
  }

  // projection
  const projection = d3.geoAlbersUsa().fitSize([width, height], outline)

  // generators
  const path = d3.geoPath(projection)
  return (
    <svg ref={svgRef} width={width} height={height} onDoubleClick={reset}>
      <g id='map-content'>
        {firesheds.map((d) => (
          <path
            key={d.properties.fireshed_code}
            d={path(d)}
            fill={fireshedColor(parseInt(d.properties.exp_level_out))}
            stroke='#FFF'
            strokeWidth={0.5}
          ></path>
        ))}
        {thinning.map((d) => (
          <path
            key={d.properties.fireshed_code}
            d={path(d)}
            stroke='lightgrey'
            fill={thinningColor(parseInt(d.properties.exp_level))}
            strokeWidth={0.5}
          ></path>
        ))}
        {wilderness.map((d) => (
          <path
            key={d.properties.name}
            d={path(d)}
            fill='darkgrey'
            stroke='#FFF'
            strokeWidth={0.5}
          ></path>
        ))}
        {counties.map((d) => (
          <path
            onClick={() => onClick(d)}
            key={d.id}
            d={path(d)}
            fill='#FFF'
            fillOpacity={0}
            stroke='lightgrey'
            strokeWidth={0.5}
          ></path>
        ))}
        {states.map((d) => (
          <path
            onClick={() => onClick(d)}
            key={d.id}
            d={path(d)}
            fill={stateIsZoomed ? 'none' : '#FFF'}
            fillOpacity={0}
            stroke='#121212'
            strokeWidth={1}
          ></path>
        ))}
      </g>
    </svg>
  )
}

export default Map
