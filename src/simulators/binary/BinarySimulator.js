export class BinarySimulator {
  constructor() {
    this.currentValue = 0
    this.bitCount = 8
    this.signedMode = false
    this.animationInterval = null
    this.animationSpeed = 1000
    this.isAnimating = false
  }

  render(container) {
    container.innerHTML = `
      <div class="simulator-container">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">🔢 数値変換シミュレータ</h1>
          <p class="text-gray-600">2進数・10進数・16進数の相互変換とビット演算を学習しましょう</p>
        </div>

        <!-- コントロールパネル -->
        <div class="card mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- ビット数調整 -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">ビット数</label>
              <div class="space-y-2">
                <input type="range" id="bit-slider" min="1" max="16" value="8" 
                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                <div class="text-center text-sm font-mono text-blue-600" id="bit-value">8 bits</div>
              </div>
            </div>

            <!-- 符号付きモード -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">数値設定</label>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" id="signed-mode" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                  <span class="text-sm">符号付き（負の値対応）</span>
                </label>
              </div>
            </div>

            <!-- 数値スライダー -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">数値調整</label>
              <div class="space-y-2">
                <input type="range" id="value-slider" min="0" max="255" value="0" 
                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                <div class="text-center text-sm font-mono text-blue-600" id="value-display">0</div>
              </div>
            </div>

            <!-- 操作ボタン -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">操作</label>
              <div class="flex flex-col space-y-2">
                <button id="increment-btn" class="btn-primary text-sm">+1</button>
                <button id="decrement-btn" class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">-1</button>
                <button id="reset-btn" class="btn-secondary text-sm">リセット</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 数値表示エリア -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- 2進数表示 -->
          <div class="card bg-red-50 border-red-200">
            <h3 class="text-lg font-semibold text-red-800 mb-4">2進数 (Binary)</h3>
            <div class="bg-white rounded-lg p-4 font-mono text-center">
              <div id="binary-value" class="text-2xl font-bold text-red-600 break-all">00000000</div>
            </div>
          </div>

          <!-- 10進数表示 -->
          <div class="card bg-green-50 border-green-200">
            <h3 class="text-lg font-semibold text-green-800 mb-4">10進数 (Decimal)</h3>
            <div class="bg-white rounded-lg p-4 font-mono text-center space-y-2">
              <div id="decimal-value" class="text-2xl font-bold text-green-600">0</div>
              <div class="text-sm text-gray-600">実際の値</div>
              <div id="complement-container" class="hidden">
                <div id="complement-value" class="text-lg font-bold text-green-600">0</div>
                <div class="text-sm text-gray-600">2の補数表現</div>
              </div>
            </div>
          </div>

          <!-- 16進数表示 -->
          <div class="card bg-blue-50 border-blue-200">
            <h3 class="text-lg font-semibold text-blue-800 mb-4">16進数 (Hexadecimal)</h3>
            <div class="bg-white rounded-lg p-4 font-mono text-center">
              <div id="hex-value" class="text-2xl font-bold text-blue-600">0x00</div>
            </div>
          </div>
        </div>

        <!-- ビット表示 -->
        <div class="card mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">ビット表示</h3>
          <div id="bits-container" class="flex flex-wrap justify-center gap-1"></div>
        </div>

        <!-- アニメーション制御 -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">自動アニメーション</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- 方向選択 -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">方向</label>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input type="radio" name="animation-direction" value="up" checked class="text-blue-600 focus:ring-blue-500">
                  <span class="text-sm">増加</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="radio" name="animation-direction" value="down" class="text-blue-600 focus:ring-blue-500">
                  <span class="text-sm">減少</span>
                </label>
              </div>
            </div>

            <!-- 速度調整 -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">速度</label>
              <div class="space-y-2">
                <input type="range" id="speed-slider" min="100" max="2000" value="1000" step="100" 
                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                <div class="text-center text-sm font-mono text-blue-600" id="speed-value">1.0秒</div>
              </div>
            </div>

            <!-- 制御ボタン -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">制御</label>
              <div class="flex space-x-2">
                <button id="start-animation" class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">開始</button>
                <button id="stop-animation" class="btn-secondary">停止</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    this.setupEventListeners()
    this.updateDisplay()
    this.updateBitDisplay()
  }

  setupEventListeners() {
    // タッチイベント改善ヘルパー関数
    const addSliderTouchSupport = (element) => {
      // タッチ開始時にスクロール防止
      element.addEventListener('touchstart', (e) => {
        e.stopPropagation()
      }, { passive: false })
      
      // タッチ移動時にページスクロール防止
      element.addEventListener('touchmove', (e) => {
        e.stopPropagation()
      }, { passive: false })
      
      // タッチ終了時の処理
      element.addEventListener('touchend', (e) => {
        e.stopPropagation()
      }, { passive: false })
    }

    // ビット数調整
    const bitSlider = document.getElementById('bit-slider')
    addSliderTouchSupport(bitSlider)
    bitSlider.addEventListener('input', (e) => {
      this.bitCount = parseInt(e.target.value)
      this.updateBitCount()
    })

    // 符号付きモード
    document.getElementById('signed-mode').addEventListener('change', (e) => {
      this.signedMode = e.target.checked
      this.updateValueRange()
      this.updateDisplay()
    })

    // 数値スライダー
    const valueSlider = document.getElementById('value-slider')
    addSliderTouchSupport(valueSlider)
    valueSlider.addEventListener('input', (e) => {
      this.currentValue = parseInt(e.target.value)
      this.updateDisplay()
    })

    // 操作ボタン
    document.getElementById('increment-btn').addEventListener('click', () => this.increment())
    document.getElementById('decrement-btn').addEventListener('click', () => this.decrement())
    document.getElementById('reset-btn').addEventListener('click', () => this.reset())

    // アニメーション制御
    const speedSlider = document.getElementById('speed-slider')
    addSliderTouchSupport(speedSlider)
    speedSlider.addEventListener('input', (e) => {
      this.animationSpeed = parseInt(e.target.value)
      this.updateSpeedDisplay()
    })

    document.getElementById('start-animation').addEventListener('click', () => this.startAnimation())
    document.getElementById('stop-animation').addEventListener('click', () => this.stopAnimation())
  }

  updateBitCount() {
    document.getElementById('bit-value').textContent = `${this.bitCount} bit${this.bitCount > 1 ? 's' : ''}`
    this.currentValue = Math.min(this.currentValue, this.getMaxValue())
    this.updateValueRange()
    this.updateDisplay()
    this.updateBitDisplay()
  }

  updateValueRange() {
    const slider = document.getElementById('value-slider')
    slider.min = this.getMinValue()
    slider.max = this.getMaxValue()
    slider.value = this.currentValue
    document.getElementById('value-display').textContent = this.currentValue
  }

  getMaxValue() {
    if (this.signedMode) {
      return Math.pow(2, this.bitCount - 1) - 1
    }
    return Math.pow(2, this.bitCount) - 1
  }

  getMinValue() {
    if (this.signedMode) {
      return -Math.pow(2, this.bitCount - 1)
    }
    return 0
  }

  increment() {
    if (this.currentValue < this.getMaxValue()) {
      this.currentValue++
      this.updateDisplay()
    }
  }

  decrement() {
    if (this.currentValue > this.getMinValue()) {
      this.currentValue--
      this.updateDisplay()
    }
  }

  reset() {
    this.currentValue = 0
    this.updateDisplay()
  }

  updateDisplay() {
    let binary, hex
    const decimal = this.currentValue.toString(10)
    
    if (this.signedMode && this.currentValue < 0) {
      const complement = Math.pow(2, this.bitCount) + this.currentValue
      binary = complement.toString(2).padStart(this.bitCount, '0')
      hex = '0x' + complement.toString(16).toUpperCase().padStart(Math.ceil(this.bitCount / 4), '0')
    } else {
      binary = this.currentValue.toString(2).padStart(this.bitCount, '0')
      hex = '0x' + this.currentValue.toString(16).toUpperCase().padStart(Math.ceil(this.bitCount / 4), '0')
    }

    document.getElementById('binary-value').textContent = binary
    document.getElementById('decimal-value').textContent = decimal
    document.getElementById('hex-value').textContent = hex

    // スライダーと表示値を同期
    document.getElementById('value-slider').value = this.currentValue
    document.getElementById('value-display').textContent = this.currentValue

    // 符号付きモードの2の補数表示
    const complementContainer = document.getElementById('complement-container')
    if (this.signedMode) {
      complementContainer.classList.remove('hidden')
      const complement = this.currentValue < 0 ? 
        (Math.pow(2, this.bitCount) + this.currentValue) : this.currentValue
      document.getElementById('complement-value').textContent = complement.toString()
    } else {
      complementContainer.classList.add('hidden')
    }

    this.updateBitDisplay()
  }

  updateBitDisplay() {
    const container = document.getElementById('bits-container')
    container.innerHTML = ''
    
    let binary
    if (this.signedMode && this.currentValue < 0) {
      const complement = Math.pow(2, this.bitCount) + this.currentValue
      binary = complement.toString(2).padStart(this.bitCount, '0')
    } else {
      binary = this.currentValue.toString(2).padStart(this.bitCount, '0')
    }
    
    for (let i = 0; i < this.bitCount; i++) {
      const bit = document.createElement('div')
      bit.className = `w-10 h-10 border-2 rounded-lg flex items-center justify-center font-mono font-bold text-lg transition-colors duration-200 ${
        binary[i] === '1' 
          ? 'bg-blue-500 text-white border-blue-500' 
          : 'bg-white text-gray-700 border-gray-300'
      }`
      bit.textContent = binary[i]
      bit.title = `Bit ${this.bitCount - i - 1}`
      container.appendChild(bit)
    }
  }

  updateSpeedDisplay() {
    document.getElementById('speed-value').textContent = `${(this.animationSpeed / 1000).toFixed(1)}秒`
  }

  startAnimation() {
    if (this.isAnimating) return
    
    this.isAnimating = true
    document.getElementById('start-animation').disabled = true
    document.getElementById('stop-animation').disabled = false
    
    const direction = document.querySelector('input[name="animation-direction"]:checked').value
    
    this.animationInterval = setInterval(() => {
      if (direction === 'up') {
        if (this.currentValue >= this.getMaxValue()) {
          this.currentValue = this.getMinValue()
        } else {
          this.currentValue++
        }
      } else {
        if (this.currentValue <= this.getMinValue()) {
          this.currentValue = this.getMaxValue()
        } else {
          this.currentValue--
        }
      }
      this.updateDisplay()
    }, this.animationSpeed)
  }

  stopAnimation() {
    if (!this.isAnimating) return
    
    this.isAnimating = false
    document.getElementById('start-animation').disabled = false
    document.getElementById('stop-animation').disabled = true
    
    if (this.animationInterval) {
      clearInterval(this.animationInterval)
      this.animationInterval = null
    }
  }

  cleanup() {
    this.stopAnimation()
  }
}