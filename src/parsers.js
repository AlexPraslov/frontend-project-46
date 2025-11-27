import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const getAbsolutePath = filepath => path.resolve(process.cwd(), filepath)

const readFile = (filepath) => {
  const absolutePath = getAbsolutePath(filepath)
  return fs.readFileSync(absolutePath, 'utf-8')
}

const parseJSON = data => JSON.parse(data)

const parseYAML = data => yaml.load(data)

const parseData = (data, format) => {
  const parsers = {
    json: parseJSON,
    yml: parseYAML,
    yaml: parseYAML,
  }

  const parser = parsers[format]
  if (!parser) {
    throw new Error(`Unsupported format: ${format}`)
  }

  return parser(data)
}

const getFormat = (filename) => {
  const ext = path.extname(filename).slice(1)
  return ext === 'yaml' ? 'yml' : ext
}

const getDataFromFile = (filepath) => {
  const data = readFile(filepath)
  const format = getFormat(filepath)
  return parseData(data, format)
}

export {
  parseJSON,
  parseYAML,
  parseData,
  getFormat,
  readFile,
}

export default getDataFromFile
