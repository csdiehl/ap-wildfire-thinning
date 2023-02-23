import React from 'react'
import Map from './Map'
import { useNodeDimensions } from 'ap-react-hooks'
import styled from 'styled-components'

const Container = styled.div`
  height: 100vh;
  width: 100%;
`

const CommunityRisk = () => {
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions
  return (
    <Container ref={node}>
      <h1>Risk to Communities</h1>
      <Map width={width} height={height} />
    </Container>
  )
}

export default CommunityRisk
