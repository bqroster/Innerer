module.exports = {
    verbose: true,
    roots: [
        "<rootDir>/test"
    ],
    "moduleFileExtensions": [
        "js",
        "json"
    ],
    "transform": {
        "^.+\\.js$": "babel-jest"
    },
    "moduleDirectories": ["node_modules"],
    "moduleNameMapper": {
        "^~(.*)$": "<rootDir>/src/$1",
    }
};