const fs = require('fs')

const { parse, stringify } = require('comment-json')

let comoponent_name = process.argv[2]

if (comoponent_name === undefined)
  throw new Error('please provide component name')

let tsconfig = parse(fs.readFileSync('./tsconfig.json', 'utf8'))

tsconfig.include.push(`src/components/${comoponent_name}/${comoponent_name}`)
fs.writeFileSync('./tsconfig.json', stringify(tsconfig, null, 3), { flag: 'w' })

console.log(`added component ${comoponent_name} to tsconfig.ts`)
