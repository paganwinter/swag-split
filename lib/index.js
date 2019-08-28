const fs = require('fs')
const yaml = require('js-yaml')


const split = function (swaggerFilePath, opsStr) {
  let swag = yaml.safeLoad(fs.readFileSync(swaggerFilePath, 'utf-8'))

  let { paths, definitions, parameters, responses } = swag
  swag.paths = {}
  swag.definitions = {}
  swag.parameters = {}
  swag.responses = {}

  let ops = opsStr.split(',').map(o => o.trim())
  console.log('splitting', ops)
  ops.forEach(item => {
    let [method, path] = item.split(' ')
    let op = paths[path][method]

    // add path
    swag.paths[path] = swag.paths[path] || {}
    // TODO: add path level parameters
    // add method/op
    swag.paths[path][method] = paths[path][method]

    // find globally defined params, schema, and responses
    // that are used in required operations
    op.parameters.forEach(param => {
      if (param.$ref) {
        let paramName = param.$ref.split('/')[2]
        swag.parameters[paramName] = parameters[paramName]
        console.log(`added ${paramName} to parameters`)
      }
      if (param.schema && param.schema.$ref) {
        let defName = param.schema.$ref.split('/')[2]
        swag.definitions[defName] = definitions[defName]
        console.log(`added ${defName} to definitions`)
      }
    })

    for (let respStatus in op.responses) {
      let response = op.responses[respStatus]
      if (response.$ref) {
        let respName = response.$ref.split('/')[2]
        swag.responses[respName] = responses[respName]
        console.log(`added ${respName} to responses`)
      }
      if (response.schema && response.schema.$ref) {
        let defName = response.schema.$ref.split('/')[2]
        swag.definitions[defName] = definitions[defName]
        console.log(`added ${defName} to definitions`)
      }
    }
  })

  for (let paramName in swag.parameters) {
    let param = swag.parameters[paramName]
    if (param.schema && param.schema.$ref) {
      let defName = param.schema.$ref.split('/')[2]
      swag.definitions[defName] = definitions[defName]
      console.log(`added ${defName} to definitions`)
    }
  }

  for (let respName in swag.responses) {
    let response = swag.responses[respName]
    if (response.schema && response.schema.$ref) {
      let defName = response.schema.$ref.split('/')[2]
      swag.definitions[defName] = definitions[defName]
      console.log(`added ${defName} to definitions`)
    }
  }

  // console.log(swag)
  console.log(swag.parameters)
  console.log('-----')
  console.log(swag.responses)
  console.log('-----')
  console.log(swag.definitions)
  console.log('-----')
  return swag
}

module.exports = {
  split,
}
