import { fileURLToPath } from 'url'
import path from 'path'
import { test, expect } from '@jest/globals'
import genDiff from '../gendiff.js'

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
