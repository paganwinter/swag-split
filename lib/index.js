const fs = require('fs')
const yaml = require('js-yaml')


const split = function (swaggerFilePath, opsStr, outputSwaggerFilePath = './swag-split-output.yaml') {
  let swag = yaml.safeLoad(fs.readFileSync(swaggerFilePath, 'utf-8'))

  let { paths, definitions, parameters, responses } = swag
  swag.paths = {}
  swag.definitions = {}
  swag.parameters = {}
  swag.responses = {}

  let ops = opsStr.split(',').map(o => o.trim())
  console.log(ops)
  ops.forEach(item => {
    let [method, path] = item.split(' ')
    console.log('-----------------')
    console.log(method, path, ':')
    console.log('-----------------')
    let op = paths[path][method]

    // add path
    swag.paths[path] = swag.paths[path] || {}

    // TODO: add path level parameters
    if (paths[path].parameters) {
      paths[path].parameters.forEach(param => {
        // see if any params are $ref
        if (param.$ref) {
          let paramName = param.$ref.split('/')[2]
          swag.parameters[paramName] = parameters[paramName]
          console.log(`added '${paramName}' to parameters`)
        }
        // see if any params use schema $ref
        if (param.schema && param.schema.$ref) {
          let defName = param.schema.$ref.split('/')[2]
          swag.definitions[defName] = definitions[defName]
          console.log(`added '${defName}' to definitions`)
        }
      })
    }

    // add method/op
    swag.paths[path][method] = paths[path][method]

    // find globally defined params, schema, and responses
    // that are used in required operations
    if (op.parameters) {
      op.parameters.forEach(param => {
        // see if any params are $ref
        if (param.$ref) {
          let paramName = param.$ref.split('/')[2]
          swag.parameters[paramName] = parameters[paramName]
          console.log(`added '${paramName}' to parameters`)
        }
        // see if any params use schema $ref
        if (param.schema && param.schema.$ref) {
          let defName = param.schema.$ref.split('/')[2]
          swag.definitions[defName] = definitions[defName]
          console.log(`added '${defName}' to definitions`)
        }
      })
    }

    for (let respStatus in op.responses) {
      let response = op.responses[respStatus]
      // see if any responses are $ref
      if (response.$ref) {
        let respName = response.$ref.split('/')[2]
        swag.responses[respName] = responses[respName]
        console.log(`added '${respName}' to responses`)
      }
      // see if any responses use schema $ref
      if (response.schema && response.schema.$ref) {
        let defName = response.schema.$ref.split('/')[2]
        swag.definitions[defName] = definitions[defName]
        console.log(`added '${defName}' to definitions`)
      }
    }
  })

  console.log('------------------------')
  console.log('Adding other definitions')
  console.log('------------------------')
  // see if any in-scope globally declared params use schema $ref
  for (let paramName in swag.parameters) {
    let param = swag.parameters[paramName]
    if (param.schema && param.schema.$ref) {
      let defName = param.schema.$ref.split('/')[2]
      swag.definitions[defName] = definitions[defName]
      console.log(`added '${defName}' to definitions`)
    }
  }
  // see if any in-scope globally declared responses use schema $ref
  for (let respName in swag.responses) {
    let response = swag.responses[respName]
    if (response.schema && response.schema.$ref) {
      let defName = response.schema.$ref.split('/')[2]
      swag.definitions[defName] = definitions[defName]
      console.log(`added '${defName}' to definitions`)
    }
  }

  // recursively find `$ref`s inside all definitions
  // and add them to definitions
  for (let defName in swag.definitions) {
    let requiredDefs = []
    requiredDefs = recurRef(requiredDefs, definitions, swag.definitions, defName)
    // console.log(requiredDefs)
    requiredDefs.forEach(defName => {
      // let defName = param.schema.$ref.split('/')[2]
      swag.definitions[defName] = definitions[defName]
      console.log(`added '${defName}' to definitions`)
    })
  }

  /*
  console.log('parameters: -----')
  console.log(swag.parameters)
  console.log('responses: -----')
  console.log(swag.responses)
  console.log('definitions: -----')
  console.log(swag.definitions)
  */

  console.log('======================================')

  fs.writeFileSync(outputSwaggerFilePath, yaml.dump(swag), 'utf-8')

  return swag
}

function recurRef(defCollector, origDefs, obj, key) {
  let item = obj[key]
  if (Array.isArray(item)) {
    item.forEach((el, i) => {
      recurRef(defCollector, origDefs, item, i)
    })
  } else if ((typeof item === 'object') && (item !== null)) {
    for (let key in item) {
      if (item.hasOwnProperty(key)) {
        recurRef(defCollector, origDefs, item, key)
      }
    }
  } else {
    if (key === '$ref') {
      let refName = obj.$ref.split('/')[2]
      defCollector.push(refName)
      recurRef(defCollector, origDefs, origDefs, refName)
    }
  }
  return defCollector
}

module.exports = {
  split,
}
