const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, // Ensure that dependencies are transpiled
  chainWebpack: (config) => {
    config.resolve.extensions
      .add('.ts') // Add '.ts' as a resolvable extension
      .end();

    config.module
      .rule('ts')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        appendTsSuffixTo: [/\.vue$/], // Append .ts file extension to .vue files
      })
      .end();
    
    config.entry('app')
      .clear()
      .add('./src/main.ts') // Specify the entry point as main.ts
      .end();
  },
});