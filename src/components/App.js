import { Navigation } from './Navigation.js'
import { BinarySimulator } from '../simulators/binary/BinarySimulator.js'
import { ColorSimulator } from '../simulators/color/ColorSimulator.js'
import { CompressionTool } from '../simulators/compression/CompressionTool.js'
import { LogicLearning } from '../simulators/logic/LogicLearning.js'
import { ImageDigitization } from '../simulators/image/ImageDigitization.js'
import { CircuitSimulator } from '../simulators/circuit/CircuitSimulator.js'

export class App {
  constructor() {
    this.currentSimulator = null
    this.simulators = {
      binary: null,
      color: null,
      compression: null,
      logic: null,
      image: null,
      circuit: null
    }
    this.currentPage = 'home'
  }

  init() {
    console.log('🏗️ App.init() 開始 - レイアウト作成中...')
    this.createLayout()
    console.log('✅ レイアウト作成完了')
    
    console.log('🧭 ナビゲーション設定中...')
    this.setupNavigation()
    console.log('✅ ナビゲーション設定完了')
    
    console.log('🏠 ホームページ表示中...')
    this.showHomePage()
    console.log('✅ App.init() 完了')
  }

  createLayout() {
    const app = document.getElementById('app')
    
    app.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <h1 class="text-xl font-bold text-gray-900">📚 情報Ⅰ統合学習サイト</h1>
                </div>
              </div>
              <nav id="main-navigation" class="hidden md:flex space-x-1">
                <!-- ナビゲーションはここに動的に挿入される -->
              </nav>
              <button id="mobile-menu-button" class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Mobile menu -->
          <div id="mobile-menu" class="hidden md:hidden">
            <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <!-- モバイルナビゲーションはここに動的に挿入される -->
            </div>
          </div>
        </header>

        <!-- Main content -->
        <main id="main-content" class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <!-- コンテンツエリア -->
        </main>

        <!-- Footer -->
        <footer class="bg-white border-t border-gray-200 mt-12">
          <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div class="text-center text-gray-600">
              <p>&copy; 2024 情報Ⅰ統合学習サイト. 高校情報科学実践学習プラットフォーム</p>
              <p class="mt-2 text-sm">GitHub Pagesで公開 | Vite + Tailwind CSS製</p>
            </div>
          </div>
        </footer>
      </div>
    `

    // モバイルメニューの toggle 機能
    const mobileMenuButton = document.getElementById('mobile-menu-button')
    const mobileMenu = document.getElementById('mobile-menu')
    
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden')
    })
  }

  setupNavigation() {
    this.navigation = new Navigation()
    this.navigation.init()
    
    // ナビゲーションイベントリスナー
    document.addEventListener('navigate', (event) => {
      this.navigateTo(event.detail.page)
    })
  }

  navigateTo(page) {
    this.currentPage = page
    
    // 現在のシミュレータをクリーンアップ
    if (this.currentSimulator && this.currentSimulator.cleanup) {
      this.currentSimulator.cleanup()
    }

    const mainContent = document.getElementById('main-content')
    
    switch(page) {
      case 'home':
        this.showHomePage()
        break
      case 'binary':
        this.showBinarySimulator()
        break
      case 'color':
        this.showColorSimulator()
        break
      case 'compression':
        this.showCompressionTool()
        break
      case 'logic':
        this.showLogicLearning()
        break
      case 'image':
        this.showImageDigitization()
        break
      case 'circuit':
        this.showCircuitSimulator()
        break
      default:
        this.showHomePage()
    }

    // モバイルメニューを閉じる
    document.getElementById('mobile-menu').classList.add('hidden')
    
    // ページトップにスクロール
    window.scrollTo(0, 0)
  }

  showHomePage() {
    const mainContent = document.getElementById('main-content')
    
    mainContent.innerHTML = `
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          🎓 情報Ⅰ統合学習サイト
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          高校情報科学の基礎を実践的に学習できる統合プラットフォーム
        </p>
        <div class="max-w-3xl mx-auto">
          <p class="text-gray-700 leading-relaxed">
            数値変換から論理回路まで、情報Ⅰで学ぶ重要な概念を
            インタラクティブなシミュレータで体験しながら理解を深めましょう。
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        ${this.createSimulatorCard('binary', '🔢', '数値変換シミュレータ', '2進数・10進数・16進数の相互変換とビット演算を学習')}
        ${this.createSimulatorCard('color', '🎨', 'カラーシミュレータ', 'RGB・CMYK変換と色深度、24ビットカラーの仕組みを理解')}
        ${this.createSimulatorCard('compression', '🗜️', 'データ圧縮ツール', 'ランレングス符号化とハフマン符号化の実践学習')}
        ${this.createSimulatorCard('logic', '⚡', '論理回路学習', '論理式・真理値表・回路図の総合的な学習環境')}
        ${this.createSimulatorCard('image', '🖼️', '画像デジタル化', '解像度・色深度・ファイルサイズの関係を視覚的に学習')}
        ${this.createSimulatorCard('circuit', '🔧', '回路シミュレータ', 'ドラッグ&ドロップで自由に論理回路を設計・テスト')}
      </div>

      <div class="bg-blue-50 rounded-xl p-8 text-center">
        <h2 class="text-2xl font-bold text-blue-900 mb-4">🌟 特徴</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-800">
          <div>
            <div class="text-3xl mb-2">📱</div>
            <h3 class="font-semibold mb-2">レスポンシブ対応</h3>
            <p class="text-sm">スマートフォンからデスクトップまで最適な表示</p>
          </div>
          <div>
            <div class="text-3xl mb-2">⚡</div>
            <h3 class="font-semibold mb-2">高速動作</h3>
            <p class="text-sm">Vite + Vanilla JavaScript で軽量・高速</p>
          </div>
          <div>
            <div class="text-3xl mb-2">🎯</div>
            <h3 class="font-semibold mb-2">実践的学習</h3>
            <p class="text-sm">理論と実践を結び付けた体験型学習</p>
          </div>
        </div>
      </div>
    `

    // シミュレータカードのクリックイベント
    document.querySelectorAll('[data-simulator]').forEach(card => {
      card.addEventListener('click', () => {
        const simulator = card.dataset.simulator
        this.navigateTo(simulator)
      })
    })
  }

  createSimulatorCard(id, icon, title, description) {
    return `
      <div data-simulator="${id}" class="card hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1">
        <div class="text-center">
          <div class="text-4xl mb-4">${icon}</div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">${title}</h3>
          <p class="text-gray-600 text-sm">${description}</p>
        </div>
      </div>
    `
  }

  showBinarySimulator() {
    if (!this.simulators.binary) {
      this.simulators.binary = new BinarySimulator()
    }
    this.currentSimulator = this.simulators.binary
    this.simulators.binary.render(document.getElementById('main-content'))
  }

  showColorSimulator() {
    if (!this.simulators.color) {
      this.simulators.color = new ColorSimulator()
    }
    this.currentSimulator = this.simulators.color
    this.simulators.color.render(document.getElementById('main-content'))
  }

  showCompressionTool() {
    if (!this.simulators.compression) {
      this.simulators.compression = new CompressionTool()
    }
    this.currentSimulator = this.simulators.compression
    this.simulators.compression.render(document.getElementById('main-content'))
  }

  showLogicLearning() {
    if (!this.simulators.logic) {
      this.simulators.logic = new LogicLearning()
    }
    this.currentSimulator = this.simulators.logic
    this.simulators.logic.render(document.getElementById('main-content'))
  }

  showImageDigitization() {
    if (!this.simulators.image) {
      this.simulators.image = new ImageDigitization()
    }
    this.currentSimulator = this.simulators.image
    this.simulators.image.render(document.getElementById('main-content'))
  }

  showCircuitSimulator() {
    if (!this.simulators.circuit) {
      this.simulators.circuit = new CircuitSimulator()
    }
    this.currentSimulator = this.simulators.circuit
    this.simulators.circuit.render(document.getElementById('main-content'))
  }
}