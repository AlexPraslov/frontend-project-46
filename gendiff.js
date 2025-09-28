#!/usr/bin/env node

import { Command } from 'commander';

const genDiff = (filepath1, filepath2) => {
  return `Comparing ${filepath1} and ${filepath2}`;
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