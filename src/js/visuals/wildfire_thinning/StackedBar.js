import React, { useEffect, useRef } from "react"
import { useNodeDimensions } from "ap-react-hooks"
import riskTotals from "../../../live-data/risk_totals.json"
import { codeToName, stateCodes } from "./utils"
import * as d3 from "d3"
import { colors } from "./utils"
import PropTypes from "prop-types"
import styled from "styled-components"

const Header = styled.div`
  font-size: 1.3rem;
  font-weight: 400;
  margin: 5px;
`

const cols = ["exp_outside", "exp_in_zone", "exp_in_wild"]

const StackedBar = ({ selectedArea }) => {
  const [node, dimensions] = useNodeDimensions()
  const svgRef = useRef()

  const stateCode =
    selectedArea.length > 2
      ? selectedArea.padStart(5, 0).slice(0, 2)
      : selectedArea.padStart(2, 0)

  const data = stateCodes[stateCode]
    ? riskTotals.filter((d) => d.state.padStart(2, 0) === stateCodes[stateCode])
    : [
        {
          state: "All States",
          exp_in_zone: d3.sum(riskTotals, (d) => d.exp_in_zone),
          exp_outside: d3.sum(riskTotals, (d) => d.exp_outside),
          exp_in_wild: d3.sum(riskTotals, (d) => d.exp_in_wild),
        },
      ]

  const stackedData = d3.stack().keys(cols)(data)

  const total = data[0].exp_outside + data[0].exp_in_wild + data[0].exp_in_zone

  const X = d3.scaleLinear().domain([0, total]).range([0, dimensions.width])
  const color = d3
    .scaleOrdinal()
    .domain(cols)
    .range([colors.red, colors.blue, colors.grey])

  useEffect(() => {
    d3.select(svgRef.current)
      .selectAll("rect")
      .data(stackedData)
      .transition()
      .duration(1000)
      .attr("x", (d) => X(d[0][0]))
      .attr("width", (d) => X(d[0][1] - d[0][0]))
  }, [stackedData, X])

  return (
    <div ref={node}>
      <Header>
        {stateCodes[stateCode]
          ? `Thinning zones cover ${(data[0].pct_saved * 100).toFixed(
              1
            )}% of building exposure in ${
              codeToName(stateCode, true)[0] ?? "All States"
            }`
          : "Thinning zones cover 25% of building exposure in 10 states"}
      </Header>
      <svg ref={svgRef} height={10} width={dimensions.width}>
        {stackedData.map((d) => {
          return (
            <rect
              y={0}
              height={8}
              key={d.key}
              stroke="#FFF"
              fill={color(d.key)}
            ></rect>
          )
        })}
      </svg>
    </div>
  )
}

StackedBar.propTypes = {
  selectedArea: PropTypes.string,
}

export default StackedBar
