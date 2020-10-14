module.exports = {
  runtimeCompiler: true,
  publicPath: './', 
  devServer: {
    // open: process.platform === 'darwin',
    // host: 'localhost',
    port: 8080,
    // open: true, 
    proxy: {
      '/api': {
        target: 'http://ec2-3-15-39-162.us-east-2.compute.amazonaws.com:3000/api/', 
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },      
    }
  },
}
