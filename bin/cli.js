#!/usr/bin/env node

const { split } = require('../')

const inputSwaggerFilePath = process.argv[2]
const ops = process.argv[3]
const outputSwaggerFilePath = process.argv[4]

split(inputSwaggerFilePath, ops, outputSwaggerFilePath)
