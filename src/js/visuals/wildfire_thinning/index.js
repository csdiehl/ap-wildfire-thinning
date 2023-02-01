import React from 'react'
import { useNodeDimensions } from 'ap-react-hooks'
import Map from './Map'
import styled from 'styled-components'

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  content-sizing: border-box;
  height: calc(100vh - 40px);
  width: 100%;
  grid-template-rows: 10% 70% 20%;
  grid-template-columns: 100%;
  grid-template-areas:
    'Header'
    'Map'
    'Legend';

  @media (min-width: 768px) {
    grid-template-columns: 20% 80%;
    grid-template-rows: 50% 50%;
    grid-template-areas:
      'Header Map'
      'Legend Map';
  }
`

// Component
function WildfireThinning() {
  // state
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions

  return (
    <Container>
      <div style={{ background: 'lightgrey', gridArea: 'Header' }}>
        <h1>Firesheds Map</h1>
      </div>

      <div style={{ gridArea: 'Map' }} ref={node}>
        <Map width={width} height={height} />
      </div>
      <div style={{ background: 'lightgrey', gridArea: 'Legend' }}>
        <h1>Legend Area</h1>
      </div>
    </Container>
  )
}

WildfireThinning.visual = {
  headline: 'Wildfire Thinning',
  chatter: '',
  footerProps: { credit: 'AP Data Team' },
}

WildfireThinning.propTypes = {}

WildfireThinning.defaultProps = {}

export default WildfireThinning
