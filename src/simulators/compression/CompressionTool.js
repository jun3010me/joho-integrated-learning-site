export class CompressionTool {
  constructor() {
    this.currentSection = 'run-length'
    this.currentSubsection = { 'run-length': 'basic', 'huffman': 'basic' }
    this.gridData = Array(8).fill().map(() => Array(8).fill(0)) // 0=A, 1=B
    this.practiceGridData = Array(8).fill().map(() => Array(8).fill(0))
    this.huffmanFrequencies = { A: 30, B: 25, C: 20, D: 15, E: 10 }
    this.huffmanCodes = {}
    this.huffmanTree = null
    this.treeSteps = []
    this.currentTreeStep = 0
    this.lastTouch = null // タッチのデバウンス用
  }

  render(container) {
    container.innerHTML = `
      <div class="simulator-container">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">🗜️ データ圧縮学習ツール</h1>
          <p class="text-gray-600">ランレングス符号化とハフマン符号化の実践学習</p>
        </div>

        <!-- タブナビゲーション -->
        <div class="card mb-8">
          <div class="flex flex-wrap justify-center gap-2 mb-6">
            <button class="nav-btn active" data-section="run-length">ランレングス符号化</button>
            <button class="nav-btn" data-section="huffman">ハフマン符号化</button>
            <button class="nav-btn" data-section="comparison">比較・練習</button>
          </div>
        </div>

        <!-- ランレングス符号化セクション -->
        <section id="run-length" class="content-section active">
          <div class="card mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">ランレングス符号化</h2>
            
            <div class="flex flex-wrap justify-center gap-2 mb-6">
              <button class="section-btn active" data-subsection="basic">基本概念</button>
              <button class="section-btn" data-subsection="practice">練習</button>
              <button class="section-btn" data-subsection="problems">問題</button>
            </div>

            <!-- 基本概念 -->
            <div id="rl-basic" class="subsection active">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">8×8ピクセルグリッド</h3>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- グリッド表示 -->
                <div class="space-y-4">
                  <div class="flex flex-wrap gap-2 mb-4">
                    <button id="clear-grid" class="btn-secondary text-sm">クリア</button>
                    <button id="pattern-vertical" class="btn-secondary text-sm">縦縞</button>
                    <button id="pattern-horizontal" class="btn-secondary text-sm">横縞</button>
                    <button id="pattern-checker" class="btn-secondary text-sm">チェック</button>
                    <button id="pattern-random" class="btn-secondary text-sm">ランダム</button>
                  </div>
                  
                  <div class="bg-white border-2 border-gray-300 rounded-lg p-4">
                    <canvas id="pixel-grid" width="320" height="320" class="border border-gray-400 mx-auto block"></canvas>
                    <div class="flex justify-center gap-4 mt-3">
                      <span class="flex items-center gap-1">
                        <div class="w-4 h-4 bg-blue-500 border border-gray-400"></div>
                        <span class="text-sm">A (0)</span>
                      </span>
                      <span class="flex items-center gap-1">
                        <div class="w-4 h-4 bg-red-500 border border-gray-400"></div>
                        <span class="text-sm">B (1)</span>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 符号化過程 -->
                <div class="space-y-4">
                  <h4 class="text-lg font-semibold text-gray-800">符号化の過程</h4>
                  <div class="space-y-3">
                    <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                      <span class="text-sm">最初のビット（行ごと）: <span id="first-bit" class="font-mono text-blue-600">-</span></span>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <span class="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                      <span class="text-sm">次の3ビット：最初の文字が続く個数-1を表す</span>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <span class="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                      <span class="text-sm">文字が変わるたびに、続く個数-1を3ビットで表す</span>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <span class="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                      <span class="text-sm">各行ごとに1〜3のルールで符号化</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 圧縮結果 -->
              <div class="mt-8 space-y-4">
                <h4 class="text-lg font-semibold text-gray-800">圧縮結果</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <label class="block text-sm font-medium text-gray-700 mb-2">元データ (64ビット)</label>
                    <div id="original-bits" class="font-mono text-xs bg-white p-2 rounded border break-all"></div>
                  </div>
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <label class="block text-sm font-medium text-blue-700 mb-2">圧縮データ</label>
                    <div id="compressed-bits" class="font-mono text-xs bg-white p-2 rounded border break-all"></div>
                    <div id="compressed-size" class="text-sm text-blue-600 mt-1 font-semibold">0ビット</div>
                  </div>
                  <div class="bg-green-50 p-4 rounded-lg">
                    <label class="block text-sm font-medium text-green-700 mb-2">削減率</label>
                    <div id="ratio-value" class="text-2xl font-bold text-green-600">0%</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 練習セクション -->
            <div id="rl-practice" class="subsection hidden">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">インタラクティブ練習</h3>
              <p class="text-gray-600 mb-6">様々なパターンを作成して圧縮効果を確認しよう</p>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white border-2 border-gray-300 rounded-lg p-4">
                  <canvas id="practice-grid" width="320" height="320" class="border border-gray-400 mx-auto block"></canvas>
                </div>
                
                <div class="space-y-4">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-700">元データサイズ:</span>
                      <span id="practice-original" class="font-mono text-gray-900">64ビット</span>
                    </div>
                  </div>
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-blue-700">圧縮後サイズ:</span>
                      <span id="practice-compressed" class="font-mono text-blue-900">0ビット</span>
                    </div>
                  </div>
                  <div class="bg-green-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-green-700">削減率:</span>
                      <span id="practice-ratio" class="font-mono text-green-900">0%</span>
                    </div>
                  </div>
                  <div class="bg-yellow-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-yellow-700">評価:</span>
                      <span id="practice-evaluation" class="font-mono text-yellow-900">-</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 問題セクション -->
            <div id="rl-problems" class="subsection hidden">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">練習問題</h3>
              <div class="space-y-4">
                <button id="generate-rl-problem" class="btn-primary">新しい問題を生成</button>
                <div id="rl-problem-display" class="mt-4"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `

    this.setupEventListeners()
    this.setupCanvas()
    this.updateDisplay()
  }

  setupEventListeners() {
    // メインナビゲーション
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchSection(e.target.dataset.section)
      })
    })

    // セクションナビゲーション
    document.querySelectorAll('.section-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = this.currentSection
        const subsection = e.target.dataset.subsection
        this.switchSubsection(section, subsection)
      })
    })

    // グリッドコントロール
    document.getElementById('clear-grid')?.addEventListener('click', () => this.clearGrid())
    document.getElementById('pattern-vertical')?.addEventListener('click', () => this.setPattern('vertical'))
    document.getElementById('pattern-horizontal')?.addEventListener('click', () => this.setPattern('horizontal'))
    document.getElementById('pattern-checker')?.addEventListener('click', () => this.setPattern('checker'))
    document.getElementById('pattern-random')?.addEventListener('click', () => this.setPattern('random'))

    // 問題生成
    document.getElementById('generate-rl-problem')?.addEventListener('click', () => this.generateRunLengthProblem())
  }

  switchSection(section) {
    this.currentSection = section
    
    // ナビゲーションボタンの状態更新
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section)
      btn.className = btn.dataset.section === section ? 'nav-btn btn-primary' : 'nav-btn btn-secondary'
    })

    // セクションの表示切り替え
    document.querySelectorAll('.content-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === section)
      sec.style.display = sec.id === section ? 'block' : 'none'
    })
  }

  switchSubsection(section, subsection) {
    this.currentSubsection[section] = subsection
    
    // サブセクションボタンの状態更新
    document.querySelectorAll('.section-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.subsection === subsection)
      btn.className = btn.dataset.subsection === subsection ? 'section-btn btn-primary' : 'section-btn btn-secondary'
    })

    // サブセクションの表示切り替え
    const sectionElement = document.getElementById(section)
    if (sectionElement) {
      sectionElement.querySelectorAll('.subsection').forEach(sub => {
        const isActive = sub.id === `${section.split('-')[0]}-${subsection}`
        sub.classList.toggle('active', isActive)
        sub.classList.toggle('hidden', !isActive)
      })
    }
  }

  setupCanvas() {
    const canvas = document.getElementById('pixel-grid')
    const practiceCanvas = document.getElementById('practice-grid')
    
    if (canvas) {
      this.setupCanvasElement(canvas, 'main')
      this.drawGrid(canvas, this.gridData)
    }
    
    if (practiceCanvas) {
      this.setupCanvasElement(practiceCanvas, 'practice')
      this.drawGrid(practiceCanvas, this.practiceGridData)
    }
  }

  setupCanvasElement(canvas, type) {
    // マウスイベント
    canvas.addEventListener('click', (e) => this.handleCanvasClick(e, canvas, type))
    
    // タッチイベント
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      this.lastTouch = Date.now()
    })
    
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault()
      if (this.lastTouch && Date.now() - this.lastTouch < 300) {
        this.handleCanvasClick(e.touches[0] || e.changedTouches[0], canvas, type)
      }
    })
  }

  handleCanvasClick(e, canvas, type) {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cellSize = 40
    
    const col = Math.floor(x / cellSize)
    const row = Math.floor(y / cellSize)
    
    if (col >= 0 && col < 8 && row >= 0 && row < 8) {
      const data = type === 'main' ? this.gridData : this.practiceGridData
      data[row][col] = 1 - data[row][col] // 0→1, 1→0
      
      this.drawGrid(canvas, data)
      if (type === 'main') {
        this.updateRunLengthEncoding()
      } else {
        this.updatePracticeResults()
      }
    }
  }

  drawGrid(canvas, data) {
    const ctx = canvas.getContext('2d')
    const cellSize = 40
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const x = col * cellSize
        const y = row * cellSize
        
        // セルの色を設定
        ctx.fillStyle = data[row][col] === 0 ? '#3b82f6' : '#ef4444' // blue : red
        ctx.fillRect(x, y, cellSize, cellSize)
        
        // 境界線
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, cellSize, cellSize)
      }
    }
  }

  clearGrid() {
    this.gridData = Array(8).fill().map(() => Array(8).fill(0))
    const canvas = document.getElementById('pixel-grid')
    if (canvas) {
      this.drawGrid(canvas, this.gridData)
      this.updateRunLengthEncoding()
    }
  }

  setPattern(pattern) {
    switch (pattern) {
      case 'vertical':
        this.gridData = Array(8).fill().map((_, row) => 
          Array(8).fill().map((_, col) => col % 2)
        )
        break
      case 'horizontal':
        this.gridData = Array(8).fill().map((_, row) => 
          Array(8).fill(row % 2)
        )
        break
      case 'checker':
        this.gridData = Array(8).fill().map((_, row) => 
          Array(8).fill().map((_, col) => (row + col) % 2)
        )
        break
      case 'random':
        this.gridData = Array(8).fill().map(() => 
          Array(8).fill().map(() => Math.random() < 0.5 ? 0 : 1)
        )
        break
    }
    
    const canvas = document.getElementById('pixel-grid')
    if (canvas) {
      this.drawGrid(canvas, this.gridData)
      this.updateRunLengthEncoding()
    }
  }

  updateRunLengthEncoding() {
    const originalBits = this.gridData.flat().join('')
    const compressedData = this.runLengthEncode(this.gridData)
    const compressedBits = compressedData.encoded
    const compressionRatio = ((64 - compressedBits.length) / 64 * 100).toFixed(1)
    
    // 表示を更新
    document.getElementById('original-bits').textContent = originalBits
    document.getElementById('compressed-bits').textContent = compressedBits
    document.getElementById('compressed-size').textContent = `${compressedBits.length}ビット`
    document.getElementById('ratio-value').textContent = `${compressionRatio}%`
    document.getElementById('first-bit').textContent = this.gridData[0][0]
  }

  runLengthEncode(data) {
    let encoded = ''
    
    for (let row = 0; row < 8; row++) {
      const rowData = data[row]
      let current = rowData[0]
      let count = 1
      let rowEncoded = current.toString() // 最初のビット
      
      for (let col = 1; col < 8; col++) {
        if (rowData[col] === current) {
          count++
        } else {
          // 続く個数-1を3ビットで表現
          rowEncoded += (count - 1).toString(2).padStart(3, '0')
          current = rowData[col]
          count = 1
        }
      }
      
      // 最後の連続も処理
      rowEncoded += (count - 1).toString(2).padStart(3, '0')
      encoded += rowEncoded
    }
    
    return { encoded }
  }

  updatePracticeResults() {
    const compressedData = this.runLengthEncode(this.practiceGridData)
    const originalSize = 64
    const compressedSize = compressedData.encoded.length
    const ratio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
    
    document.getElementById('practice-original').textContent = `${originalSize}ビット`
    document.getElementById('practice-compressed').textContent = `${compressedSize}ビット`
    document.getElementById('practice-ratio').textContent = `${ratio}%`
    
    // 評価
    let evaluation = ''
    if (ratio > 50) evaluation = '優秀！'
    else if (ratio > 25) evaluation = '良好'
    else if (ratio > 0) evaluation = 'まずまず'
    else evaluation = '圧縮効果なし'
    
    document.getElementById('practice-evaluation').textContent = evaluation
  }

  generateRunLengthProblem() {
    const problems = [
      '全て同じ色のパターンを作成してください（圧縮率はどうなる？）',
      '縦縞パターンで最も圧縮効果の高いパターンを作成してください',
      'チェッカーボードパターンを作成し、圧縮率を確認してください',
      '圧縮率が50%以上になるパターンを作成してください'
    ]
    
    const randomProblem = problems[Math.floor(Math.random() * problems.length)]
    const display = document.getElementById('rl-problem-display')
    
    if (display) {
      display.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="font-semibold text-blue-800 mb-2">問題</h4>
          <p class="text-blue-700">${randomProblem}</p>
        </div>
      `
    }
  }

  updateDisplay() {
    this.updateRunLengthEncoding()
  }

  cleanup() {
    // クリーンアップ処理
  }
}