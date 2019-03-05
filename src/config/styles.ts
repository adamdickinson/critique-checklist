import PolarVertexWoff2 from "../fonts/PolarVertex.woff2"
import PolarVertexWoff from "../fonts/PolarVertex.woff"
import { createGlobalStyle } from "styled-components"
import React from "react"

export const GlobalStyle: React.ComponentClass = createGlobalStyle`
  @font-face {
    font-family: "Polar Vertex";
    src: url(${PolarVertexWoff2}) format("woff2"),
         url(${PolarVertexWoff}) format("woff");
    font-weight: normal;
    font-style: normal;
  }

  html, body {
    font-family: "Roboto Condensed", sans-serif;
  }
`
