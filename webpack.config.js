const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UnusedFilesWebpackPlugin = require("unused-files-webpack-plugin").UnusedFilesWebpackPlugin;
const webpack = require('webpack');

let isProd = (process.env.NODE_ENV === 'production');

function getPlugins() {
    let plugins = [];

    // Always expose NODE_ENV to webpack, you can now use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': process.env.NODE_ENV
            }
        })
    );

    plugins.push(new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/));

    plugins.push(
        new HtmlWebpackPlugin({
            filename: 'admin/index.html',
            favicon: 'favicon.ico',
            template: 'admin/template.html',
            title: 'HICMR Admin',
            siteId: 'ADMIN',
            description: 'HICMR Admin Site',
            author: 'inoutput',
            keyword: 'Infection Control Management',
            chunks: ['main', 'admin', 'vendor'],
        })
    );
    plugins.push(
        new HtmlWebpackPlugin({
            filename: 'consultant/index.html',
            favicon: 'favicon.consultant.ico',
            template: 'consultant/template.html',
            title: 'HICMR Consultant',
            siteId: 'CONSULTANT',
            description: 'HICMR Consultant Site',
            author: 'inoutput',
            keyword: 'Infection Control Management',
            chunks: ['main', 'consultant', 'vendor'],
        })
    );
    plugins.push(
        new HtmlWebpackPlugin({
            filename: 'index.html',
            favicon: 'favicon.consultant.ico',
            template: 'landing/template.html',
            title: 'HICMR',
            appName: 'HARP 2.0',
            siteId: 'PUBLIC',
            description: 'HICMR Site',
            author: 'inoutput',
            keyword: 'Infection Control Management',
            chunks: ['main', 'vendor'],
        })
    );
    plugins.push(
        new UnusedFilesWebpackPlugin({
            pattern: "src/**/*.*",
            globOptions: {
                ignore: [
                    "src/vendor/**/*"
                ]
            }
        })
    );
    plugins.push(
        new ExtractTextPlugin({
            filename: "styles.css",
            disable: false,
            allChunks: true
        })
    );
    plugins.push(
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        })
    );
    plugins.push(
        new CopyWebpackPlugin([
            {
                // This is copied because SCEditor loads it from an iframe so it can't be packed
                from: path.resolve(__dirname, 'src/vendor/sceditor/jquery.sceditor.default.css'),
                to: 'admin/jquery.sceditor.default.css'
            },
            {
                // This is for the ace editor lazy loading
                from: path.resolve(__dirname, 'src/vendor/ace/worker-json.js'),
                to: 'admin/worker-json.js'
            },
            {
                from: path.resolve(__dirname, 'favicon.ico'),
                to: 'admin/favicon.ico'
            },
            {
                from: path.resolve(__dirname, 'favicon.consultant.ico'),
                to: 'consultant/favicon.consultant.ico'
            }
        ])
    );
    plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            names: ['main', 'vendor'],
            filename: '[name].bundle.js',
            minChunks: Infinity,
        })
    );
    if (isProd) {
        // TODO - Need to uncomment at some stage and resolve the issue with the build
        // Failing with jquery - investigate
        // plugins.push(
        //     new webpack.optimize.UglifyJsPlugin({
        //         compress: {
        //             warnings: false
        //         }
        //     })
        // );
    }
    else {
    // ...
    }

    return plugins;
}

module.exports = {
    entry: {
        main: ['main'],
        admin: './admin/main.js',
        consultant: './consultant/main.js',
        vendor: [
            'jquery',
            'tether',
            'vuejs',
            'vue-router',
            'bootstrap4',
            'bootstrap-theme',
            'handlebars',
            'moment',
            'json-editor',
            'ace',
            'sceditor',
            'datatables',
            'sugar',
            'keypath'
        ],
    },
    devtool: "source-map",
    output: {
        filename: '[name]/bundle.js',
        path: path.resolve(__dirname, 'dist_build')
    },resolve: {
        alias: {
            jquery: path.resolve(__dirname, 'src/vendor/jquery/jquery.min.js'),
            tether: path.resolve(__dirname, 'src/vendor/bootstrap/tether.min.js'),
            bootstrap4: path.resolve(__dirname, 'src/vendor/bootstrap-index.js'),
            bootstrap: path.resolve(__dirname, 'src/vendor/bootstrap'),
            keypath: path.resolve(__dirname, 'src/vendor/keypath/keypath.js'),
            'bootstrap-theme': path.resolve(__dirname, 'src/vendor/bootstrap-theme-index.js'),
            sceditor: path.resolve(__dirname, 'src/vendor/sceditor-index.js'),
            vuejs: path.resolve(__dirname, 'src/vendor/vuejs/vue.js'),
            'vue-router': path.resolve(__dirname, 'src/vendor/vue-router/vue-router.js'),
            ace: path.resolve(__dirname, "src/vendor/ace-index.js"),
            'worker-json.js': path.resolve(__dirname, "src/vendor/ace/worker-json.js"),
            moment: path.resolve(__dirname, 'src/vendor/moment/momentwithlocales.js'),
            'json-editor': path.resolve(__dirname, 'src/vendor/json-editor-index.js'),
            datatables: path.resolve(__dirname, 'src/vendor/datatables-index.js'),
            'datatables.net-bs4': path.resolve(__dirname, 'node_modules/datatables.net-bs'),
            'bootstrap-datepicker': path.resolve(__dirname, 'node_modules/bootstrap-datepicker'),
            sugar: path.resolve(__dirname, 'src/vendor/sugar/sugar-custom.js'),
            handlebars: path.resolve(__dirname, 'node_modules/handlebars/dist/handlebars.min.js'),

            main: path.resolve(__dirname, 'main.js'),
            app: path.resolve(__dirname, 'src/app'),
            components: path.resolve(__dirname, 'src/ui/components'),
            "api": path.resolve(__dirname, 'src/classes/api'),
            "ui": path.resolve(__dirname, 'src/ui/ui.js'),
            "logger": path.resolve(__dirname, 'src/classes/logger'),
            "local_storage_with_site_info": path.resolve(__dirname, 'src/classes/local_storage_with_site_info'),
            "models": path.resolve(__dirname, 'src/models'),
            "repositories": path.resolve(__dirname, 'src/classes/repositories'),
            "json_editor": path.resolve(__dirname, 'src/ui/components/editor'),
        },
        unsafeCache: true
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)?$/,
                enforce: "pre",
                use:
                {
                    loader: "eslint-loader",
                    options: {
                        configFile: path.resolve(__dirname, ".eslintrc"),
                        failOnError: true,
                        semi: 2,
                        cache: true
                    }
                },
                exclude: [
                    path.resolve(__dirname, "node_modules/"), path.resolve(__dirname, "src/vendor/")
                ],
            },
            {
                test: /\.html$/,
                include: [
                    path.join(__dirname, "src/ui")
                ],
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.hbs$/,
                use: 'raw-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            { test: /\.(eot|woff|woff2|svg|ttf|handlebars)([?]?.*)$/, use: "file-loader" },

            { test: /\.vue$/, use: "vue-loader"  },
            { test: /\.json$/, use: "json-loader" },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    "file-loader?hash=sha512&digest=hex&name=[hash].[ext]",
                    "image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false",
                ],
            },
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, "src/vendor/jquery")],
                loader: "expose-loader?$!expose-loader?jQuery",
            },
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, "src/vendor/json-editor/jsoneditor.js")],
                loader: "expose-loader?jsonEditor",
            },
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, 'src/vendor/moment/momentwithlocales.js')],
                loader: 'expose-loader?moment',

            },
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, "src/vendor/bootstrap")],
                loader: "expose-loader?Tether",
            },
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, "src/vendor/vuejs/vue.js")],
                loader: "expose-loader?Vue",
            },
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, "src/vendor/vue-router")],
                loader: "expose-loader?VueRouter",
            },
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, "src/vendor/bootstrap/theme/js/libs/toastr.js")],
                loader: "expose-loader?toastr",
            },
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, "src/vendor/sugar/sugar-custom.js")],
                loader: "expose-loader?Sugar",
            },
            {
                test: /datatables\.net.*/,
                loader: "imports-loader?define=>false",
            },
            {
                loader: "babel-loader",

                // Skip any files outside of your project's `src` directory
                include: [
                    path.resolve(__dirname, "main.js"),
                    path.join(__dirname, "src/models"),
                    path.join(__dirname, "src/classes"),
                    path.join(__dirname, "src/ui"),
                    path.join(__dirname, "src/app"),
                    path.join(__dirname, "src/routes"),
                ],

                // Only run `.js` and `.jsx` files through Babel
                test: /\.js?$/,

                // Options to configure babel with
                query: {
                    presets: ["es2015"],
                },
            },
        ]
    },

    watchOptions: {
        poll: 300,
    },
    plugins: getPlugins()
};
