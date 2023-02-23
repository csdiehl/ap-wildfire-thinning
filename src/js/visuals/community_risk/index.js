import city_data from '../../../live-data/cities.csv'
import React from 'react'

const CommunityRisk = () => {
  return (
    <div>
      {city_data.slice(0, 5).map((d) => (
        <p>{d.lat}</p>
      ))}
    </div>
  )
}

export default CommunityRisk
