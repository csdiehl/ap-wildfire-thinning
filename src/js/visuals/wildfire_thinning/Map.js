import { geoMercator, geoPath, select, zoom, zoomIdentity } from 'd3'
import { tile } from 'd3-tile'
import React, { useEffect, useRef, useState } from 'react'
import ResetButton from '../../components/ResetButton'
import useGeoData from '../../components/useGeoData'
import useUsData from '../../components/useUsData'
import MapLabel from './MapLabel'
import { codeToName, colors } from './utils'

function position(tile, tiles) {
  const [x, y] = tile
  const {
    translate: [tx, ty],
    scale: k,
  } = tiles
  return [(x + tx) * k, (y + ty) * k, k]
}

function getHillShade(x, y, z) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/${z}/${y}/${x}.png`
}

const center = [-114.04, 40.71]
const initialScale = 1 << 13

// projection
const projection = geoMercator()
  .scale(1 / (2 * Math.PI))
  .translate([0, 0])

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
  const [cities, setCities] = useState(null)
  const { counties, states } = useUsData()
  const [tiles, setTiles] = useState(null)
  const firesheds = useGeoData('exp_firesheds.json'),
    wilderness = useGeoData('wilderness_clipped.json'),
    thinning = useGeoData('firesheds_thinning.json'),
    hwys = useGeoData('hwy_west.json'),
    zones = useGeoData('zone_totals.json')

  const svgRef = useRef()

  const path = geoPath(projection)

  const tiler = tile()
    .extent([
      [0, 0],
      [width, height],
    ])
    .tileSize(512)

  const zoomer = zoom()
    .scaleExtent([1 << 10, 1 << 15])
    .extent([
      [0, 0],
      [width, height],
    ])
    .on('zoom', ({ transform }) => zoomed(transform))

  useEffect(() => {
    const svg = select(svgRef.current)
    svg.call(zoomer).call(
      zoomer.transform,
      zoomIdentity
        .translate(width / 2, height / 2)
        .scale(-initialScale)
        .translate(...projection(center))
        .scale(-1)
    )
  }, [])

  function zoomed(transform) {
    const newTiles = tiler(transform)
    setTiles(newTiles)

    projection
      .scale(transform.k / (2 * Math.PI))
      .translate([transform.x, transform.y])
  }

  // get the cities data - filter for our states is already in the url
  //www.arcgis.com/home/item.html?id=9df5e769bfe8412b8de36a2e618c7672#overview
  // https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-.htm
  useEffect(() => {
    async function getCities() {
      const res = await fetch(
        "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0/query?where=%20(ST%20%3D%20'CA'%20OR%20ST%20%3D%20'UT'%20OR%20ST%20%3D%20'CO'%20OR%20ST%20%3D%20'OR'%20OR%20ST%20%3D%20'WA'%20OR%20ST%20%3D%20'NV'%20OR%20ST%20%3D%20'AZ'%20OR%20ST%20%3D%20'NM'%20OR%20ST%20%3D%20'MT'%20OR%20ST%20%3D%20'ID')%20%20AND%20%20(POP_CLASS%20%3D%209%20OR%20POP_CLASS%20%3D%2010)%20&outFields=CLASS,ST,STFIPS,PLACEFIPS,POP_CLASS,POPULATION,NAME&outSR=4326&f=json"
      )

      const data = await res.json()

      return data
    }

    getCities().then((data) => setCities(data))
  }, [])

  // zoom in when clicking on a city
  function onClick(data) {
    const id = data.id.toString()
    id?.length >= 4 ? setCountyIsZoomed(true) : setStateIsZoomed(true)

    setSelectedArea(id)
  }

  // reset back to normal zoom

  return (
    <svg
      vectorEffect='non-scaling-stroke'
      ref={svgRef}
      width={width}
      height={height}
    >
      <g id='map-content' cursor='pointer'>
        <g id='hillshade-tiles'>
          {tiles &&
            tiles.map((t, i) => {
              const P = position(t, tiles)
              const url = getHillShade(...t)
              return (
                <image
                  xlinkHref={url}
                  key={i}
                  x={P[0]}
                  y={P[1]}
                  width={P[2]}
                  height={P[2]}
                ></image>
              )
            })}
        </g>
        {firesheds &&
          firesheds.map((d) => (
            <path
              key={d.properties.fireshed_code}
              d={path(d)}
              fill={fireshedColor(parseInt(d.properties.exp_level_out))}
              stroke='#FFF'
            ></path>
          ))}
        {thinning &&
          thinning.map((d) => (
            <path
              key={d.properties.fireshed_code + d.properties.objectid}
              d={path(d)}
              stroke='lightgrey'
              fill={thinningColor(parseInt(d.properties.exp_level))}
            ></path>
          ))}
        {wilderness &&
          wilderness.map((d) => (
            <path
              key={d.properties.name + d.properties.agency}
              d={path(d)}
              fill='darkgrey'
              stroke='#FFF'
            ></path>
          ))}
        <g id='highways'>
          {hwys &&
            hwys.map((d, i) => (
              <path key={i} d={path(d)} fill='none' stroke='#454545'></path>
            ))}
        </g>
        {counties &&
          counties.map((d) => (
            <path
              key={d.id}
              d={path(d)}
              fill='#EEE'
              fillOpacity={
                countyIsZoomed && d.id.toString() !== selectedArea ? 0.7 : 0
              }
              stroke={
                d.id.toString() === selectedArea ? '#121212' : 'lightgrey'
              }
            ></path>
          ))}

        {zones &&
          zones.map((d) => {
            return (
              <path
                key={d.properties.name}
                d={path(d)}
                fill='none'
                stroke={colors.blue}
              ></path>
            )
          })}

        <g id='cities'>
          {projection &&
            cities &&
            cities.features.map((d) => {
              const coords = projection([d.geometry.x, d.geometry.y])
              return (
                <g
                  key={d.attributes['FID']}
                  transform={`translate(${coords[0]},${coords[1]})`}
                >
                  <circle cx={0} cy={0} r={1} />
                  {d.attributes['POP_CLASS'] >= 9 && (
                    <text x={2} y={2} paintOrder='stroke fill' stroke='#FFF'>
                      {d.attributes['NAME']}
                    </text>
                  )}
                </g>
              )
            })}
        </g>
        {states &&
          states.map((d) => (
            <path
              onClick={() => onClick(d)}
              key={d.id}
              d={path(d)}
              fill={
                stateIsZoomed
                  ? d.id.toString() === selectedArea
                    ? 'none'
                    : countyIsZoomed
                    ? 'none'
                    : '#EEE'
                  : '#EEE'
              }
              fillOpacity={
                stateIsZoomed && d.id.toString() !== selectedArea ? 0.7 : 0
              }
              stroke='#777777'
            ></path>
          ))}
        <g id='map-label'>
          {stateIsZoomed &&
            !countyIsZoomed &&
            zones.map((d) => {
              const words = d.properties.name.split(' ')

              if (d.properties.state !== codeToName(selectedArea, true)[0])
                return
              return (
                <text
                  key={d.properties.name}
                  fontWeight={500}
                  paintOrder='stroke fill'
                  stroke='#FFF'
                  fill='#3787C0'
                  y={path.centroid(d)[1]}
                >
                  <tspan x={path.centroid(d)[0]}>
                    {words.slice(0, 3).join(' ')}
                  </tspan>
                  <tspan x={path.centroid(d)[0]} dy='1.2em'>
                    {words.slice(3, words.length).join(' ')}
                  </tspan>
                </text>
              )
            })}
          {counties && selectedArea.length > 2 && selectedArea !== 'none' && (
            <MapLabel
              code={selectedArea}
              center={path.centroid(
                counties.find((d) => d.id.toString() === selectedArea)
              )}
            />
          )}
        </g>
      </g>

      <text fontSize='12px' x={10} y={height - 10}>
        Data: U.S. Forest Service
      </text>
      {(stateIsZoomed || countyIsZoomed) && <ResetButton />}
    </svg>
  )
}

export default Map
