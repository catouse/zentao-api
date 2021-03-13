module.exports = {
    // see https://jestjs.io/docs/en/configuration.html#testenvironment-string
    // and see https://github.com/axios/axios/issues/1754
    testEnvironment: 'node',

    transform: {
        '.(ts|tsx)$': require.resolve('ts-jest/dist'),
        '.(js|jsx)$': require.resolve('babel-jest'), // jest's default
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
    testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}'],
    testURL: 'http://localhost',
    watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
    ],
};
