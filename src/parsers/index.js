import parseJSON from './json.js';
import parseYAML from './yaml.js';

const parsers = {
  json: parseJSON,
  yml: parseYAML,
  yaml: parseYAML,
};

export default (data, format) => {
  const parser = parsers[format];
  if (!parser) {
    throw new Error(`Unsupported format: ${format}`);
  }
  return parser(data);
};