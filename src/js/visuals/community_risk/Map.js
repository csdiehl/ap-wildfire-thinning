import {
  geoAlbers,
  geoPath,
  max,
  scaleQuantile,
  scaleSqrt,
  zoom,
  select,
} from 'd3'
import { geoVoronoi } from 'd3-geo-voronoi'
import React, { useRef, useEffect } from 'react'
import city_data from '../../../live-data/cities.csv'
import { outline, states } from '../wildfire_thinning/data'
import { makeGeoJSON, spike, dedupeLabels } from './utils'
import { zoomIn, zoomOut } from '../utils'
import ResetButton from '../../components/ResetButton'

//OG settings: spike - 7, height - 250, colors - 5
// data
const cities = city_data.map((d) => makeGeoJSON(d))
const citiesByPop = cities.sort(
  (a, b) => b.properties.population - a.properties.population
)

// Component
const Map = ({ width, height, colors, setSelectedState, selectedState }) => {
  const svgRef = useRef()

  // projection
  const projection = geoAlbers().fitSize([width, height], outline)

  const populated = selectedState
    ? citiesByPop
        .filter(
          (d) =>
            d.properties.place_fips.toString().padStart(7, 0).slice(0, 2) ===
            selectedState.toString().padStart(2, 0)
        )
        .slice(0, 10)
    : citiesByPop.slice(0, 10)

  // remove overlapping labels on zoom
  useEffect(() => {
    if (!selectedState) return
    const labels = select(svgRef.current).selectAll('.city-labels')
    dedupeLabels(labels)
  }, [selectedState])

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

  const reset = () => {
    setSelectedState(null)
    zoomOut(svgRef, zoomer)
  }

  const zoomed = (e) => {
    const map = select(document.getElementById('risk-map-content'))
    const spikes = select(document.getElementById('spikes'))

    map.attr('transform', e.transform)
    map.attr('stroke-width', 0.5 / e.transform.k)
    map.attr('font-size', `${14 / e.transform.k}px`)

    spikes
      .selectAll('path')
      .data(cities)
      .attr('transform', (d) => {
        return `translate(${Point(d)}) scale(${1 / e.transform.k})`
      })
      .attr('stroke-width', 1 / e.transform.k)
  }

  const zoomer = zoom().scaleExtent([1, 8]).on('zoom', zoomed)

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
        <g id='voronoi-polygons' clipPath='url(#state-outline)'>
          {voronoi.features.map((d) => {
            return (
              <path
                key={d.properties.site.properties.place_fips}
                d={path(d)}
                fill={color(d.properties.site.properties.risk_area)}
                fillOpacity={0.3}
                stroke={'lightgrey'}
                strokeWidth={0.2}
              ></path>
            )
          })}
        </g>
        {states.map((d) => (
          <path key={d.id} d={path(d)} fill='none' stroke='#121212'></path>
        ))}
        <g id='spikes'>
          {cities.map((d) => (
            <path
              transform={`translate(${Point(d)})`}
              key={d.properties.place_fips}
              d={spike(heightScale(d.properties.population))}
              fill={color(d.properties.risk_area)}
              fillOpacity={0.7}
              stroke={color(d.properties.risk_area)}
              strokeLinejoin='round'
            ></path>
          ))}
        </g>
        {populated.map((d) => {
          const coords = projection(d.geometry.coordinates)
          return (
            <text
              className='city-labels'
              x={coords[0]}
              y={coords[1]}
              key={d.properties.place_fips}
              paintOrder='stroke fill'
              stroke='#FFF'
              fontWeight={600}
              strokeWidth={0.5}
            >
              {d.properties.name}
            </text>
          )
        })}
        {/*Invisible overlay that allows clicking on state shapes */}
        {states.map((d) => (
          <path
            key={d.id}
            d={path(d)}
            fill={selectedState === d.id ? 'none' : '#FFF'}
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
