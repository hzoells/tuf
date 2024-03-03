import { pathsToModuleNameMapper, JestConfigWithTsJest} from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  clearMocks: true,
  coverageProvider: "v8",
  silent: false,

  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {},
  transform:  {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
};

export default config;
