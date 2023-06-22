import { useEffect, useState } from "react"
import { feature } from "topojson-client"

// eslint-disable-next-line react/display-name
const useGeoData = (file, objects = file.split(".")[0]) => {
  const [data, setData] = useState(null)

  // retreive data stored in static folder
  useEffect(() => {
    async function getData() {
      const url = `https://s3.amazonaws.com/data.ap.org/wildfire-thinning/${file}`

      const res = await fetch(url)
      const data = await res.json()
      const geoData = await feature(data, data.objects[objects]).features

      return geoData
    }

    getData().then((data) => setData(data))
  }, [file, objects])

  return data
}

export default useGeoData
