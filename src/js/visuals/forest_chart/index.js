import React, { useState } from "react"
import { Caption, Header } from "../styles"
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
  Acres,
  Card,
} from "./styles"
import { format } from "d3"
import { forestData } from "./data"

const ForestChart = () => {
  const [hover, setHover] = useState(null)

  return (
    <div
      id="forest-container"
      style={{
        boxSizing: "border-box",
        padding: "10px",
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      <Header>Mature forest density in areas to be thinned</Header>
      <Caption style={{ marginBottom: "20px" }}>
        The dark bar{" "}
        <div
          style={{
            width: "20px",
            backgroundColor: "black",
            height: "5px",
            display: "inline-block",
            verticalAlign: "middle",
          }}
        ></div>{" "}
        shows the percentage of mature forest in{" "}
        <Highlight>zones slated to be thinned</Highlight>
        under a Biden administration plan. The darker the shaded area,{" "}
        <Legend>0% to 100%</Legend> the greater percentage of mature forest the
        area contains. Researchers classify mature forest by three metrics: tree
        height, canopy cover and biomass compared to surrounding areas.
      </Caption>
      <Container>
        {forestData &&
          forestData.map((d, i) => {
            // each grid square has its own projection
            const { landscapeacres, name, state, ratio } = d

            return (
              <Map
                delay={i * 200}
                key={name}
                onMouseOver={() => setHover(name)}
                onMouseOut={() => setHover(null)}
              >
                <div style={{ gridArea: "name" }}>
                  <Name> {name}</Name>
                  <State>{state}</State>
                </div>

                <div style={{ gridArea: "bar", position: "relative" }}>
                  <Bar width={100} />

                  <ColorBar color="#121212" width={ratio * 100} />
                  <Note width={ratio * 100}>
                    <Tick />
                    <p
                      style={{
                        position: "absolute",
                        margin: "0px",
                        top: "7px",
                      }}
                    >
                      {Math.round(ratio * 100, 1)}%
                    </p>
                  </Note>
                </div>

                <Card>
                  <img
                    alt="a forest"
                    width="100%"
                    height="100%"
                    src={`../forest_images/${name}.png`}
                    style={{
                      borderRadius: "5px",
                      border: "1px solid #F5F5F5",
                    }}
                  ></img>
                  <Acres>
                    {format(".2s")(landscapeacres / 640)}{" "}
                    <span style={{ fontWeight: 400, color: "#777" }}>
                      square miles
                    </span>
                  </Acres>
                  <Tooltip hovered={name === hover}>
                    {format(".2s")(ratio * (landscapeacres / 640))} square miles
                    of mature forest
                  </Tooltip>
                </Card>
              </Map>
            )
          })}
      </Container>
      <p>Source: Wild Heritage</p>
    </div>
  )
}

export default ForestChart
