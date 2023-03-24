import { geoMercator, geoPath, path, select, zoom, zoomIdentity } from 'd3'
import { tile } from 'd3-tile'
import React, { useEffect, useRef, useState } from 'react'
import useGeoData from '../../components/useGeoData'
import firesheds_thinning from './firesheds_thinning.json'
import { feature } from 'topojson-client'

function getHillShade(x, y, z) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/${z}/${y}/${x}.png`
}

const firesheds = feature(
  firesheds_thinning,
  firesheds_thinning.objects.firesheds_thinning
).features

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
  const [mapCenter, centerMap] = useState({
    center: [-114.04, 40.71],
    zoomLevel: 4096,
  })
  // const firesheds = useGeoData('exp_firesheds.json')
  const svgRef = useRef()

  useEffect(() => {
    // now we're never calling this function because we're not using D3 to zoom at all
    const zoomer = zoom()
      .scaleExtent([1 << 10, 1 << 15])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', ({ transform }) => zoomed(transform))

    // projection
    const projection = geoMercator()
      .scale(1 / (2 * Math.PI))
      .translate([0, 0])

    // create the tiler function and pass it the transform
    const tiler =
      projection &&
      tile()
        .extent([
          [0, 0],
          [width, height],
        ])
        .tileSize(512)

    // generators
    const path = geoPath(projection)

    const zoomed = (transform) => {
      // make tiles
      const tiles = tiler(transform)

      const image = select(document.getElementById('hillshade-tiles'))
      // select the empty image by id
      // attach the tiles
      image
        .selectAll('image')
        .data(tiles, (d) => d)
        .enter()
        .append('image')
        .attr('xlink:href', (d) => getHillShade(...d))
        .attr('x', ([x]) => (x + tiles.translate[0]) * tiles.scale)
        .attr('y', ([, y]) => (y + tiles.translate[1]) * tiles.scale)
        .attr('width', tiles.scale)
        .attr('height', tiles.scale)

      projection
        .scale(transform.k / (2 * Math.PI))
        .translate([transform.x, transform.y])

      const paths = select(svgRef.current).selectAll('.fireshed')
      paths.data(firesheds).attr('d', (d) => path(d))
    }

    const svg = select(svgRef.current)

    svg
      .transition()
      .duration(750)
      .call(
        zoomer.transform,
        zoomIdentity
          .translate(width / 2, height / 2)
          .scale(-mapCenter.zoomLevel)
          .translate(...projection(mapCenter.center))
          .scale(-1)
      )
  }, [mapCenter, height, width])

  function zoomIn() {
    centerMap({ center: [-115.04, 39.71], zoomLevel: 2 * 4096 })
  }

  return (
    <svg
      vectorEffect='non-scaling-stroke'
      ref={svgRef}
      width={width}
      height={height}
      onClick={zoomIn}
    >
      <g id='map-content' cursor='pointer'>
        <g id='hillshade-tiles'></g>
      </g>
      <g id='fireshed-paths'>
        {firesheds.map((d) => (
          <path
            className='fireshed'
            stroke='red'
            fill='blue'
            key={d.properties.fireshed_code}
          ></path>
        ))}
      </g>
    </svg>
  )
}

export default Map
