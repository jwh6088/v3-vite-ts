import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// @type/node依赖
const pathResolve = (dir: string) => resolve(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  server: {
    host: "0.0.0.0", // 从IP启动
    open: true, // 自动打开浏览器
    cors: true, // 允许跨域
    // http-proxy代理,本地服务调试
    proxy: {}
  },
  resolve: {
    // 指定解析路径
    alias: {
      '@': pathResolve('./src'),  // 设置 `@` 指向 `src` 目录，下同
      views: pathResolve('./src/views'),
      components: pathResolve('./src/components'),
      assets: pathResolve('./src/assets'),
    },
  },
  // 打包配置
  build: {
    outDir: 'dist',   // 指定打包路径，默认为项目根目录下的 dist 目录
    terserOptions: {
      compress: {
        keep_infinity: true,  // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
        drop_console: true,   // 生产环境去除 console
        drop_debugger: true   // 生产环境去除 debugger
      },
    },
    chunkSizeWarningLimit: 1500   // chunk 大小警告的限制（以 kbs 为单位）
  }
})
