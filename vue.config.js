/*
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-03-19 14:38:22
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-03-29 23:03:21
 * @FilePath: \网页端\web_app\vue.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  
  // 开发服务器配置
  devServer: {
    host: 'localhost',
    port: 8081,
    // 添加historyApiFallback处理SPA刷新
    historyApiFallback: {
      rewrites: [
        // 处理AI助手路径的刷新
        { from: /^\/ai-assistant/, to: '/index.html' },
        // 其他路径都重定向到index.html
        { from: /./, to: '/index.html' }
      ]
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端服务地址
        changeOrigin: true, // 允许跨域
        // pathRewrite已禁用，因为后端已经有/api前缀
        // pathRewrite: {
        //   '^/api': '' // 如果后端已经有/api前缀，则移除前端的/api
        // },
        logLevel: 'debug' // 启用详细日志
      }
    }
  }
})
