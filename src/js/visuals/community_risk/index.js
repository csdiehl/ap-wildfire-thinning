import React from 'react'
import Map from './Map'
import Legend from './Legend'
import { useNodeDimensions } from 'ap-react-hooks'
import styled from 'styled-components'
import { Caption, Header } from '../styles'

const Container = styled.div`
  height: calc(100vh - 20px);
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto minmax(0, 1fr) auto;
  grid-template-areas:
    'header'
    'map'
    'legend';

  @media (min-width: 768px) {
    grid-template-columns: 200px minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
    grid-column-gap: 10px;
    grid-template-areas:
      'header map'
      'legend map';
  }
`

const CommunityRisk = () => {
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions
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
        <Map width={width} height={height} />
      </div>

      <Legend style={{ gridArea: 'legend' }} />
    </Container>
  )
}

export default CommunityRisk
