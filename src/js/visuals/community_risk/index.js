import city_data from '../../../live-data/cities.csv'
import React from 'react'
import { geoVoronoi } from 'd3-geo-voronoi'

const makeGeoJSON = ({ lon, lat, ...data }) => {
  return {
    type: 'Feature',
    properties: { ...data },
    geometry: { type: 'Point', coordinates: [lon, lat] },
  }
}

const spike = (length) => `M${-7 / 2},0L0,${-length}L${7 / 2},0`

const cities = city_data.map((d) => makeGeoJSON(d))

const CommunityRisk = () => {
  const voronoi = geoVoronoi(cities).polygons()

  console.log(voronoi)
  return <div></div>
}

export default CommunityRisk
