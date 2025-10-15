import fs from 'fs';
import path from 'path';

const getAbsolutePath = (filepath) => path.resolve(process.cwd(), filepath);

const readFile = (filepath) => {
  const absolutePath = getAbsolutePath(filepath);
  return fs.readFileSync(absolutePath, 'utf-8');
};

const parseData = (data, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

const getFormat = (filename) => path.extname(filename).slice(1);

const getDataFromFile = (filepath) => {
  const data = readFile(filepath);
  const format = getFormat(filepath);
  return parseData(data, format);
};

export default getDataFromFile;
