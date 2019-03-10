export interface Gradient {
  colorStops: Array<string>
  toDirection: string
}

const gradients: { [id: string]: Gradient } = {
  purple: { colorStops: ["#5D34B6", "#44269B"], toDirection: "135deg" }
}

export default gradients
