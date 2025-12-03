import { fileURLToPath } from 'url'
import path from 'path'
import { test, expect } from '@jest/globals'
import genDiff from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = filename => path.join(__dirname, '..', '__fixtures__', filename)

// JSON
test('flat JSON files comparison', () => {
  const file1 = getFixturePath('file1.json')
  const file2 = getFixturePath('file2.json')

  const result = genDiff(file1, file2)
  expect(result).toContain('host: hexlet.io')
  expect(result).toContain('- timeout: 50')
  expect(result).toContain('+ timeout: 20')
  expect(result).toContain('+ verbose: true')
  expect(result).toContain('- proxy: 123.234.53.22')
  expect(result).toContain('- follow: false')
})

// YAML
test('flat YAML files comparison', () => {
  const file1 = getFixturePath('file1.yml')
  const file2 = getFixturePath('file2.yml')

  const result = genDiff(file1, file2)
  expect(result).toContain('host: hexlet.io')
  expect(result).toContain('- timeout: 50')
  expect(result).toContain('+ timeout: 20')
  expect(result).toContain('+ verbose: true')
  expect(result).toContain('- proxy: 123.234.53.22')
  expect(result).toContain('- follow: false')
})

// Тест на идентичность результата для JSON и YAML
test('JSON and YAML files produce identical diff', () => {
  const json1 = getFixturePath('file1.json')
  const json2 = getFixturePath('file2.json')
  const yaml1 = getFixturePath('file1.yml')
  const yaml2 = getFixturePath('file2.yml')

  const jsonResult = genDiff(json1, json2)
  const yamlResult = genDiff(yaml1, yaml2)

  expect(yamlResult).toEqual(jsonResult)
})

// НОВЫЕ ТЕСТЫ ДЛЯ ВЛОЖЕННЫХ СТРУКТУР
test('nested JSON files comparison', () => {
  const file1 = getFixturePath('nested1.json')
  const file2 = getFixturePath('nested2.json')

  const result = genDiff(file1, file2)

  // Изменения из примера
  expect(result).toContain('+ follow: false')
  expect(result).toContain('- setting2: 200')
  expect(result).toContain('- setting3: true')
  expect(result).toContain('+ setting3: null')
  expect(result).toContain('+ setting4: blah blah')
  expect(result).toContain('+ setting5:')
  expect(result).toContain('key5: value5')
  expect(result).toContain('- wow:')
  expect(result).toContain('+ wow: so much')
  expect(result).toContain('- group2:')
  expect(result).toContain('+ group3:')
})

test('nested YAML files comparison', () => {
  const file1 = getFixturePath('nested1.yml')
  const file2 = getFixturePath('nested2.yml')

  const result = genDiff(file1, file2)

  // Те же проверки что и для JSON
  expect(result).toContain('+ follow: false')
  expect(result).toContain('- setting2: 200')
  expect(result).toContain('- setting3: true')
  expect(result).toContain('+ setting3: null')
  expect(result).toContain('+ setting4: blah blah')
})

test('nested JSON and YAML produce same structure', () => {
  const json1 = getFixturePath('nested1.json')
  const json2 = getFixturePath('nested2.json')
  const yaml1 = getFixturePath('nested1.yml')
  const yaml2 = getFixturePath('nested2.yml')

  const jsonResult = genDiff(json1, json2)
  const yamlResult = genDiff(yaml1, yaml2)

  // Очищаем значения чтобы сравнить только структуру
  const clean = str => str.replace(/\d+/g, 'X').replace(/".*?"/g, '"X"')
  expect(clean(jsonResult)).toEqual(clean(yamlResult))
})

// НОВЫЕ ТЕСТЫ ДЛЯ PLAIN ФОРМАТА
test('plain format for flat files', () => {
  const file1 = getFixturePath('file1.json')
  const file2 = getFixturePath('file2.json')
  const result = genDiff(file1, file2, 'plain')

  expect(result).toContain('Property \'follow\' was removed')
  expect(result).toContain('Property \'proxy\' was removed')
  expect(result).toContain('Property \'timeout\' was updated. From 50 to 20')
  expect(result).toContain('Property \'verbose\' was added with value: true')
})

test('plain format for nested files', () => {
  const file1 = getFixturePath('nested1.json')
  const file2 = getFixturePath('nested2.json')
  const result = genDiff(file1, file2, 'plain')

  expect(result).toContain('Property \'common.follow\' was added with value: false')
  expect(result).toContain('Property \'common.setting2\' was removed')
  expect(result).toContain('Property \'common.setting3\' was updated. From true to null')
  expect(result).toContain('Property \'common.setting4\' was added with value: \'blah blah\'')
  expect(result).toContain('Property \'common.setting5\' was added with value: [complex value]')
  expect(result).toContain('Property \'common.setting6.doge.wow\' was updated. From \'\' to \'so much\'')
  expect(result).toContain('Property \'common.setting6.ops\' was added with value: \'vops\'')
  expect(result).toContain('Property \'group1.baz\' was updated. From \'bas\' to \'bars\'')
  expect(result).toContain('Property \'group1.nest\' was updated. From [complex value] to \'str\'')
  expect(result).toContain('Property \'group2\' was removed')
  expect(result).toContain('Property \'group3\' was added with value: [complex value]')
})

test('plain format works with YAML files', () => {
  const file1 = getFixturePath('nested1.yml')
  const file2 = getFixturePath('nested2.yml')
  const result = genDiff(file1, file2, 'plain')

  expect(result).toContain('Property \'common.follow\' was added with value: false')
  expect(result).toContain('Property \'common.setting2\' was removed')
  expect(result).toContain('Property \'common.setting3\' was updated. From true to null')
})

// Тесты для JSON формата
test('json format returns valid JSON', () => {
  const file1 = getFixturePath('file1.json')
  const file2 = getFixturePath('file2.json')
  const result = genDiff(file1, file2, 'json')

  // Проверяем что это валидный JSON
  expect(() => JSON.parse(result)).not.toThrow()

  const parsed = JSON.parse(result)
  expect(Array.isArray(parsed)).toBe(true)
})

test('json format contains diff structure', () => {
  const file1 = getFixturePath('nested1.json')
  const file2 = getFixturePath('nested2.json')
  const result = genDiff(file1, file2, 'json')

  const parsed = JSON.parse(result)

  // Проверяем наличие ключевых узлов
  const hasCommon = parsed.some(node => node.key === 'common')
  const hasGroup1 = parsed.some(node => node.key === 'group1')

  expect(hasCommon).toBe(true)
  expect(hasGroup1).toBe(true)
})

test('json format preserves all node types', () => {
  const file1 = getFixturePath('file1.json')
  const file2 = getFixturePath('file2.json')
  const result = genDiff(file1, file2, 'json')

  const parsed = JSON.parse(result)

  // Должны быть все типы узлов
  const types = parsed.map(node => node.type)
  expect(types).toContain('removed')
  expect(types).toContain('added')
  expect(types).toContain('unchanged')
})

test('json format works with YAML files', () => {
  const file1 = getFixturePath('nested1.yml')
  const file2 = getFixturePath('nested2.yml')
  const result = genDiff(file1, file2, 'json')

  // Проверяем что это валидный JSON
  expect(() => JSON.parse(result)).not.toThrow()

  const parsed = JSON.parse(result)
  expect(Array.isArray(parsed)).toBe(true)
})

test('json format identical for JSON and YAML inputs', () => {
  const json1 = getFixturePath('nested1.json')
  const json2 = getFixturePath('nested2.json')
  const yaml1 = getFixturePath('nested1.yml')
  const yaml2 = getFixturePath('nested2.yml')

  const jsonResult = genDiff(json1, json2, 'json')
  const yamlResult = genDiff(yaml1, yaml2, 'json')

  expect(JSON.parse(jsonResult)).toEqual(JSON.parse(yamlResult))
})
