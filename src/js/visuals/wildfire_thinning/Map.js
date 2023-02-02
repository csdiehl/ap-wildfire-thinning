import React, { useRef } from 'react'
import * as d3 from 'd3'
import {
  counties,
  wilderness,
  thinning,
  firesheds,
  states,
  outline,
} from './data'
import { codeToName } from './utils'

// FFF4EB

function zoomed(e) {
  const g = d3.select(document.getElementById('map-content'))
  g.attr('transform', e.transform)
  g.attr('stroke-width', 0.5 / e.transform.k)
  g.attr('font-size', `${16 / e.transform.k}px`)
}

const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)

const Map = ({
  width,
  height,
  thinningColor,
  fireshedColor,
  setSelectedArea,
  setStateIsZoomed,
  setCountyIsZoomed,
  countyIsZoomed,
  stateIsZoomed,
  selectedArea,
}) => {
  const svgRef = useRef()

  function onClick(data) {
    stateIsZoomed ? setCountyIsZoomed(true) : setStateIsZoomed(true)

    if (countyIsZoomed) {
      reset()
      return
    }

    setSelectedArea(data.id.toString())
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

  // reset back to normal zoom
  function reset() {
    setStateIsZoomed(false)
    setCountyIsZoomed(false)
    setSelectedArea('none')
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

  // get the label to display when zoomed into a county
  function getCountyLabel(code) {
    const center = path.centroid(counties.find((d) => d.id.toString() === code))
    const name = codeToName(code)

    const bld = name[2] < 1 ? '< 1' : name[2].toLocaleString('en')

    return (
      <text paintOrder='stroke fill' stroke='#FFF' y={center[1]}>
        <tspan x={center[0]}>{name[1]} County</tspan>
        <tspan fill='#121212' x={center[0]} dy='2px'>
          {bld} expected buildings
        </tspan>
        <tspan fill='#121212' x={center[0]} dy='2px'>
          affected from fires starting here
        </tspan>
      </text>
    )
  }

  return (
    <svg
      vectorEffect='non-scaling-stroke'
      ref={svgRef}
      width={width}
      height={height}
    >
      <g id='map-content'>
        {firesheds.map((d) => (
          <path
            key={d.properties.fireshed_code}
            d={path(d)}
            fill={fireshedColor(parseInt(d.properties.exp_level_out))}
            stroke='#FFF'
          ></path>
        ))}
        {thinning.map((d) => (
          <path
            key={d.properties.fireshed_code}
            d={path(d)}
            stroke='lightgrey'
            fill={thinningColor(parseInt(d.properties.exp_level))}
          ></path>
        ))}
        {wilderness.map((d) => (
          <path
            key={d.properties.name}
            d={path(d)}
            fill='darkgrey'
            stroke='#FFF'
          ></path>
        ))}
        {counties.map((d) => (
          <path
            onClick={() => onClick(d)}
            key={d.id}
            d={path(d)}
            fill='#FFF'
            fillOpacity={0}
            stroke={d.id.toString() === selectedArea ? '#121212' : 'lightgrey'}
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
          ></path>
        ))}
        {selectedArea.length > 2 &&
          selectedArea !== 'none' &&
          getCountyLabel(selectedArea)}
      </g>
    </svg>
  )
}

export default Map
