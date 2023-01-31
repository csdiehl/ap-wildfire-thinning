import React, { useRef, useState } from 'react'
import { useNodeDimensions } from 'ap-react-hooks'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import countyData from '../../../live-data/us.json'

const stateCodes = ['32', '08', '41', '53', '06', '49', '16', '04', '35', '30']

const stateGeos = {
  type: 'GeometryCollection',
  geometries: countyData.objects.states.geometries.filter((d) =>
    stateCodes.includes(String(d.id))
  ),
}

const states = topojson
  .feature(countyData, stateGeos)
  .features.filter((d) => stateCodes.includes(String(d.id)))

const counties = topojson
  .feature(countyData, countyData.objects.counties)
  .features.filter((d) => stateCodes.includes(String(d.id).slice(0, 2)))

function zoomed(e) {
  const g = d3.select(document.getElementById('map-content'))
  g.attr('transform', e.transform)
}

const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)
function WildfireThinning() {
  // state
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions
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
  const projection = d3
    .geoAlbersUsa()
    .fitSize([width, height], topojson.merge(countyData, stateGeos.geometries))

  // generators
  const path = d3.geoPath(projection)

  return (
    <div style={{ height: '100vh' }} ref={node}>
      <svg ref={svgRef} width={width} height={height} onDoubleClick={reset}>
        <g id='map-content'>
          {counties.map((d) => (
            <path
              onClick={() => onClick(d)}
              key={d.id}
              d={path(d)}
              fill='#FFF'
              fillOpacity={0}
              stroke='lightgrey'
              strokeWidth={1}
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
              strokeWidth={2}
            ></path>
          ))}
        </g>
      </svg>
    </div>
  )
}

WildfireThinning.visual = {
  headline: 'Wildfire Thinning',
  chatter: '',
  footerProps: { credit: 'AP Data Team' },
}

WildfireThinning.propTypes = {}

WildfireThinning.defaultProps = {}

export default WildfireThinning

/**
 *        {thinning.map((d, i) => (
          <path key={i} d={path(d)} fill='#121212'></path>
        ))}

        const thinning = topojson.feature(
  data,
  data.objects.firesheds_thinning
).features


  const { coords } = slides[step]
      const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)
      const center = projection([+coords[0], +coords[1]])

      const svg = d3.select(svgRef.current)

      console.log(svg)

      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(+coords[2])
            .translate(-center[0], -center[1])
        )
    }

 */
