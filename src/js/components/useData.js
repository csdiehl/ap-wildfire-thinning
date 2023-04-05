import { useEffect, useState } from "react"

// eslint-disable-next-line react/display-name
const useGeoData = (url) => {
  const [data, setData] = useState(null)

  // retreive data stored in static folder
  useEffect(() => {
    async function getData() {
      const res = await fetch(url)
      const data = await res.json()
      return data
    }

    getData().then((data) => setData(data))
  }, [url])

  return data
}

export default useGeoData
