import React from 'react'

function WildfireThinning() {
  return (
    <div style={{ paddingBottom: '50%', background: 'linear-gradient(20deg, #9198e5, #00caa0)' }} />
  )
}

WildfireThinning.visual = {
  headline: "Wildfire Thinning",
  chatter: "",
  footerProps: { credit: 'AP Data Team' },
}

WildfireThinning.propTypes = {}

WildfireThinning.defaultProps = {}

export default WildfireThinning
