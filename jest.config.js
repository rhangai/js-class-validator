// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	clearMocks: true,
	coverageDirectory: './coverage',
	rootDir: './',
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	setupFiles: ['./test/setup.ts'],
	collectCoverage: true,
	collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
	testMatch: ['<rootDir>/test/**/*.test.ts'],
};
