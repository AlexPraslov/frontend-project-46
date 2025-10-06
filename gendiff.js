#!/usr/bin/env node

import { Command } from 'commander';
import { getDataFromFile } from './src/parsers.js';

const genDiff = (filepath1, filepath2) => {
  const data1 = getDataFromFile(filepath1);
  const data2 = getDataFromFile(filepath2);
  
  return `Comparing ${filepath1} and ${filepath2}\nData1: ${JSON.stringify(data1)}\nData2: ${JSON.stringify(data2)}`;
};

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2) => {
    const result = genDiff(filepath1, filepath2);
    console.log(result);
  });

program.parse();

export default genDiff;