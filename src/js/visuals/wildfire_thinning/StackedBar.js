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

const Subhead = styled.div`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
`

const Highlight = styled.span`
  background-color: ${(props) => props.color};
  border-radius: 2px;
  padding: 2px;
  margin: 2px;
  color: #fff;
`

const formatNum = (n) => Math.round(n).toLocaleString("en")
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
        {codeToName(stateCode, true)[0] ?? "All States"}{" "}
        {stateCodes[stateCode] &&
          `- Thinning zones target ${(data[0].pct_saved * 100).toFixed(
            1
          )}% of building exposure`}
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
      <Subhead>
        Buildings exposed
        <Highlight color={colors.red}>
          {formatNum(data[0].exp_outside)} outside zones{" "}
        </Highlight>
        <Highlight color={colors.blue}>
          {formatNum(data[0].exp_in_zone)} inside zones
        </Highlight>
        <Highlight color={colors.grey}>
          {" "}
          {formatNum(data[0].exp_in_wild)} in wilderness
        </Highlight>
      </Subhead>
    </div>
  )
}

StackedBar.propTypes = {
  selectedArea: PropTypes.string,
}

export default StackedBar
