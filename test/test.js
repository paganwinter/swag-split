const fs = require('fs')
const yaml = require('js-yaml')

const { split } = require('../')

let splitSwag

// splitSwag = split('./test/sample.yaml', 'put /resource-1, post /resource-1')
// fs.writeFileSync('./test/sample-split.yaml', yaml.dump(splitSwag), 'utf-8')

// splitSwag = split('./test/cds_full.yaml', 'get /banking/accounts/balances, post /banking/accounts/balances, get /banking/accounts/{accountId}/balance')
// fs.writeFileSync('./test/cds_balances.yaml', yaml.dump(splitSwag), 'utf-8')

splitSwag = split('./test/cds_full.yaml', 'get /banking/accounts, get /banking/accounts/{accountId}')
fs.writeFileSync('./test/cds_accounts.yaml', yaml.dump(splitSwag), 'utf-8')
