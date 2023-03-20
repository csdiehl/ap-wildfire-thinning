import { geoMercator, geoPath, zoom, buffer } from 'd3'
import { tile } from 'd3-tile'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ResetButton from '../../components/ResetButton'
import useGeoData from '../../components/useGeoData'
import useUsData from '../../components/useUsData'
import { zoomed, zoomIn, zoomOut } from '../utils'
import MapLabel from './MapLabel'
import { codeToName, colors } from './utils'
import Protobuf from 'pbf'
import mapbox from '@mapbox/vector-tile'
// import rewind from '@turf/rewind'

// M Bostock function for turning the json results from the PBF into geojson
function geojson([x, y, z], layer) {
  if (!layer) return
  const features = []
  for (let i = 0; i < layer.length; ++i) {
    const f = layer.feature(i).toGeoJSON(x, y, z)
    features.push(f)
  }

  const GeoJSON = { type: 'FeatureCollection', features }
  // GeoJSON.features = GeoJSON.features.map((f) => rewind(f, { reverse: true }))
  return GeoJSON
}

const hillColor = (symbol) => {
  switch (symbol) {
    case 6:
      return '#dcd5cc'
    case 5:
      return '#eae8e3'
    case 4:
      return '#f9f8f6'
    case 3:
      return '#d0c7bb'
    default:
      return '#FFF'
  }
}

const center = [-114.04, 40.71]

// component
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
  const [tiles, setTiles] = useState(null)
  const { counties, states } = useUsData()
  const firesheds = useGeoData('exp_firesheds.json'),
    wilderness = useGeoData('wilderness_clipped.json'),
    thinning = useGeoData('firesheds_thinning.json'),
    hwys = useGeoData('hwy_west.json'),
    zones = useGeoData('zone_totals.json')

  const svgRef = useRef()
  const zoomLevel = window.innerWidth >= 768 ? 13.2 : 12.5

  // projection
  const projection = useMemo(
    () =>
      geoMercator()
        .center(center)
        .scale(Math.pow(2, zoomLevel) / (2 * Math.PI))
        .translate([width / 2, height / 2]),

    [width, height, zoomLevel]
  )

  // Get the vector tiles
  useEffect(() => {
    // create the tiler function and pass it the transform
    const tiler =
      projection &&
      tile()
        .size([width, height])
        .scale(projection.scale() * 2 * Math.PI)
        .translate(projection([0, 0]))

    Promise.all(
      tiler().map(async (d) => {
        const VTile = mapbox.VectorTile
        d.layers = new VTile(
          new Protobuf(
            await buffer(
              `https://basemaps.arcgis.com/arcgis/rest/services/World_Hillshade_v2/VectorTileServer/tile/${d[2]}/${d[0]}/${d[1]}.pbf`
            )
          )
        ).layers

        return d
      })
    ).then((tiles) => setTiles(tiles))
  }, [height, projection, width])

  const zoomer = useMemo(() => {
    const zoomConfig = [
      { id: 'map-content', transform: true, baseStroke: 0.5, baseFont: 10 },
      {
        id: 'cities',
        transform: false,
        baseStroke: 2,
        baseFont: width >= 730 ? 12 : 10,
      },
      { id: 'highways', transform: false, baseStroke: 0.8, baseFont: 10 },
    ]

    return zoom()
      .scaleExtent([1, 8])
      .on('zoom', ({ transform }) => zoomed(transform, zoomConfig))
  }, [width])

  // this is not ideal, but have to call reset on 1st load to get the right strokes
  useEffect(() => {
    reset()
  }, [reset])

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

  // event handlers
  function onClick(data) {
    const id = data.id.toString()
    id?.length >= 4 ? setCountyIsZoomed(true) : setStateIsZoomed(true)

    setSelectedArea(id)

    zoomIn(path.bounds(data), svgRef, zoomer, width, height)
  }

  // reset back to normal zoom
  const reset = useCallback(() => {
    setStateIsZoomed(false)
    setCountyIsZoomed(false)
    setSelectedArea('none')

    zoomOut(svgRef, zoomer)
  }, [setCountyIsZoomed, setStateIsZoomed, setSelectedArea, zoomer])

  // generators
  const path = geoPath(projection)

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
            tiles.map((t) => {
              const json = geojson(t, t.layers.Hillshade)
              return (
                <path key={t} fill='black' stroke='#FFF' d={path(json)}></path>
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
              onClick={() => onClick(d)}
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
      {(stateIsZoomed || countyIsZoomed) && <ResetButton onClick={reset} />}
    </svg>
  )
}

export default Map
