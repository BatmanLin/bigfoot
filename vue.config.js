module.exports = {
  runtimeCompiler: true,
  publicPath: '/', 
  devServer: {
    // open: process.platform === 'darwin',
    // host: 'localhost',
    port: 8080,
    // open: true, 
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/api/', 
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },      
      '/libs': {
        target: 'http://crg.wiseom.cn/libs/',
        changeOrigin: true,
        pathRewrite: {
          '^/libs': ''
        }
      }
    }
  },
}