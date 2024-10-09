import path from 'path'; // Use ES6 import

export default {
    entry: './src/index.js', // Your entry point
    output: {
        filename: 'pn-library.js', // The output file name
        path: path.resolve('dist'), // Output directory (no __dirname needed in ES6)
        library: {
            name: 'PN', // The name of the global variable (this can be any name you choose)
            type: 'umd', // Universal Module Definition (UMD)
        },
    },
    mode: 'development', // Set to 'production' for production builds
    module: {
        rules: [
            {
                test: /\.js$/, // Transpile JavaScript files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Use Babel to transpile modern JavaScript
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js'], // Resolve JavaScript files by default
    },
};