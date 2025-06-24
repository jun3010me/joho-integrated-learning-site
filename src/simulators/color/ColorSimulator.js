export class ColorSimulator {
  constructor() {
    this.rgbValues = { r: 255, g: 0, b: 0 }
    this.cmykValues = { c: 0, m: 100, y: 100, k: 0 }
    this.currentMode = 'rgb'
    this.bitDepth = 8
    this.presetColors = [
      { name: '赤', rgb: { r: 255, g: 0, b: 0 } },
      { name: '緑', rgb: { r: 0, g: 255, b: 0 } },
      { name: '青', rgb: { r: 0, g: 0, b: 255 } },
      { name: '黄', rgb: { r: 255, g: 255, b: 0 } },
      { name: 'マゼンタ', rgb: { r: 255, g: 0, b: 255 } },
      { name: 'シアン', rgb: { r: 0, g: 255, b: 255 } },
      { name: '白', rgb: { r: 255, g: 255, b: 255 } },
      { name: '黒', rgb: { r: 0, g: 0, b: 0 } }
    ]
  }

  render(container) {
    container.innerHTML = `
      <div class="simulator-container">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">🎨 24ビットフルカラーシミュレータ</h1>
          <p class="text-gray-600">RGB・CMYK変換と色深度、24ビットカラーの仕組みを理解しましょう</p>
        </div>

        <!-- モード切り替え -->
        <div class="card mb-8">
          <div class="flex justify-center space-x-4 mb-6">
            <button id="rgb-mode" class="btn-primary">RGB</button>
            <button id="cmyk-mode" class="btn-secondary">CMYK</button>
          </div>

          <!-- RGB調整 -->
          <div id="rgb-controls" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-red-700">赤 (R)</label>
              <input type="range" id="red-slider" min="0" max="255" value="255" 
                     class="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer">
              <div class="text-center text-sm font-mono text-red-600" id="red-value">255</div>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-green-700">緑 (G)</label>
              <input type="range" id="green-slider" min="0" max="255" value="0" 
                     class="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer">
              <div class="text-center text-sm font-mono text-green-600" id="green-value">0</div>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-blue-700">青 (B)</label>
              <input type="range" id="blue-slider" min="0" max="255" value="0" 
                     class="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer">
              <div class="text-center text-sm font-mono text-blue-600" id="blue-value">0</div>
            </div>
          </div>

          <!-- CMYK調整 -->
          <div id="cmyk-controls" class="hidden grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-cyan-700">シアン (C)</label>
              <input type="range" id="cyan-slider" min="0" max="100" value="0" 
                     class="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer">
              <div class="text-center text-sm font-mono text-cyan-600" id="cyan-value">0%</div>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-pink-700">マゼンタ (M)</label>
              <input type="range" id="magenta-slider" min="0" max="100" value="100" 
                     class="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer">
              <div class="text-center text-sm font-mono text-pink-600" id="magenta-value">100%</div>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-yellow-700">イエロー (Y)</label>
              <input type="range" id="yellow-slider" min="0" max="100" value="100" 
                     class="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer">
              <div class="text-center text-sm font-mono text-yellow-600" id="yellow-value">100%</div>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">キー (K)</label>
              <input type="range" id="key-slider" min="0" max="100" value="0" 
                     class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
              <div class="text-center text-sm font-mono text-gray-600" id="key-value">0%</div>
            </div>
          </div>

          <!-- カラーコード入力 -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">カラーコード入力</label>
            <div class="flex space-x-2">
              <input type="text" id="color-code" placeholder="#FF0000" 
                     class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button id="apply-color" class="btn-primary">適用</button>
            </div>
          </div>

          <!-- プリセットカラー -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">プリセットカラー</label>
            <div class="grid grid-cols-4 md:grid-cols-8 gap-2" id="preset-colors">
              <!-- プリセットカラーはJavaScriptで動的に生成 -->
            </div>
          </div>
        </div>

        <!-- 色表示エリア -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- 色プレビュー -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">色の表示</h3>
            <div id="color-preview" class="w-full h-48 rounded-lg border-4 border-gray-300 mb-4" 
                 style="background-color: rgb(255, 0, 0);"></div>
          </div>

          <!-- 色情報 -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">色情報</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">16進数:</span>
                <span id="hex-display" class="font-mono text-blue-600">#FF0000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">RGB値:</span>
                <span id="rgb-display" class="font-mono text-green-600">rgb(255, 0, 0)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">CMYK値:</span>
                <span id="cmyk-display" class="font-mono text-purple-600">cmyk(0%, 100%, 100%, 0%)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">2進数 (R):</span>
                <span id="binary-r" class="font-mono text-red-600">11111111</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">2進数 (G):</span>
                <span id="binary-g" class="font-mono text-green-600">00000000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">2進数 (B):</span>
                <span id="binary-b" class="font-mono text-blue-600">00000000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">総ビット数:</span>
                <span id="total-bits" class="font-mono text-purple-600">24ビット</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ビット深度調整 -->
        <div class="card mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">ビット深度調整</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">1色あたりのビット数</label>
              <input type="range" id="bit-depth" min="1" max="8" value="8" 
                     class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
              <div class="text-center text-sm font-mono text-blue-600" id="bit-depth-value">8ビット</div>
            </div>
            <div class="space-y-2">
              <div class="text-sm text-gray-600">
                <div>表現可能な色数: <span id="color-count" class="font-bold text-blue-600">16,777,216色</span></div>
                <div>1色あたりの階調数: <span id="level-count" class="font-bold text-green-600">256段階</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 色の階調表示 -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">色の階調表示</h3>
          <div id="gradation-bar" class="w-full h-12 rounded-lg border border-gray-300 mb-4"></div>
          <p class="text-sm text-gray-600" id="gradation-info">現在の色の階調を表示しています</p>
        </div>
      </div>
    `

    this.setupEventListeners()
    this.rgbToCmyk()
    this.updateDisplay()
  }

  setupEventListeners() {
    // タッチイベント改善ヘルパー関数
    const addSliderTouchSupport = (element) => {
      element.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: false })
      element.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: false })
      element.addEventListener('touchend', (e) => e.stopPropagation(), { passive: false })
    }

    // モード切り替え
    document.getElementById('rgb-mode').addEventListener('click', () => this.switchMode('rgb'))
    document.getElementById('cmyk-mode').addEventListener('click', () => this.switchMode('cmyk'))

    // RGB スライダー
    const rgbSliders = ['red-slider', 'green-slider', 'blue-slider']
    rgbSliders.forEach(id => {
      const slider = document.getElementById(id)
      addSliderTouchSupport(slider)
      slider.addEventListener('input', (e) => {
        const component = id.split('-')[0]
        this.rgbValues[component === 'red' ? 'r' : component === 'green' ? 'g' : 'b'] = parseInt(e.target.value)
        this.rgbToCmyk()
        this.updateDisplay()
      })
    })

    // CMYK スライダー
    const cmykSliders = ['cyan-slider', 'magenta-slider', 'yellow-slider', 'key-slider']
    cmykSliders.forEach(id => {
      const slider = document.getElementById(id)
      addSliderTouchSupport(slider)
      slider.addEventListener('input', (e) => {
        const component = id.split('-')[0]
        const key = component === 'cyan' ? 'c' : component === 'magenta' ? 'm' : 
                   component === 'yellow' ? 'y' : 'k'
        this.cmykValues[key] = parseInt(e.target.value)
        this.cmykToRgb()
        this.updateDisplay()
      })
    })

    // ビット深度調整
    const bitDepthSlider = document.getElementById('bit-depth')
    addSliderTouchSupport(bitDepthSlider)
    bitDepthSlider.addEventListener('input', (e) => {
      this.bitDepth = parseInt(e.target.value)
      this.updateDisplay()
    })

    // カラーコード適用
    document.getElementById('apply-color').addEventListener('click', () => this.applyColorCode())
    document.getElementById('color-code').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.applyColorCode()
    })

    // プリセットカラーの生成
    this.createPresetColors()
  }

  applyColorCode() {
    const colorCode = document.getElementById('color-code').value.trim()
    const hex = colorCode.startsWith('#') ? colorCode : '#' + colorCode
    
    // 16進数カラーコードの検証と変換
    const match = hex.match(/^#([0-9A-Fa-f]{6})$/)
    if (match) {
      const hexValue = match[1]
      this.rgbValues.r = parseInt(hexValue.substring(0, 2), 16)
      this.rgbValues.g = parseInt(hexValue.substring(2, 4), 16)
      this.rgbValues.b = parseInt(hexValue.substring(4, 6), 16)
      
      // スライダーを更新
      document.getElementById('red-slider').value = this.rgbValues.r
      document.getElementById('green-slider').value = this.rgbValues.g
      document.getElementById('blue-slider').value = this.rgbValues.b
      
      this.rgbToCmyk()
      this.updateDisplay()
    } else {
      alert('無効なカラーコード形式です。#FF0000 形式で入力してください。')
    }
  }

  switchMode(mode) {
    this.currentMode = mode
    const rgbControls = document.getElementById('rgb-controls')
    const cmykControls = document.getElementById('cmyk-controls')
    const rgbButton = document.getElementById('rgb-mode')
    const cmykButton = document.getElementById('cmyk-mode')
    
    if (mode === 'rgb') {
      rgbControls.classList.remove('hidden')
      cmykControls.classList.add('hidden')
      rgbButton.className = 'btn-primary'
      cmykButton.className = 'btn-secondary'
    } else {
      rgbControls.classList.add('hidden')
      cmykControls.classList.remove('hidden')
      rgbButton.className = 'btn-secondary'
      cmykButton.className = 'btn-primary'
    }
    this.updateSliders()
  }

  createPresetColors() {
    const container = document.getElementById('preset-colors')
    container.innerHTML = ''
    
    this.presetColors.forEach(preset => {
      const colorButton = document.createElement('button')
      colorButton.className = 'w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200'
      colorButton.style.backgroundColor = `rgb(${preset.rgb.r}, ${preset.rgb.g}, ${preset.rgb.b})`
      colorButton.title = preset.name
      colorButton.addEventListener('click', () => {
        this.rgbValues = { ...preset.rgb }
        this.rgbToCmyk()
        this.updateSliders()
        this.updateDisplay()
      })
      container.appendChild(colorButton)
    })
  }

  rgbToCmyk() {
    const { r, g, b } = this.rgbValues
    const rPercent = r / 255
    const gPercent = g / 255
    const bPercent = b / 255
    
    const k = 1 - Math.max(rPercent, gPercent, bPercent)
    const c = k === 1 ? 0 : (1 - rPercent - k) / (1 - k)
    const m = k === 1 ? 0 : (1 - gPercent - k) / (1 - k)
    const y = k === 1 ? 0 : (1 - bPercent - k) / (1 - k)
    
    this.cmykValues = {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    }
  }

  cmykToRgb() {
    const { c, m, y, k } = this.cmykValues
    const cPercent = c / 100
    const mPercent = m / 100
    const yPercent = y / 100
    const kPercent = k / 100
    
    const r = 255 * (1 - cPercent) * (1 - kPercent)
    const g = 255 * (1 - mPercent) * (1 - kPercent)
    const b = 255 * (1 - yPercent) * (1 - kPercent)
    
    this.rgbValues = {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b)
    }
  }

  updateSliders() {
    // RGB スライダーを更新
    document.getElementById('red-slider').value = this.rgbValues.r
    document.getElementById('green-slider').value = this.rgbValues.g
    document.getElementById('blue-slider').value = this.rgbValues.b
    
    // CMYK スライダーを更新
    document.getElementById('cyan-slider').value = this.cmykValues.c
    document.getElementById('magenta-slider').value = this.cmykValues.m
    document.getElementById('yellow-slider').value = this.cmykValues.y
    document.getElementById('key-slider').value = this.cmykValues.k
  }

  updateDisplay() {
    const { r, g, b } = this.rgbValues
    
    // ビット深度に応じて値を量子化
    const levels = Math.pow(2, this.bitDepth)
    const quantizedR = Math.round((r / 255) * (levels - 1)) / (levels - 1) * 255
    const quantizedG = Math.round((g / 255) * (levels - 1)) / (levels - 1) * 255
    const quantizedB = Math.round((b / 255) * (levels - 1)) / (levels - 1) * 255
    
    // 色プレビューを更新
    const colorPreview = document.getElementById('color-preview')
    colorPreview.style.backgroundColor = `rgb(${Math.round(quantizedR)}, ${Math.round(quantizedG)}, ${Math.round(quantizedB)})`
    
    // 16進数表示
    const hex = '#' + [quantizedR, quantizedG, quantizedB]
      .map(v => Math.round(v).toString(16).padStart(2, '0').toUpperCase())
      .join('')
    
    document.getElementById('hex-display').textContent = hex
    document.getElementById('rgb-display').textContent = `rgb(${Math.round(quantizedR)}, ${Math.round(quantizedG)}, ${Math.round(quantizedB)})`
    document.getElementById('cmyk-display').textContent = `cmyk(${this.cmykValues.c}%, ${this.cmykValues.m}%, ${this.cmykValues.y}%, ${this.cmykValues.k}%)`
    
    // 2進数表示
    document.getElementById('binary-r').textContent = Math.round(quantizedR).toString(2).padStart(8, '0')
    document.getElementById('binary-g').textContent = Math.round(quantizedG).toString(2).padStart(8, '0')
    document.getElementById('binary-b').textContent = Math.round(quantizedB).toString(2).padStart(8, '0')
    
    // 値表示を更新
    document.getElementById('red-value').textContent = Math.round(quantizedR)
    document.getElementById('green-value').textContent = Math.round(quantizedG)
    document.getElementById('blue-value').textContent = Math.round(quantizedB)
    
    // CMYK値表示を更新
    document.getElementById('cyan-value').textContent = `${this.cmykValues.c}%`
    document.getElementById('magenta-value').textContent = `${this.cmykValues.m}%`
    document.getElementById('yellow-value').textContent = `${this.cmykValues.y}%`
    document.getElementById('key-value').textContent = `${this.cmykValues.k}%`
    
    // ビット深度情報を更新
    document.getElementById('bit-depth-value').textContent = `${this.bitDepth}ビット`
    document.getElementById('color-count').textContent = `${Math.pow(levels, 3).toLocaleString()}色`
    document.getElementById('level-count').textContent = `${levels}段階`
    document.getElementById('total-bits').textContent = `${this.bitDepth * 3}ビット`
    
    // 階調バーを更新
    this.updateGradationBar()
  }

  updateGradationBar() {
    const gradationBar = document.getElementById('gradation-bar')
    const levels = Math.pow(2, this.bitDepth)
    const { r, g, b } = this.rgbValues
    
    // 現在の色から黒への階調を作成
    const gradientStops = []
    for (let i = 0; i < levels; i++) {
      const factor = i / (levels - 1)
      const gradR = Math.round(r * factor)
      const gradG = Math.round(g * factor)
      const gradB = Math.round(b * factor)
      gradientStops.push(`rgb(${gradR}, ${gradG}, ${gradB})`)
    }
    
    gradationBar.style.background = `linear-gradient(to right, ${gradientStops.join(', ')})`
    document.getElementById('gradation-info').textContent = `現在の色の階調を${levels}段階で表示しています`
  }

  cleanup() {
    // カラーシミュレータのクリーンアップ処理
  }
}