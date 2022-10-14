/** @type {import('ts-jest').JestConfigWithTsJest} */
const { compilerOptions } = require('./tsconfig');
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths , { prefix: '<rootDir>/src' }),
};