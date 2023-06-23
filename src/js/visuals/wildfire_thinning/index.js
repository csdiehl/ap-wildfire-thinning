import React, { useState } from "react"
import { useNodeDimensions } from "ap-react-hooks"
import Map from "./Map"
import styled from "styled-components"
import Legend from "./Legend"
import { scaleSequential, interpolateBlues, interpolateOranges } from "d3"
import StackedBar from "./StackedBar"
import { colors } from "./utils"
import { Caption, Header } from "../styles"

const Container = styled.div`
  height: 750px;
  display: grid;
  box-sizing: border-box;
  padding: 10px;
  grid-gap: 10px;
  box-sizing: border-box;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  grid-template-columns: 100%;
  grid-template-areas:
    "Header"
    "StackedBar"
    "Map"
    "Legend";

  @media (min-width: 768px) {
    grid-template-columns: 25% 75%;
    grid-template-rows: 40px auto minmax(0, 1fr);
    grid-template-areas:
      "Header StackedBar"
      "Header Map"
      "Legend Map";
  }

  @media (min-width: 1024px) {
    grid-template-columns: 30% 70%;
  }
`

const Highlight = styled.span`
  background-color: ${(props) => props.color};
  border-radius: 2px;
  font-weight: 500;
  padding: 2px;
  margin: 0px 2px;
  color: #fff;
`

const ClickMessage = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 16px;
  background-color: #f5f5f5;
  border-radius: 5px;
  width: fit-content;
  padding: 0px 10px;
  margin: 10px 0px;
`

const thinningColor = scaleSequential()
  .domain([0, 6])
  .interpolator(interpolateBlues)

const fireshedColor = scaleSequential()
  .domain([0, 6])
  .interpolator(interpolateOranges)

// Component
function WildfireThinning() {
  // state
  const [selectedArea, setSelectedArea] = useState("none")
  const [stateIsZoomed, setStateIsZoomed] = useState(false)
  const [countyIsZoomed, setCountyIsZoomed] = useState(false)
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions

  return (
    <Container>
      <div style={{ gridArea: "Header" }}>
        <Header>Buildings and targeted forest thinning</Header>
        <Caption>
          This map shows higher risk areas across the Western U.S., including
          zones <Highlight color={colors.blue}>targeted for thinning</Highlight>
          under the Biden administration’s wildfire reduction strategy and areas
          where{" "}
          <Highlight color={colors.red}>thinning is not planned.</Highlight> The
          darker the area, the more buildings that would be exposed to a fire
          that starts in that location. Protected{" "}
          <Highlight color={"grey"}>Wilderness Areas</Highlight> cannot be
          thinned so are excluded from the totals.
        </Caption>
        <ClickMessage>
          <img height="20px" width="20px" src="../tap.svg" alt="tap icon"></img>
          <p style={{ margin: "5px" }}>
            {!stateIsZoomed && !countyIsZoomed
              ? "Click on a state to zoom in"
              : "Click on a county to zoom in"}
          </p>
        </ClickMessage>
      </div>

      <div style={{ gridArea: "Map" }} ref={node}>
        <Map
          thinningColor={thinningColor}
          fireshedColor={fireshedColor}
          width={width}
          height={height}
          setSelectedArea={setSelectedArea}
          stateIsZoomed={stateIsZoomed}
          countyIsZoomed={countyIsZoomed}
          setCountyIsZoomed={setCountyIsZoomed}
          setStateIsZoomed={setStateIsZoomed}
          selectedArea={selectedArea}
        />
      </div>
      <div style={{ gridArea: "StackedBar" }}>
        <StackedBar fireshedColor={fireshedColor} selectedArea={selectedArea} />
      </div>
      <div style={{ gridArea: "Legend" }}>
        <Legend
          warmColors={[0, 1, 2, 3, 4, 5, 6].map((d) => fireshedColor(d))}
          coolColors={[0, 1, 2, 3, 4, 5, 6].map((d) => thinningColor(d))}
          labels={[
            "lowest",
            "very low",
            "low",
            "medium",
            "high",
            "very high",
            "extreme",
          ]}
        />
      </div>
    </Container>
  )
}

WildfireThinning.visual = {
  footerProps: { credit: "Caleb Diehl" },
}

WildfireThinning.propTypes = {}

WildfireThinning.defaultProps = {}

export default WildfireThinning
