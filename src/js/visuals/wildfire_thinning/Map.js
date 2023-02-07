import React, { useRef, useEffect, useCallback, useState } from 'react'
import * as d3 from 'd3'
import {
  counties,
  wilderness,
  thinning,
  firesheds,
  states,
  outline,
  zones,
  hwys,
} from './data'
import MapLabel from './MapLabel'
import { codeToName, colors } from './utils'

// FFF4EB

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
  const svgRef = useRef()

  function zoomed(e) {
    const g = d3.select(document.getElementById('map-content'))
    const label = d3.select(document.getElementById('map-label'))
    const cities = d3.select(document.getElementById('cities'))
    const hwy = d3.select(document.getElementById('highways'))

    g.attr('transform', e.transform)
    g.attr('stroke-width', 0.5 / e.transform.k)
    g.attr('font-size', `${10 / e.transform.k}px`)

    label.attr('transform', e.transform)
    label.attr('font-size', `${(width >= 730 ? 12 : 10) / e.transform.k}px`)
    label.attr('stroke-width', 2 / e.transform.k)

    cities.attr('stroke-width', 2 / e.transform.k)
    cities.attr('font-size', `${(width >= 730 ? 12 : 10) / e.transform.k}px`)

    hwy.attr('stroke-width', 0.8 / e.transform.k)
  }

  const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)

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
      .duration(1000)
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
  const reset = useCallback(() => {
    setStateIsZoomed(false)
    setCountyIsZoomed(false)
    setSelectedArea('none')
    const svg = d3.select(svgRef.current)

    svg
      .transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1))
  }, [setCountyIsZoomed, setStateIsZoomed, setSelectedArea])

  // projection
  const projection = d3.geoAlbersUsa().fitSize([width, height], outline)

  // generators
  const path = d3.geoPath(projection)

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
            key={d.properties.fireshed_code + d.properties.objectid}
            d={path(d)}
            stroke='lightgrey'
            fill={thinningColor(parseInt(d.properties.exp_level))}
          ></path>
        ))}
        {wilderness.map((d) => (
          <path
            key={d.properties.name + d.properties.agency}
            d={path(d)}
            fill='darkgrey'
            stroke='#FFF'
          ></path>
        ))}
        <g id='highways'>
          {hwys.map((d, i) => (
            <path key={i} d={path(d)} fill='none' stroke='#454545'></path>
          ))}
        </g>
        {counties.map((d) => (
          <path
            onClick={() => onClick(d)}
            key={d.id}
            d={path(d)}
            fill='#EEE'
            fillOpacity={
              countyIsZoomed && d.id.toString() !== selectedArea ? 0.7 : 0
            }
            stroke={d.id.toString() === selectedArea ? '#121212' : 'lightgrey'}
          ></path>
        ))}

        {zones.map((d) => {
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
          {cities &&
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
        {states.map((d) => (
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
      </g>
      <g id='map-label'>
        {stateIsZoomed &&
          !countyIsZoomed &&
          zones.map((d) => {
            const words = d.properties.name.split(' ')

            if (d.properties.state !== codeToName(selectedArea, true)[0]) return
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
        {selectedArea.length > 2 && selectedArea !== 'none' && (
          <MapLabel
            code={selectedArea}
            center={path.centroid(
              counties.find((d) => d.id.toString() === selectedArea)
            )}
          />
        )}
      </g>
    </svg>
  )
}

export default Map

//    "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Major_Cities/FeatureServer/0/query?where=%20(ST%20%3D%20'CA'%20OR%20ST%20%3D%20'UT'%20OR%20ST%20%3D%20'CO'%20OR%20ST%20%3D%20'OR'%20OR%20ST%20%3D%20'WA'%20OR%20ST%20%3D%20'NV'%20OR%20ST%20%3D%20'AZ'%20OR%20ST%20%3D%20'NM'%20OR%20ST%20%3D%20'MT'%20OR%20ST%20%3D%20'ID')%20%20AND%20%20(POP_CLASS%20%3D%207%20OR%20POP_CLASS%20%3D%2010)%20&outFields=CLASS,ST,STFIPS,PLACEFIPS,POP_CLASS,POPULATION,NAME&outSR=4326&f=json"
