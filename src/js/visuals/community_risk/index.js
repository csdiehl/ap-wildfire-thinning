import React, { useState } from 'react'
import Map from './Map'
import Legend from './Legend'
import { useNodeDimensions } from 'ap-react-hooks'
import styled from 'styled-components'
import { Caption, Header } from '../styles'
import { scale } from 'chroma-js'

const Container = styled.div`
  height: calc(100vh - 20px);
  width: 100%;
  display: grid;
  grid-column-gap: 10px;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr) auto;
  grid-template-areas:
    'header header'
    'map map'
    'legend footer';

  @media (min-width: 768px) {
    grid-template-columns: 200px minmax(0, 1fr);
    grid-template-rows: auto auto minmax(0, 1fr);

    grid-template-areas:
      'header map'
      'legend map'
      'footer map';
  }
`

const CommunityRisk = () => {
  const [selectedState, setSelectedState] = useState(null)
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions

  const colors = scale('Oranges').colors(7)

  return (
    <Container>
      <div style={{ gridArea: 'header' }}>
        <Header>Wildfire risk to communities</Header>
        <Caption>
          This map shows every city and census desginated place,with population
          size, and where wildfires are most likely to occur.{' '}
        </Caption>
      </div>
      <div ref={node} style={{ gridArea: 'map' }}>
        <Map
          width={width}
          height={height}
          colors={colors}
          setSelectedState={setSelectedState}
          selectedState={selectedState}
        />
      </div>

      <Legend style={{ gridArea: 'legend' }} colors={colors} />
      <div style={{ gridArea: 'footer', fontSize: '12px' }}>
        <div
          style={{
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
            fontSize: '16px',
          }}
        >
          <img height='20px' width='20px' src='./tap.svg' alt='tap icon'></img>
          <p style={{ margin: '5px' }}>
            Click on a <strong>state</strong> to zoom in
          </p>
        </div>
        <p>
          Risk, determined by the U.S. forest service, is the probability and
          intensity of fire times the number of housing units.
        </p>
        <p>
          City area = region in which every point is closer to that city than
          any other.{' '}
          <a
            rel='noreferrer'
            target='_blank'
            href='https://mathworld.wolfram.com/VoronoiDiagram.html'
          >
            Read more.
          </a>
        </p>
        <p>Data: U.S. Forest Service</p>
      </div>
    </Container>
  )
}

export default CommunityRisk
