import { geoAlbers, geoPath, max, scaleQuantile, scaleSqrt } from 'd3'
import { geoVoronoi } from 'd3-geo-voronoi'
import React from 'react'
import city_data from '../../../live-data/cities.csv'
import { outline, states } from '../wildfire_thinning/data'
import { makeGeoJSON, spike } from './utils'

//OG settings: spike - 7, height - 250, colors - 5
// data
const cities = city_data.map((d) => makeGeoJSON(d))
const populated = cities
  .sort((a, b) => b.properties.population - a.properties.population)
  .slice(0, 10)

// Component
const Map = ({ width, height, colors }) => {
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
          fontSize='14px'
          fontWeight={600}
          strokeWidth={0.5}
        >
          {d.properties.name}
        </text>
      ))}
    </svg>
  )
}

export default Map
