import React, { useState, useMemo } from 'react'
import old_growth_ratio from '../../../live-data/old_growth_ratio.csv'
import useGeoData from '../../components/useGeoData'
import { Caption, Header } from '../styles'
import {
  Bar,
  ColorBar,
  Container,
  Highlight,
  Map,
  Name,
  Note,
  State,
  Tick,
  Legend,
  Tooltip,
} from './styles'
import { format } from 'd3'

const getRatio = (d) => {
  const data = old_growth_ratio.find((x) => x['name'] === d.properties?.name)
  return +data?.mature_forest_ratio.toFixed(2) ?? 0
}

const ForestChart = () => {
  const [hover, setHover] = useState(null)

  const zones = useGeoData('zone_totals.json')
  const oldGrowth = useGeoData('old_growth_2.json', 'all')

  const sorted = useMemo(
    () => zones && zones.sort((a, b) => getRatio(b) - getRatio(a)),
    [zones]
  )

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
        shows the <Highlight>zone area</Highlight> in hecatares. The dark bar{' '}
        <div
          style={{
            width: '50px',
            backgroundColor: 'black',
            height: '5px',
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        ></div>{' '}
        shows the % of the zone that is old-growth forest. The darker the shaded
        area <Legend>0% to 100%</Legend>, the greater percentage of old-growth
        forest it contains.
      </Caption>
      <Container>
        {sorted &&
          oldGrowth &&
          sorted.map((d) => {
            // each grid square has its own projection
            const ratio = getRatio(d)
            const { landscapeacres, name, state } = d.properties

            return (
              <Map
                key={name}
                onMouseOver={() => setHover(name)}
                onMouseOut={() => setHover(null)}
              >
                <div style={{ gridArea: 'name' }}>
                  <Name> {name}</Name>
                  <State>{state}</State>
                </div>

                <div style={{ gridArea: 'bar', position: 'relative' }}>
                  <Bar width={100} />
                  <Note width={100}>
                    <Tick />
                    <p style={{ margin: '0px', color: '#777' }}>
                      {format('.1s')(landscapeacres / 2.471)}
                    </p>
                  </Note>

                  <ColorBar color='#121212' width={ratio * 100} />
                  <Note width={ratio * 100}>
                    <Tick />
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
                </div>

                <div style={{ position: 'relative', gridArea: 'map' }}>
                  <img
                    alt='a forest'
                    width='100%'
                    height='100%'
                    src={`./forest_images/${name}.png`}
                    style={{
                      borderRadius: '5px',
                      border: '1px solid #F5F5F5',
                    }}
                  />
                  <Tooltip hovered={name === hover}>
                    {format('.1s')((ratio * landscapeacres) / 2.471)} hecatares
                    of old-growth
                  </Tooltip>
                </div>
              </Map>
            )
          })}
      </Container>
    </div>
  )
}

export default ForestChart
