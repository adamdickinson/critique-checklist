import * as PolarVertextWoff2 from "../fonts/PolarVertex.woff2"
import * as PolarVertextWoff from "../fonts/PolarVertex.woff"



export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Polar Vertex";
    src: url(${PolarVertexWoff2}) format("woff2"),
         url(${PolarVertexWoff}) format("woff");
    font-weight: normal;
    font-style: normal;
  }
`
