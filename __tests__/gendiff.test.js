import { fileURLToPath } from 'url';
import path from 'path';
import genDiff from '../gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('flat JSON files comparison', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');

  const result = genDiff(file1, file2);
  expect(result).toContain('host: hexlet.io');
  expect(result).toContain('- timeout: 50');
  expect(result).toContain('+ timeout: 20');
  expect(result).toContain('+ verbose: true');
});
