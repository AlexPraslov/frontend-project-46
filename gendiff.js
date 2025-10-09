#!/usr/bin/env node

import { Command } from 'commander';
import { getDataFromFile } from './src/parsers.js';
import _ from 'lodash';

// Функция сравнения (добавляем только её)
const buildDiff = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
  
  const diffLines = keys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];
    
    if (!_.has(data2, key)) {
      return `  - ${key}: ${value1}`;
    }
    if (!_.has(data1, key)) {
      return `  + ${key}: ${value2}`;
    }
    if (value1 !== value2) {
      return [`  - ${key}: ${value1}`, `  + ${key}: ${value2}`];
    }
    return `    ${key}: ${value1}`;
  });
  
  return `{\n${diffLines.flat().join('\n')}\n}`;
};

// Основная функция (обновляем только её)
const genDiff = (filepath1, filepath2) => {
  const data1 = getDataFromFile(filepath1);
  const data2 = getDataFromFile(filepath2);
  return buildDiff(data1, data2); // теперь возвращаем diff
};

// CLI часть без изменений
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