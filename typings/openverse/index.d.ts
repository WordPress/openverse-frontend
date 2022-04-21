declare module '*.svg' {
  const SVG: string
  export default SVG
}

declare module '*.svg!inline' {
  const SVG: string
  export default SVG
}

declare module '*.png' {
  const PNG: string
  export default PNG
}

declare module 'csstype' {
  interface Properties {
    '--usable-height'?: string
    '--unusable-height'?: string
    '--progress-time-left'?: string
    '--seek-time-left'?: string
  }
}
