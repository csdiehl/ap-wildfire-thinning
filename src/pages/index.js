import React from "react"
import { toSentence } from "ap-react-utils"
import {
  Nav,
  Article,
  SeoHeadline,
  HeroTitle,
  Metadata,
  BodyText,
  Graphic,
  EndNotes,
  Footer,
} from "tailor"
import apLogo from "ap-interactive-assets/images/AP_LOGO_86x100.png"
import WildfireThinning from "js/visuals/wildfire_thinning"
import ForestChart from "../js/visuals/forest_chart"
import CommunityRisk from "../js/visuals/community_risk"

const metadata = {
  title: "Wildfire Thinning",
  description: "",
  authors: [{ "name": "Caleb Diehl" }],
  published: "2023-01-31T22:23:41.922Z",
}
const notes = [
  {
    title: "Produced by",
    note: "The AP Data Team",
  },
]

function Index() {
  return (
    <div>
      <Nav img={apLogo} />
      <Article>
        <SeoHeadline>{metadata.seoTitle || metadata.title}</SeoHeadline>

        <Graphic widest>
          <CommunityRisk />
        </Graphic>
        <BodyText>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            viverra diam vel libero tristique venenatis. Curabitur vitae quam
            vel nibh suscipit efficitur. Vestibulum ante ipsum primis in
            faucibus orci luctus et ultrices posuere cubilia curae; Proin eu
            sapien in dui tristique fringilla. Fusce eget tellus a libero
            dignissim porta.
          </p>
        </BodyText>
        <Graphic widest>
          <WildfireThinning />
        </Graphic>
        <BodyText>
          <p>
            <strong>Aliquam sed fringilla nunc.</strong> Duis dolor arcu,
            aliquet sed mollis eu, facilisis quis ante. Nullam mollis diam urna,
            at sollicitudin nulla pharetra at. Cras porta, purus et interdum
            sollicitudin, libero dolor laoreet dui, a ullamcorper magna ex quis
            magna. Maecenas sit amet elit at odio sollicitudin sollicitudin. In
            at tincidunt libero.
          </p>
        </BodyText>
        <Graphic wide>
          <ForestChart />
        </Graphic>
        <EndNotes notes={notes} />
      </Article>
      <Footer dark />
    </div>
  )
}

Index.propTypes = {}

Index.defaultProps = {}

export default Index
