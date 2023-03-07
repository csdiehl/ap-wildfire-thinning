import { geoAlbersUsa, geoPath, max, scaleLinear } from 'd3'
import React, { useState } from 'react'
import old_growth_ratio from '../../../live-data/old_growth_ratio.csv'
import useGeoData from '../../components/useGeoData'
import { Caption, Header } from '../styles'
import { Bar, ColorBar, Container, Map, Note, ScaleBar } from './styles'
import Tooltip from './Tooltip'

const getRatio = (d) =>
  old_growth_ratio.find((x) => x['NAME'] === d.properties?.name)

const xScale = scaleLinear()
  .domain([0, max(old_growth_ratio, (d) => d['LANDSCAPEA'])])
  .range([0, 100])

const orange = '#E85E0B'
const threshold = 0.3

const ForestChart = () => {
  const [hover, setHover] = useState(null)

  const zones = useGeoData('zone_totals.json')
  const oldGrowth = useGeoData('old_growth_2.json', 'all')

  const sorted =
    zones &&
    zones.sort((a, b) => getRatio(b)?.LANDSCAPEA - getRatio(a)?.LANDSCAPEA)

  return (
    <div>
      <Header>Risk to old-growth forest from thinning</Header>
      <Caption style={{ marginBottom: '20px' }}>
        The grey bar{' '}
        <div
          style={{
            width: '50px',
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        >
          <Bar width={100} />
        </div>{' '}
        shows the zone area, compared to the area of the largest zone{' '}
        <div
          style={{
            width: '50px',
            backgroundColor: 'lightgrey',
            height: '2px',
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        ></div>{' '}
        . The dark bar{' '}
        <div
          style={{
            width: '50px',
            backgroundColor: 'black',
            height: '5px',
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        ></div>{' '}
        shows the % of the zone that is old-growth forest. In some areas,{' '}
        <span style={{ color: orange }}>more than 30% </span>of forest is
        at-risk.
      </Caption>
      <Container>
        {sorted &&
          oldGrowth &&
          sorted.map((d) => {
            // each grid square has its own projection
            const projection = geoAlbersUsa().fitSize([100, 100], d)
            const path = geoPath(projection)
            const forest = oldGrowth.find(
              (x) =>
                x.properties?.name.toLowerCase() ===
                d.properties?.name.toLowerCase()
            )

            const ratio = getRatio(d)?.mature_forest_ratio.toFixed(2),
              area = getRatio(d)?.LANDSCAPEA
            const color = ratio >= threshold ? orange : 'black'
            return (
              <Map key={d.properties.name}>
                <p style={{ margin: '0px', gridArea: 'state' }}>
                  <span style={{ fontWeight: 500, color: color }}>
                    {d.properties.name}
                  </span>{' '}
                  | {d.properties.state}
                </p>
                <div style={{ gridArea: 'bar', position: 'relative' }}>
                  <ScaleBar />

                  <Bar width={xScale(area)}>
                    <ColorBar color={color} width={ratio * 100} />
                    <Note width={ratio * 100}>
                      <p
                        style={{
                          position: 'absolute',
                          margin: '0px',
                          top: '7px',
                        }}
                      >
                        {Math.round(ratio * 100, 1)}%
                      </p>
                    </Note>
                  </Bar>
                </div>

                <svg
                  style={{ gridArea: 'map' }}
                  viewBox='0 0 100 100'
                  width='100%'
                  height='100%'
                  cursor='pointer'
                  onMouseOver={() => setHover(d)}
                  onMouseOut={() => setHover(null)}
                >
                  <path
                    strokeWidth={0.5}
                    strokeLinejoin='round'
                    stroke='#777'
                    fill='none'
                    d={path(d)}
                  ></path>
                  {forest && <path fill={color} d={path(forest)}></path>}
                  {hover && hover.properties.name === d.properties.name && (
                    <Tooltip data={getRatio(hover)?.mature_forest_area} />
                  )}
                </svg>
              </Map>
            )
          })}
      </Container>
    </div>
  )
}

export default ForestChart
