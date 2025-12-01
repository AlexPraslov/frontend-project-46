#!/usr/bin/env node

import { Command } from 'commander'
import _ from 'lodash'
import getDataFromFile from './src/parsers.js'
import buildDiff from './src/diffBuilder.js'
import format from './src/formatters/index.js'

// Основная функция
const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = getDataFromFile(filepath1)
  const data2 = getDataFromFile(filepath2)
  const diff = buildDiff(data1, data2)
  return format(diff, formatName)
}

// CLI
const program = new Command()

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format', 'stylish')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2, options) => {
    const result = genDiff(filepath1, filepath2, options.format)
    console.log(result)
  })

program.parse()

export default genDiff
