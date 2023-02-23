import city_data from '../../../live-data/cities.csv'
import React from 'react'
import { geoVoronoi } from 'd3-geo-voronoi'
import { geoPath, geoAlbers, scaleQuantile, scaleSqrt, max } from 'd3'
import { outline, states } from '../wildfire_thinning/data'

const makeGeoJSON = ({ lon, lat, ...data }) => {
  return {
    type: 'Feature',
    properties: { ...data },
    geometry: { type: 'Point', coordinates: [lon, lat] },
  }
}

const spike = (length) => `M${-7 / 2},0L0,${-length}L${7 / 2},0`

// data
const cities = city_data.map((d) => makeGeoJSON(d))
const populated = cities
  .sort((a, b) => b.properties.population - a.properties.population)
  .slice(0, 10)

// Component
const Map = ({ width, height }) => {
  const margin = { left: 0, right: 0, top: 40, bottom: 40 }
  // projection
  const projection = geoAlbers().fitSize(
    [width - margin.left - margin.right, height - margin.top - margin.bottom],
    outline
  )

  const Point = (d) => {
    const coords = projection(d.geometry.coordinates)
    return `${coords[0]},${coords[1]}`
  }

  //scales
  const heightScale = scaleSqrt()
    .domain([0, max(cities, (d) => d.properties.population)])
    .range([1, 250])

  const color = scaleQuantile()
    .domain(cities.map((d) => d.properties.risk_area))
    .range(['#FFF4EB', '#FDD0A2', '#FD8C3B', '#D84702', '#7F2604'])

  // generators
  const path = geoPath(projection)

  const voronoi = geoVoronoi(cities).polygons()

  return (
    <svg width={width} height={height}>
      <defs>
        <clipPath id='state-outline'>
          <path d={path(outline)} stroke='darkgrey' />
        </clipPath>
      </defs>
      <g clipPath='url(#state-outline)' stroke='lightgrey' strokeWidth={0.2}>
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
      <g>
        {cities.map((d) => (
          <path
            key={d.properties.place_fips}
            transform={`translate(${Point(d)})`}
            d={spike(heightScale(d.properties.population))}
            fill={color(d.properties.risk_area)}
            fillOpacity={0.5}
            stroke={color(d.properties.risk_area)}
            strokeLinejoin='round'
            strokeWidth={1}
          ></path>
        ))}
      </g>
      {populated.map((d) => (
        <text
          transform={`translate(${Point(d)})`}
          key={d.properties.place_fips}
          paintOrder='stroke fill'
          stroke='#FFF'
          fontSize='12px'
          strokeWidth={0.5}
        >
          {d.properties.name}
        </text>
      ))}
    </svg>
  )
}

export default Map
