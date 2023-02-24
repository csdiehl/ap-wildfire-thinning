import React from 'react'
import { zones } from '../wildfire_thinning/data'
import * as d3 from 'd3'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 10px;
`

const Map = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 100%;
  grid-template-rows: auto 15px minmax(0, 1fr);
  grid-template-areas:
    'state'
    'bar'
    'map';
`

const color = '#125CA3'

const Bar = styled.div`
  background-color: lightgrey;
  width: 100%;
  height: 10px;
`

const ColorBar = styled.div`
  background-color: ${color};
  width: ${(props) => props.width}%;
  height: 10px;
  grid-area: bar;
  position: absolute;
  top: 0;
  left: 0;
`

const ForestChart = () => {
  return (
    <Container>
      {zones.map((d) => {
        // each grid square has its own projection
        const projection = d3.geoAlbersUsa().fitSize([100, 100], d)
        const path = d3.geoPath(projection)
        return (
          <Map key={d.properties.name}>
            <p style={{ margin: '0px', gridArea: 'state' }}>
              <span style={{ fontWeight: 600 }}>{d.properties.name}</span> |{' '}
              {d.properties.state}
            </p>
            <div style={{ gridArea: 'bar', position: 'relative' }}>
              <Bar></Bar>
              <ColorBar width={20} />
            </div>

            <svg
              style={{ gridArea: 'map' }}
              viewBox='0 0 100 100'
              width='100%'
              height='100%'
            >
              <path
                strokeWidth={0.5}
                strokeLinejoin='round'
                stroke='#777'
                fill='none'
                d={path(d)}
              ></path>
            </svg>
          </Map>
        )
      })}
    </Container>
  )
}

export default ForestChart
