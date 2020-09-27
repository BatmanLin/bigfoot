module.exports = {
  runtimeCompiler: true,
  publicPath: '/', // 设置打包文件相对路径
  devServer: {
    // open: process.platform === 'darwin',
    // host: 'localhost',
    port: 8080,
    // open: true, //配置自动启动浏览器
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