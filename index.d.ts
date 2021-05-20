declare module 'objectorarray' {
  export default function (
    val?: object | number | string | undefined | null
  ): boolean
}

declare module 'fast-json-parse' {
  export default function (data: string): { value: object; err?: string }
}
