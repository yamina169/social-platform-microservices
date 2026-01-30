// jest.config.ts
import type { Config } from 'jest';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Charger le .env avant que Jest exécute les tests
dotenv.config({ path: path.resolve(__dirname, '.env') });

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src', // ton code source
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  collectCoverage: true,
  coverageDirectory: '../coverage',
};

export default config;
