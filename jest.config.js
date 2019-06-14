module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFilesAfterEnv: ['./tests/jest.setup.ts'],
	globals: {
		'ts-jest': {
			diagnostics: false
		}
	}
};
