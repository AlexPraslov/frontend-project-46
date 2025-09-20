#!/usr/bin/env node

import { Command } from 'commander';
import { createRequire } from 'node:module';
import { parseFile } from './parser.js';

const require = createRequire(import.meta.url);
const { version } = require('./package.json');

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version(version)
  .argument('<filepath1>', 'path to first file')
  .argument('<filepath2>', 'path to second file')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2, options) => {
    try {
      // Парсим оба файла
      const data1 = parseFile(filepath1);
      const data2 = parseFile(filepath2);
      
      console.log('File 1 data:', data1);
      console.log('File 2 data:', data2);
      console.log(`Selected format: ${options.format}`);
      
      // Здесь будет логика сравнения данных
      // compareData(data1, data2, options.format);
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });


program.parse();