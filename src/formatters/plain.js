import _ from 'lodash'

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]'
  }
  if (typeof value === 'string') {
    return `'${value}'`
  }
  return String(value)
}

const buildPath = (currentPath, key) => {
  return currentPath ? `${currentPath}.${key}` : key
}

const formatPlain = (diff, path = '') => {
  const lines = diff.flatMap((node) => {
    const currentPath = buildPath(path, node.key)

    switch (node.type) {
      case 'added':
        return `Property '${currentPath}' was added with value: ${stringify(node.value)}`

      case 'removed':
        return `Property '${currentPath}' was removed`

      case 'updated':
        return `Property '${currentPath}' was updated. From ${stringify(node.oldValue)} to ${stringify(node.newValue)}`

      case 'nested':
        return formatPlain(node.children, currentPath)

      case 'unchanged':
        return []

      default:
        return []
    }
  })

  return lines.filter(line => line !== '').join('\n')
}

export default formatPlain
