import styled from "styled-components"

// 32 + 15 + 120 + 20

const Container = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 10px;
  grid-auto-flow: dense;
`

const Map = styled.div`
  background-color: #fff;
  display: grid;
  cursor: pointer;
  width: 100%;
  height: 100%;
  grid-template-columns: 100%;
  grid-template-rows: 32px 150px 20px;
  grid-gap: 5px;
  grid-template-areas:
    "name"
    "map"
    "bar";
  transform-origin: top left;
  transition: transform 300ms ease-out;

  &:hover {
    transform: scale(2);
    z-index: 1000;
    border-left: 4px solid white;
    border-right: 4px solid white;
  }
`

const Bar = styled.div`
  transform: translateY(2px);
  background-color: lightgrey;
  width: ${(props) => props.width}%;
  height: 1px;
`

const ColorBar = styled.div`
  background-color: ${(props) => props.color};
  width: ${(props) => props.width}%;
  height: 5px;
  grid-area: bar;
  position: absolute;
  top: 0;
  left: 0;
`

const Note = styled.div`
  position: absolute;
  left: ${(props) => props.width}%;
  font-size: 11px;
  text-align: center;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Tick = styled.div`
  width: 1px;
  height: 5px;
  background-color: black;
`

const Name = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const State = styled.p`
  font-size: 12px;
  margin: 2px 0px;
  color: #777;
`

const Highlight = styled.span`
  background-color: #e56a23;
  border-radius: 2px;
  padding: 2px;
  color: #fff;
  height: 20px;
`

const Legend = styled.div`
  width: 80px;
  background: linear-gradient(to right, #fff, #121212);
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: #fff;
  border-radius: 2px;
  height: 20px;
`

const Tooltip = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  padding: 5px;
  text-align: center;
  font-weight: 500;
  font-size: 12px;
  background-color: #fff;
  opacity: ${(props) => (props.hovered ? 0.7 : 0)};
  transition: opacity 200ms ease-in;
`

const Acres = styled.p`
  color: #e56a23;
  position: absolute;
  top: 0px;
  left: 0px;
  margin: 0;
  padding: 2px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.7);
  text-shadow: 0 0 10px #fff;
  font-size: 0.875rem;
`

const Card = styled.div`
  position: relative;
  grid-area: map;
  background-color: #fff;
`

export {
  Container,
  Map,
  Note,
  Bar,
  ColorBar,
  Name,
  State,
  Highlight,
  Tick,
  Legend,
  Tooltip,
  Acres,
  Card,
}
