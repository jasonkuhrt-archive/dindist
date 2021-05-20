import parse from 'fast-json-parse'
import objectorarray from 'objectorarray'

const ENDENT_ID = 'twhZNwxI1aFG3r4'

function dindist(strings: TemplateStringsArray, ...values: any[]) {
  let result = ''

  for (let i = 0; i < strings.length; i++) {
    result += strings[i]

    if (i < values.length) {
      let value = values[i]
      let isJson = false

      if (parse(value).value) {
        value = parse(value).value
        isJson = true
      }

      if ((value && value[ENDENT_ID]) || isJson) {
        let rawlines = result.split('\n')
        let l = rawlines[rawlines.length - 1].search(/\S/)
        let endentation = l > 0 ? ' '.repeat(l) : ''
        let valueJson = isJson
          ? JSON.stringify(value, null, 2)
          : value[ENDENT_ID]
        let valueLines = valueJson.split('\n')

        valueLines.forEach((l: string, index: number) => {
          if (index > 0) {
            result += '\n' + endentation + l
          } else {
            result += l
          }
        })
      } else if (typeof value === 'string' && value.includes('\n')) {
        let endentations = result.match(/(?:^|\n)( *)$/)

        if (typeof value === 'string') {
          let endentation = endentations ? endentations[1] : ''
          result += value
            .split('\n')
            .map((str, i) => {
              str = ENDENT_ID + str
              return i === 0 ? str : `${endentation}${str}`
            })
            .join('\n')
        } else {
          result += value
        }
      } else {
        result += value
      }
    }
  }
  result = dedent`${result}`
  return result.split(ENDENT_ID).join('')
}

dindist.pretty = (data?: object | string | number | undefined | null) => {
  return objectorarray(data)
    ? { [ENDENT_ID]: JSON.stringify(data, null, 2) }
    : data
}

export default dindist

/**
 * helpers
 */

function dedent(strings: TemplateStringsArray, ...values: string[]) {
  const raw = typeof strings === 'string' ? [strings] : strings.raw

  // first, perform interpolation
  let result = ''
  for (let i = 0; i < raw.length; i++) {
    result += raw[i]
      // join lines when there is a suppressed newline
      .replace(/\\\n[ \t]*/g, '')
      // handle escaped backticks
      .replace(/\\`/g, '`')

    if (i < values.length) {
      result += values[i]
    }
  }

  // now strip indentation
  const lines = result.split('\n')
  let mindent: number | null = null
  lines.forEach((l) => {
    let m = l.match(/^(\s+)\S+/)
    if (m) {
      let indent = m[1].length
      if (!mindent) {
        // this is the first indented line
        mindent = indent
      } else {
        mindent = Math.min(mindent, indent)
      }
    }
  })

  if (mindent !== null) {
    const m = mindent // appease Flow
    result = lines.map((l) => (l[0] === ' ' ? l.slice(m) : l)).join('\n')
  }

  return (
    result
      // dedent eats leading and trailing whitespace too
      .trim()
    // handle escaped newlines at the end to ensure they don't get stripped too
    // .replace(/\\n/g, '\n')
  )
}
