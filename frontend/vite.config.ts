import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 環境変数を読み込み
  const env = loadEnv(mode, process.cwd(), '')
  
  // 環境に応じたデフォルト値を設定
  const getApiUrl = () => {
    if (env.VITE_API_URL) return env.VITE_API_URL
    if (mode === 'production') return 'https://cayq00p1jc.execute-api.ap-northeast-1.amazonaws.com'
    return 'http://localhost:8080'
  }

  const getAppName = () => {
    if (env.VITE_APP_NAME) return env.VITE_APP_NAME
    if (mode === 'production') return '泰鵬支店'
    return '泰鵬支店（開発）'
  }

  const apiUrl = getApiUrl()
  
  console.log(`🚀 モード: ${mode}`)
  console.log(`🔗 API URL: ${apiUrl}`)
  console.log(`📱 アプリ名: ${getAppName()}`)
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version),
      __APP_NAME__: JSON.stringify(getAppName()),
      __API_URL__: JSON.stringify(apiUrl),
      __BUILD_MODE__: JSON.stringify(mode)
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development'
    }
  }
}) 