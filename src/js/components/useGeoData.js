import { useEffect, useState } from 'react'
import { feature } from 'topojson-client'

const useGeoData = (file) => {
  const [data, setData] = useState(null)

  // retreive data stored in static folder
  useEffect(() => {
    async function getData() {
      const url = `./${file}`
      const name = file.split('.')[0]

      const res = await fetch(url)
      const data = await res.json()
      const geoData = await feature(data, data.objects[name]).features

      return geoData
    }

    getData().then((data) => setData(data))
  }, [file])

  return data
}

export default useGeoData
