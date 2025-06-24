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

        <!-- ハフマン符号化セクション -->
        <section id="huffman" class="content-section hidden">
          <div class="card mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">ハフマン符号化</h2>
            
            <div class="flex flex-wrap justify-center gap-2 mb-6">
              <button class="section-btn active" data-subsection="basic">基本概念</button>
              <button class="section-btn" data-subsection="tree">木構築</button>
              <button class="section-btn" data-subsection="encode">符号化練習</button>
            </div>

            <!-- 基本概念 -->
            <div id="hf-basic" class="subsection active">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">出現頻度と符号表</h3>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <h4 class="text-lg font-semibold text-gray-800">文字の出現頻度を入力してください (%)</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-3">
                      <div class="flex items-center gap-2">
                        <label class="w-8 text-sm font-medium">A:</label>
                        <input type="number" id="freq-a" min="0" max="100" value="30" class="flex-1 px-2 py-1 border rounded">
                        <span class="text-sm">%</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <label class="w-8 text-sm font-medium">B:</label>
                        <input type="number" id="freq-b" min="0" max="100" value="25" class="flex-1 px-2 py-1 border rounded">
                        <span class="text-sm">%</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <label class="w-8 text-sm font-medium">C:</label>
                        <input type="number" id="freq-c" min="0" max="100" value="20" class="flex-1 px-2 py-1 border rounded">
                        <span class="text-sm">%</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <label class="w-8 text-sm font-medium">D:</label>
                        <input type="number" id="freq-d" min="0" max="100" value="15" class="flex-1 px-2 py-1 border rounded">
                        <span class="text-sm">%</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <label class="w-8 text-sm font-medium">E:</label>
                        <input type="number" id="freq-e" min="0" max="100" value="10" class="flex-1 px-2 py-1 border rounded">
                        <span class="text-sm">%</span>
                      </div>
                    </div>
                    <div class="space-y-3">
                      <div class="bg-gray-100 p-3 rounded">
                        <div class="text-sm font-medium">合計: <span id="freq-total" class="text-blue-600">100</span>%</div>
                      </div>
                      <button id="build-huffman-tree" class="btn-primary w-full">ハフマン木を構築</button>
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <h4 class="text-lg font-semibold text-gray-800">生成された符号表</h4>
                  <div class="bg-white border rounded-lg overflow-hidden">
                    <table id="code-table" class="w-full">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-3 py-2 text-left text-sm font-medium text-gray-700">文字</th>
                          <th class="px-3 py-2 text-left text-sm font-medium text-gray-700">出現頻度</th>
                          <th class="px-3 py-2 text-left text-sm font-medium text-gray-700">符号</th>
                          <th class="px-3 py-2 text-left text-sm font-medium text-gray-700">符号長</th>
                        </tr>
                      </thead>
                      <tbody id="code-table-body">
                        <tr><td colspan="4" class="px-3 py-4 text-center text-gray-500">ハフマン木を構築してください</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- 木構築 -->
            <div id="hf-tree" class="subsection hidden">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">ハフマン木構築過程</h3>
              <div class="space-y-4">
                <div class="flex flex-wrap gap-2">
                  <button id="tree-step-back" class="btn-secondary">戻る</button>
                  <button id="tree-step-forward" class="btn-secondary">次へ</button>
                  <button id="tree-auto-play" class="btn-primary">自動再生</button>
                  <button id="tree-reset" class="btn-secondary">リセット</button>
                </div>
                <div class="bg-white border rounded-lg p-4 min-h-96">
                  <svg id="huffman-tree" class="w-full h-96"></svg>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                  <div id="tree-step-text" class="text-blue-800">ハフマン木構築をステップ実行できます</div>
                </div>
              </div>
            </div>

            <!-- 符号化練習 -->
            <div id="hf-encode" class="subsection hidden">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">符号化・復号化練習</h3>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <div class="space-y-2">
                    <label for="text-input" class="block text-sm font-medium text-gray-700">文字列を入力:</label>
                    <input type="text" id="text-input" placeholder="例：ABCDE" class="w-full px-3 py-2 border rounded-md">
                    <button id="encode-text" class="btn-primary">符号化</button>
                  </div>
                  
                  <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                    <h5 class="font-semibold text-gray-800">符号化結果</h5>
                    <div id="encoded-text" class="font-mono text-sm bg-white p-2 rounded border"></div>
                    <div class="text-xs text-gray-600 space-y-1">
                      <div>元サイズ: <span id="original-size">0</span>ビット</div>
                      <div>符号化後: <span id="encoded-size">0</span>ビット</div>
                      <div>削減率: <span id="encode-ratio">0</span>%</div>
                    </div>
                  </div>
                </div>
                
                <div class="space-y-4">
                  <h5 class="font-semibold text-gray-800">復号化確認</h5>
                  <div id="decoded-text" class="bg-green-50 p-4 rounded-lg font-mono"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 比較・練習セクション -->
        <section id="comparison" class="content-section hidden">
          <div class="card mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">圧縮方式比較・総合練習</h2>
            
            <div class="space-y-6">
              <h3 class="text-xl font-semibold text-gray-800">同一データでの比較</h3>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-sm text-yellow-800"><strong>注意:</strong> 半角英数字（A-Z, a-z, 0-9）のみ入力可能です。</p>
                <p class="text-sm text-yellow-800">文字種数に応じて最適なビット数で計算します。</p>
              </div>
              
              <div class="space-y-4">
                <textarea id="comparison-text" placeholder="例: AAABBBCCC または ABC123" 
                         class="w-full px-3 py-2 border rounded-md h-24 resize-none"></textarea>
                <button id="compare-methods" class="btn-primary">比較実行</button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-800 mb-2">非圧縮</h4>
                  <div class="space-y-1 text-sm">
                    <div>サイズ: <span id="uncompressed-size" class="font-mono">0</span>ビット</div>
                    <div id="bit-calculation" class="text-xs text-gray-600"></div>
                  </div>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800 mb-2">ランレングス符号化</h4>
                  <div class="space-y-1 text-sm">
                    <div>サイズ: <span id="rl-comp-size" class="font-mono">0</span>ビット</div>
                    <div>削減率: <span id="rl-comp-ratio" class="font-mono">0</span>%</div>
                  </div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-green-800 mb-2">ハフマン符号化</h4>
                  <div class="space-y-1 text-sm">
                    <div>サイズ: <span id="hf-comp-size" class="font-mono">0</span>ビット</div>
                    <div>削減率: <span id="hf-comp-ratio" class="font-mono">0</span>%</div>
                  </div>
                </div>
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
        
        // セルの背景色（元サイトと同じ色）
        ctx.fillStyle = data[row][col] === 0 ? '#e3f2fd' : '#1976d2'
        ctx.fillRect(x, y, cellSize, cellSize)
        
        // 境界線
        ctx.strokeStyle = '#666'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, cellSize, cellSize)
        
        // セルの文字（AまたはB）
        ctx.fillStyle = data[row][col] === 0 ? '#333' : '#fff'
        ctx.font = `${Math.max(16, cellSize * 0.4)}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(
          data[row][col] === 0 ? 'A' : 'B',
          x + cellSize / 2,
          y + cellSize / 2
        )
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
    
    // 元サイトと同じ圧縮率計算（圧縮後サイズ / 元サイズ × 100）
    const originalSize = 64
    const compressedSize = compressedData.totalBits
    const compressionRatio = (compressedSize / originalSize * 100).toFixed(1)
    const reductionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
    
    // 表示を更新
    document.getElementById('original-bits').textContent = originalBits
    document.getElementById('compressed-bits').textContent = compressedData.encoding
    document.getElementById('compressed-size').textContent = `${compressedSize}ビット`
    document.getElementById('ratio-value').textContent = `${reductionRatio}%`
    document.getElementById('first-bit').textContent = this.gridData[0][0] === 0 ? 'A (0)' : 'B (1)'
  }

  runLengthEncode(data) {
    let totalBits = 0
    let allEncodings = []
    
    for (let row = 0; row < 8; row++) {
      const rowResult = this.encodeRow(data[row])
      totalBits += rowResult.bits
      allEncodings.push(rowResult.encoding)
    }
    
    return {
      totalBits,
      encoding: allEncodings.join(' | '),
      details: allEncodings
    }
  }

  encodeRow(rowData) {
    const encodingParts = []
    let totalBits = 1 // 最初のビット（行の開始文字）
    let count = 1
    let currentValue = rowData[0]
    
    // 最初のビット: A=0, B=1
    const firstBit = currentValue.toString()
    
    for (let i = 1; i < rowData.length; i++) {
      if (rowData[i] === currentValue && count < 8) { // 最大8連続（3ビットで0-7を表現、count-1）
        count++
      } else {
        // 個数-1を記録（範囲0-7）
        const countMinus1 = count - 1
        encodingParts.push(countMinus1.toString(2).padStart(3, '0'))
        totalBits += 3
        
        if (rowData[i] !== currentValue) {
          // 文字が変わった
          currentValue = rowData[i]
          count = 1
        } else {
          // 9個目以降は新しいブロック開始
          count = 1
        }
      }
    }
    
    // 最後の個数
    const countMinus1 = count - 1
    encodingParts.push(countMinus1.toString(2).padStart(3, '0'))
    totalBits += 3
    
    return {
      bits: totalBits, // 1ビット（最初の文字） + 3ビット × ランの数
      encoding: `${firstBit} ${encodingParts.join(' ')}`,
      firstBit: firstBit
    }
  }

  updatePracticeResults() {
    const compressedData = this.runLengthEncode(this.practiceGridData)
    const originalSize = 64
    const compressedSize = compressedData.totalBits
    const reductionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
    
    document.getElementById('practice-original').textContent = `${originalSize}ビット`
    document.getElementById('practice-compressed').textContent = `${compressedSize}ビット`
    document.getElementById('practice-ratio').textContent = `${reductionRatio}%`
    
    // 評価
    let evaluation = ''
    if (reductionRatio > 50) evaluation = '優秀！'
    else if (reductionRatio > 25) evaluation = '良好'
    else if (reductionRatio > 0) evaluation = 'まずまず'
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