import { useState, useEffect } from "react"
import { feature, merge, mesh } from "topojson-client"

function useUsData(getCounties = true) {
  // retreive data stored in static folder
  const [allData, setAllData] = useState({
    states: null,
    counties: null,
    outline: null,
    mesh: null,
  })
  useEffect(() => {
    async function getData() {
      const url = `https://s3.amazonaws.com/data.ap.org/wildfire-thinning/us.json`
      const stateCodes = [
        "32",
        "08",
        "41",
        "53",
        "06",
        "49",
        "16",
        "04",
        "35",
        "30",
        "56",
      ]

      const res = await fetch(url)
      const data = await res.json()

      // only get these if needed
      const counties = getCounties
        ? await feature(data, data.objects.counties).features.filter((d) =>
            stateCodes.includes(String(d.id).padStart(5, "0").slice(0, 2))
          )
        : null

      // get the state and overall land outline every time
      const stateGeos = {
        type: "GeometryCollection",
        geometries: await data.objects.states.geometries.filter((d) =>
          stateCodes.includes(String(d.id).padStart(2, "0"))
        ),
      }

      const outline = await merge(data, stateGeos.geometries)
      const states = await feature(data, stateGeos).features
      const stateMesh = await mesh(data, stateGeos, function (a, b) {
        return a !== b
      })

      return [counties, outline, states, stateMesh]
    }

    getData().then(([counties, outline, states, stateMesh]) =>
      setAllData({
        counties: counties,
        outline: outline,
        states: states,
        mesh: stateMesh,
      })
    )
  }, [getCounties])

  return allData
}

export default useUsData
