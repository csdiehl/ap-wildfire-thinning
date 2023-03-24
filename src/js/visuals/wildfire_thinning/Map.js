import { geoMercator, geoPath, select, zoom, zoomIdentity } from 'd3'
import { tile } from 'd3-tile'
import React, { useEffect, useRef, useState } from 'react'
import useGeoData from '../../components/useGeoData'

function getHillShade(x, y, z) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/${z}/${y}/${x}.png`
}

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
    // const path = geoPath(projection)

    const zoomed = (transform) => {
      console.log(transform)
      // make tiles
      const tiles = tiler(transform)

      console.log(tiles)

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
    }

    const svg = select(svgRef.current)

    console.log(mapCenter)

    svg.call(
      zoomer.transform,
      zoomIdentity
        .translate(width / 2, height / 2)
        .scale(-mapCenter.zoomLevel)
        .translate(...projection(mapCenter.center))
        .scale(-1)
    )
  }, [mapCenter, height, width])

  function zoomIn() {
    centerMap({ center: [-118.04, 45.71], zoomLevel: 7000 })
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
    </svg>
  )
}

export default Map
