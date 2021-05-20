import dindist from '.'

test('object', () => {
  var json = JSON.stringify(JSON.parse('[ "abc" ]'), null, 2)

  var someobj = {
    contact: {
      jack: '123456',
      tom: '654321',
    },
    name: 'template',
    color: 'blue',
    animals: ['bear', 'fish', 'dog', 'cat'],
  }

  var colors = ['red', 'pink', 'white']
  var objectName = 'someobj'

  var dependencies = ['jquery', 'underscore', 'bootstrap']
  var dependencyTmpl = ``

  dependencies.forEach((d, i) => {
    dependencyTmpl += `var ${d} = require("${d}")\n`
  })

  var jsFile = dindist`
    ${dependencyTmpl}
    module.exports = store

    function store (state, emitter) {
      emitter.on("DOMContentLoaded", function () {
        state["json"] = ${json}
        state["${objectName}"] = ${dindist.pretty(someobj)}
        state["colors"] = ${dindist.pretty(colors)}
        state["name"] = "${dindist.pretty('jack')}"
        state["name2"] = "${'tom'}"
        state["number"] = ${dindist.pretty(123)}
        state["number2"] = ${123}
        state["Iamundefined"] = ${dindist.pretty()}
        state["Iamnull"] = ${dindist.pretty(null)}
        state["Iamregexp"] = ${dindist.pretty(/abc/)}
      })
    }
  `

  expect(jsFile).toEqual(
    `var jquery = require("jquery")
var underscore = require("underscore")
var bootstrap = require("bootstrap")

module.exports = store

function store (state, emitter) {
  emitter.on("DOMContentLoaded", function () {
    state["json"] = [
      "abc"
    ]
    state["someobj"] = {
      "contact": {
        "jack": "123456",
        "tom": "654321"
      },
      "name": "template",
      "color": "blue",
      "animals": [
        "bear",
        "fish",
        "dog",
        "cat"
      ]
    }
    state["colors"] = [
      "red",
      "pink",
      "white"
    ]
    state["name"] = "jack"
    state["name2"] = "tom"
    state["number"] = 123
    state["number2"] = 123
    state["Iamundefined"] = undefined
    state["Iamnull"] = null
    state["Iamregexp"] = /abc/
  })
}`
  )
})

test('string', () => {
  const a = `
hello
  world`

  const b = dindist`
    foo.
    ${a}
    bar.`

  expect(b).toEqual(
    `foo.

hello
  world
bar.`
  )
})

test('issue#1', () => {
  const a = '"test"'
  const r = dindist`
    {
      ${a}: null
    }
  `
  expect(r).toEqual(`{
  "test": null
}`)
})

test('issue#2', () => {
  const r = dindist`
    foo.
    x=${'hello\n  world'}
    bar.
  `
  expect(r).toEqual(
    `foo.
x=hello
  world
bar.`
  )
})

test('tab', () => {
  expect(dindist`foo\tbar`).toEqual('foo\tbar')
})

// https://github.com/prisma/nexus-prisma/issues/50
test('issue#3', () => {
  const result = dindist`\\a\\b\\node_modules\\c\\index.js`
  expect(result).toEqual(`\\a\\b\\node_modules\\c\\index.js`)
})
