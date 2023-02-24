import { geoAlbers, geoPath, max, scaleQuantile, scaleSqrt, zoom } from 'd3'
import { geoVoronoi } from 'd3-geo-voronoi'
import React, { useRef } from 'react'
import city_data from '../../../live-data/cities.csv'
import { outline, states } from '../wildfire_thinning/data'
import { makeGeoJSON, spike } from './utils'
import { zoomIn, zoomOut, zoomed } from '../utils'
import ResetButton from '../../components/ResetButton'

const zoomConfig = [
  { id: 'risk-map-content', transform: true, baseStroke: 0.5, baseFont: 10 },
  {
    id: 'spikes',
    transform: false,
    baseStroke: 1,
    baseFont: 10,
  },
]

const zoomer = zoom()
  .scaleExtent([1, 8])
  .on('zoom', (e) => zoomed(e, zoomConfig))

//OG settings: spike - 7, height - 250, colors - 5
// data
const cities = city_data.map((d) => makeGeoJSON(d))
const populated = cities
  .sort((a, b) => b.properties.population - a.properties.population)
  .slice(0, 10)

// Component
const Map = ({ width, height, colors, setSelectedState, selectedState }) => {
  const svgRef = useRef()

  // projection
  const projection = geoAlbers().fitSize([width, height], outline)

  const Point = (d) => {
    const coords = projection(d.geometry.coordinates)
    return `${coords[0]},${coords[1]}`
  }

  //scales
  const heightScale = scaleSqrt()
    .domain([0, max(cities, (d) => d.properties.population)])
    .range([1, 220])

  const color = scaleQuantile()
    .domain(cities.map((d) => d.properties.risk_area))
    .range(colors)

  // generators
  const path = geoPath(projection)

  const voronoi = geoVoronoi(cities).polygons()

  function handleClick(data) {
    setSelectedState(data.id)

    zoomIn(path.bounds(data), svgRef, zoomer, width, height)
  }

  function reset() {
    setSelectedState(null)
    zoomOut(svgRef, zoomer)
  }

  return (
    <svg
      vectorEffect='non-scaling-stroke'
      ref={svgRef}
      width={width}
      height={height}
      cursor='pointer'
    >
      <defs>
        <clipPath id='state-outline'>
          <path d={path(outline)} stroke='darkgrey' />
        </clipPath>
      </defs>
      <g id='risk-map-content'>
        <g
          id='voronoi-polygons'
          clipPath='url(#state-outline)'
          stroke='lightgrey'
          strokeWidth={0.2}
        >
          {voronoi.features.map((d) => (
            <path
              key={d.properties.site.properties.place_fips}
              d={path(d)}
              fill={color(d.properties.site.properties.risk_area)}
              fillOpacity={0.3}
            ></path>
          ))}
        </g>
        {states.map((d) => (
          <path key={d.id} d={path(d)} fill='none' stroke='lightgrey'></path>
        ))}
        <g id='spikes'>
          {cities.map((d) => (
            <path
              key={d.properties.place_fips}
              transform={`translate(${Point(d)})`}
              d={spike(heightScale(d.properties.population))}
              fill={color(d.properties.risk_area)}
              fillOpacity={0.5}
              stroke={color(d.properties.risk_area)}
              strokeLinejoin='round'
            ></path>
          ))}
        </g>
        {populated.map((d) => (
          <text
            transform={`translate(${Point(d)})`}
            key={d.properties.place_fips}
            paintOrder='stroke fill'
            stroke='#FFF'
            fontSize='14px'
            fontWeight={600}
            strokeWidth={0.5}
          >
            {d.properties.name}
          </text>
        ))}
        {states.map((d) => (
          <path
            key={d.id}
            d={path(d)}
            fill='#FFF'
            fillOpacity={0}
            stroke='none'
            onClick={() => handleClick(d)}
          ></path>
        ))}
      </g>
      {selectedState && <ResetButton onClick={reset} />}
    </svg>
  )
}

export default Map
