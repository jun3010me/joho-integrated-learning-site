import './style.css'
import { App } from './components/App.js'

// ローディング画面を非表示にして、アプリを初期化
function initializeApp() {
  console.log('🚀 initializeApp() が開始されました')
  
  try {
    console.log('📦 App クラスをインポート中...')
    const app = new App()
    console.log('✅ App インスタンスが作成されました')
    
    console.log('⚙️ App.init() を呼び出し中...')
    app.init()
    console.log('✅ App.init() が完了しました')
    
    // ローディング画面をフェードアウト
    console.log('🎭 ローディング画面をフェードアウト中...')
    setTimeout(() => {
      const loading = document.getElementById('loading')
      if (loading) {
        console.log('✅ ローディング画面が見つかりました、フェードアウト開始')
        loading.style.opacity = '0'
        loading.style.transition = 'opacity 0.5s ease-out'
        setTimeout(() => {
          loading.style.display = 'none'
          console.log('✅ ローディング画面が完全に非表示になりました')
        }, 500)
      } else {
        console.warn('⚠️ ローディング画面が見つかりませんでした')
      }
    }, 1000)
  } catch (error) {
    console.error('❌ アプリケーションの初期化に失敗しました:', error)
    console.error('❌ エラーの詳細:', error.stack)
    
    // エラーが発生した場合でもローディング画面を非表示にする
    const loading = document.getElementById('loading')
    if (loading) {
      loading.innerHTML = `
        <div class="text-center">
          <div class="text-6xl mb-4">⚠️</div>
          <p class="text-red-600 font-semibold">アプリケーションの読み込みに失敗しました</p>
          <p class="text-gray-600 text-sm mt-2">ページを再読み込みしてください</p>
          <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            再読み込み
          </button>
        </div>
      `
    }
  }
}

// DOMの準備ができているかチェック
console.log('🔍 DOM readyState:', document.readyState)

if (document.readyState === 'loading') {
  // DOM が完全に読み込まれていない場合
  console.log('⏳ DOMContentLoaded イベントを待機中...')
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOMContentLoaded イベントが発生しました')
    initializeApp()
  })
} else {
  // DOM が既に読み込まれている場合
  console.log('✅ DOM は既に読み込まれています、すぐに初期化します')
  initializeApp()
}
