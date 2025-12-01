import _ from 'lodash'

const stylish = (diff) => {
  const format = (nodes, depth = 1) => {
    const indentSize = 4
    const currentIndent = ' '.repeat(depth * indentSize - 2)

    const lines = nodes.flatMap((node) => {
      const makeLine = (sign, value) => {
        const formattedValue = _.isObject(value) && !_.isArray(value)
          ? `{\n${formatObject(value, depth + 1)}\n${currentIndent}  }`
          : value

        return `${currentIndent}${sign} ${node.key}: ${formattedValue}`
      }

      switch (node.type) {
        case 'added':
          return makeLine('+', node.value)
        case 'removed':
          return makeLine('-', node.value)
        case 'updated':
          return [
            makeLine('-', node.oldValue),
            makeLine('+', node.newValue),
          ]
        case 'nested':
          return `${currentIndent}  ${node.key}: {\n${format(node.children, depth + 1)}\n${currentIndent}  }`
        case 'unchanged':
          return makeLine(' ', node.value)
        default:
          return ''
      }
    })

    return lines.join('\n')
  }

  const formatObject = (obj, depth) => {
    const indent = ' '.repeat(depth * 4 - 2)
    return Object.entries(obj)
      .map(([key, value]) => {
        const formattedValue = _.isObject(value) && !_.isArray(value)
          ? `{\n${formatObject(value, depth + 1)}\n${indent}  }`
          : value
        return `${indent}  ${key}: ${formattedValue}`
      })
      .join('\n')
  }

  return `{\n${format(diff)}\n}`
}

export default stylish
