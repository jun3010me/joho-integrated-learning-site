import './style.css'
import { App } from './components/App.js'

// ローディング画面を非表示にして、アプリを初期化
document.addEventListener('DOMContentLoaded', () => {
  const app = new App()
  app.init()
  
  // ローディング画面をフェードアウト
  setTimeout(() => {
    const loading = document.getElementById('loading')
    if (loading) {
      loading.style.opacity = '0'
      loading.style.transition = 'opacity 0.5s ease-out'
      setTimeout(() => {
        loading.style.display = 'none'
      }, 500)
    }
  }, 1000)
})
