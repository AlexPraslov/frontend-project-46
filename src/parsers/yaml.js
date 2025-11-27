import yaml from 'js-yaml'

const parseYAML = data => yaml.load(data)
export default parseYAML
