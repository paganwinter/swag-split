const { split } = require('../')

const swaggerFilePath = process.argv[2]
const ops = process.argv[3]

split(swaggerFilePath, ops)
