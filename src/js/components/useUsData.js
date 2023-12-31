import { useState, useEffect } from 'react'
import { feature, merge } from 'topojson-client'

function useUsData(getCounties = true) {
  // retreive data stored in static folder
  const [allData, setAllData] = useState({
    states: null,
    counties: null,
    outline: null,
  })
  useEffect(() => {
    async function getData() {
      const url = `./us.json`
      const stateCodes = [
        '32',
        '08',
        '41',
        '53',
        '06',
        '49',
        '16',
        '04',
        '35',
        '30',
      ]

      const res = await fetch(url)
      const data = await res.json()

      // only get these if needed
      const counties = getCounties
        ? await feature(data, data.objects.counties).features.filter((d) =>
            stateCodes.includes(String(d.id).padStart(5, '0').slice(0, 2))
          )
        : null

      // get the state and overall land outline every time
      const stateGeos = {
        type: 'GeometryCollection',
        geometries: await data.objects.states.geometries.filter((d) =>
          stateCodes.includes(String(d.id).padStart(2, '0'))
        ),
      }

      const outline = await merge(data, stateGeos.geometries)
      const states = await feature(data, stateGeos).features

      return [counties, outline, states]
    }

    getData().then(([counties, outline, states]) =>
      setAllData({ counties: counties, outline: outline, states: states })
    )
  }, [getCounties])

  return allData
}

export default useUsData
