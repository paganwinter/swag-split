# Swagger Splitter
Use to split a monolithic swagger, with many operations (method + path), into a smaller one with a list of specified operations (method + path)

## Usage
```bash
npx https://github.com/paganwinter/swag-split.git "/path/to/input-swagger.yaml" "<comma separated operations list" "/path/to/output-swagger.yaml"

npx https://github.com/paganwinter/swag-split.git "/huge-swagger.yaml" "get /accounts, get /accounts/{accountId}, post /second/operation" "/smaller-swagger.yaml"
```
