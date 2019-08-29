const fs = require('fs')
const yaml = require('js-yaml')

const { split } = require('../')

let splitSwag

splitSwag = split('./test/sample.yaml', 'put /resource-1, post /resource-1', './test/sample-split.yaml')

splitSwag = split('./test/cds_full.yaml', 'get /banking/accounts/balances, post /banking/accounts/balances, get /banking/accounts/{accountId}/balance', './test/cds_balances.yaml')

splitSwag = split('./test/cds_full.yaml', 'get /banking/accounts, get /banking/accounts/{accountId}', './test/cds_accounts.yaml')
