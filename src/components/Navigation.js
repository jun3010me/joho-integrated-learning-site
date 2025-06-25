export class Navigation {
  constructor() {
    this.currentPage = 'home'
    this.navItems = [
      { id: 'binary', label: '数値変換', icon: '🔢' },
      { id: 'color', label: 'カラー', icon: '🎨' },
      { id: 'compression', label: 'データ圧縮', icon: '🗜️' },
      { id: 'logic', label: '論理回路', icon: '⚡' },
      { id: 'image', label: '画像処理', icon: '🖼️' },
      { id: 'circuit', label: '回路設計', icon: '🔧' }
    ]
  }

  init() {
    this.renderNavigation()
    this.setupEventListeners()
  }

  renderNavigation() {
    const desktopNav = document.getElementById('main-navigation')
    const mobileNav = document.querySelector('#mobile-menu .space-y-1')
    
    // デスクトップナビゲーション
    desktopNav.innerHTML = this.navItems.map(item => `
      <button 
        data-page="${item.id}" 
        class="nav-item flex items-center space-x-2"
        title="${item.label}"
      >
        <span class="text-lg">${item.icon}</span>
        <span class="hidden lg:inline">${item.label}</span>
      </button>
    `).join('')

    // モバイルナビゲーション
    mobileNav.innerHTML = this.navItems.map(item => `
      <button 
        data-page="${item.id}" 
        class="nav-item w-full text-left flex items-center space-x-3 px-3 py-2"
      >
        <span class="text-lg">${item.icon}</span>
        <span>${item.label}</span>
      </button>
    `).join('')
  }

  setupEventListeners() {
    // デスクトップとモバイル両方のナビゲーションにイベントリスナーを追加
    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-page]')) {
        const button = event.target.closest('[data-page]')
        const page = button.dataset.page
        this.navigateTo(page)
      }
    })
  }

  navigateTo(page) {
    // 前のアクティブボタンを非アクティブに
    document.querySelectorAll('[data-page]').forEach(btn => {
      btn.classList.remove('active')
    })

    // 新しいアクティブボタンを設定
    document.querySelectorAll(`[data-page="${page}"]`).forEach(btn => {
      btn.classList.add('active')
    })

    this.currentPage = page

    // カスタムイベントを発火してAppクラスに通知
    document.dispatchEvent(new CustomEvent('navigate', {
      detail: { page }
    }))
  }

  updateActiveState(page) {
    this.currentPage = page
    
    // すべてのナビゲーションボタンのアクティブ状態を更新
    document.querySelectorAll('[data-page]').forEach(btn => {
      if (btn.dataset.page === page) {
        btn.classList.add('active')
      } else {
        btn.classList.remove('active')
      }
    })
  }
}