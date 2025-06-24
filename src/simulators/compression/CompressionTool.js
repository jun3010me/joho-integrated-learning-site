export class CompressionTool {
  constructor() {
    this.currentSection = 'run-length'
    this.currentSubsection = { 'run-length': 'basic', 'huffman': 'basic' }
    
    // 初期パターンでグリッドを初期化（全てA）
    this.gridData = Array(8).fill().map(() => Array(8).fill(0)) // 0=A, 1=B
    this.practiceGridData = Array(8).fill().map(() => Array(8).fill(0))
    
    console.log('CompressionTool constructor - Initial grid data:', this.gridData)
    
    this.huffmanFrequencies = { A: 30, B: 25, C: 20, D: 15, E: 10 }
    this.huffmanCodes = {}
    this.huffmanTree = null
    this.treeSteps = []
    this.currentTreeStep = 0
    this.lastTouch = null // タッチのデバウンス用
    this.canvasInitialized = false
  }

  render(container) {
    console.log('=== CompressionTool render() started ===')
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
              <button class="section-btn" data-subsection="problems">問題</button>
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

            <!-- 問題セクション -->
            <div id="hf-problems" class="subsection hidden">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">練習問題</h3>
              <div class="space-y-4">
                <button id="generate-hf-problem" class="btn-primary">新しい問題を生成</button>
                <div id="hf-problem-display" class="mt-4"></div>
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

    console.log('=== HTML inserted, setting up listeners ===')
    
    // DOM要素が完全に作成されてからイベントリスナーを設定
    setTimeout(() => {
      console.log('=== DOM Check After HTML Insert ===')
      console.log('pixel-grid exists:', !!document.getElementById('pixel-grid'))
      console.log('run-length section exists:', !!document.getElementById('run-length'))
      console.log('run-length section visible:', document.getElementById('run-length')?.style.display !== 'none')
      console.log('all canvas elements:', document.querySelectorAll('canvas'))
      
      // DOM要素作成完了後にイベントリスナーとSVG初期化
      this.setupEventListeners()
      this.initializeSVG()
      
      // 初期セクションを確実に表示
      this.ensureInitialSectionVisible()
      
      // 強制的に初期表示を実行
      this.forceInitialDisplay()
    }, 0)
  }

  // 初期セクション表示を確実にする
  ensureInitialSectionVisible() {
    console.log('ensureInitialSectionVisible called')
    
    // ランレングス符号化セクションを確実に表示
    const runLengthSection = document.getElementById('run-length')
    if (runLengthSection) {
      runLengthSection.classList.add('active')
      runLengthSection.style.display = 'block'
      console.log('Run-length section set to visible')
    }
    
    // 他のセクションを非表示
    const otherSections = ['huffman', 'comparison']
    otherSections.forEach(sectionId => {
      const section = document.getElementById(sectionId)
      if (section) {
        section.classList.remove('active')
        section.style.display = 'none'
      }
    })
    
    // ナビゲーションボタンの状態も確実に設定
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active')
      if (btn.dataset.section === 'run-length') {
        btn.classList.add('active')
        console.log('Run-length nav button set to active')
      }
    })
  }

  // 強制初期表示メソッド
  forceInitialDisplay() {
    console.log('forceInitialDisplay called - using same logic as section switching')
    
    // セクション切り替えと全く同じタイミング（50ms）で実行
    setTimeout(() => {
      console.log('Initial display - executing section switch logic')
      // switchSection('run-length')と同じロジックを実行
      this.executeRunLengthSectionDisplay()
    }, 50)
  }

  // ランレングスセクション表示を実行（セクション切り替えと初期表示で共通使用）
  executeRunLengthSectionDisplay() {
    console.log('executeRunLengthSectionDisplay called')
    
    // セクション表示状態を強制設定
    const runLengthSection = document.getElementById('run-length')
    if (runLengthSection) {
      runLengthSection.classList.add('active')
      runLengthSection.style.display = 'block'
      console.log('Run-length section forced visible')
    }
    
    // 他のセクションを非表示
    const otherSections = ['huffman', 'comparison']
    otherSections.forEach(sectionId => {
      const section = document.getElementById(sectionId)
      if (section) {
        section.classList.remove('active')
        section.style.display = 'none'
      }
    })
    
    // ナビゲーションボタン状態設定
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active')
      if (btn.dataset.section === 'run-length') {
        btn.classList.add('active')
      }
    })
    
    // キャンバス描画実行（セクション切り替えと全く同じ50msタイミング）
    setTimeout(() => {
      this.setupCanvasAndDraw()
    }, 50)
  }

  // キャンバス設定と描画を一括実行
  setupCanvasAndDraw() {
    console.log('setupCanvasAndDraw called')
    
    // ランレングス符号化セクションが表示されているかチェック
    const runLengthSection = document.getElementById('run-length')
    if (!runLengthSection || runLengthSection.style.display === 'none') {
      console.warn('Run-length section not visible, skipping canvas setup')
      return false
    }
    
    const canvas = document.getElementById('pixel-grid')
    if (!canvas) {
      console.error('=== CANVAS NOT FOUND ===')
      console.log('Available elements in run-length:', runLengthSection.querySelectorAll('*'))
      console.log('All canvas elements:', document.querySelectorAll('canvas'))
      console.log('pixel-grid by ID:', document.getElementById('pixel-grid'))
      console.log('Run-length section HTML:', runLengthSection.innerHTML.slice(0, 500))
      return false
    }
    
    console.log('Canvas found, initializing...', canvas)
    
    // キャンバス設定
    canvas.width = 320
    canvas.height = 320
    canvas.style.display = 'block'
    
    // イベントリスナー設定
    this.setupCanvasElement(canvas, 'main')
    
    // 強制描画 - クリアパターンで表示
    console.log('About to draw grid with data:', this.gridData)
    
    // デフォルトのクリアパターン（全てA）
    const clearPattern = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ]
    
    console.log('Drawing with clear pattern (all A)')
    this.drawGrid(canvas, clearPattern)
    
    // 実際のデータも保存
    this.gridData = clearPattern
    
    // 練習用キャンバスも設定
    const practiceCanvas = document.getElementById('practice-grid')
    if (practiceCanvas) {
      practiceCanvas.width = 320
      practiceCanvas.height = 320
      this.setupCanvasElement(practiceCanvas, 'practice')
      this.drawGrid(practiceCanvas, this.practiceGridData)
    }
    
    // 圧縮結果更新
    this.updateRunLengthEncoding()
    
    this.canvasInitialized = true
    console.log('Canvas initialization complete')
    return true
  }

  // 外部から呼び出し可能なメソッド
  show() {
    console.log('CompressionTool show() called')
    this.forceInitialDisplay()
  }

  // セクション切り替え時の再表示
  refreshCurrentSection() {
    console.log('refreshCurrentSection called')
    if (this.currentSection === 'run-length') {
      this.setupCanvasAndDraw()
    }
  }

  setupEventListeners() {
    console.log('=== setupEventListeners started ===')
    
    try {
      // メインナビゲーション
      console.log('Setting up nav-btn listeners...')
      const navBtns = document.querySelectorAll('.nav-btn')
      console.log('Found nav buttons:', navBtns.length)
      
      navBtns.forEach(btn => {
        if (btn) {
          btn.addEventListener('click', (event) => {
            if (event && event.target && event.target.dataset) {
              this.switchSection(event.target.dataset.section)
            }
          })
        }
      })
      console.log('Nav buttons setup complete')
    } catch (error) {
      console.error('Error setting up nav buttons:', error)
    }

    try {
      // セクションナビゲーション
      console.log('Setting up section-btn listeners...')
      const sectionBtns = document.querySelectorAll('.section-btn')
      console.log('Found section buttons:', sectionBtns.length)
      
      sectionBtns.forEach(btn => {
        if (btn) {
          btn.addEventListener('click', (event) => {
            if (event && event.target && event.target.dataset) {
              const section = this.currentSection
              const subsection = event.target.dataset.subsection
              this.switchSubsection(section, subsection)
            }
          })
        }
      })
      console.log('Section buttons setup complete')
    } catch (error) {
      console.error('Error setting up section buttons:', error)
    }

    try {
      // グリッドコントロール
      console.log('Setting up grid control listeners...')
      const gridControls = [
        { id: 'clear-grid', action: () => this.clearGrid() },
        { id: 'pattern-vertical', action: () => this.setPattern('vertical') },
        { id: 'pattern-horizontal', action: () => this.setPattern('horizontal') },
        { id: 'pattern-checker', action: () => this.setPattern('checker') },
        { id: 'pattern-random', action: () => this.setPattern('random') }
      ]
      
      gridControls.forEach(control => {
        const element = document.getElementById(control.id)
        console.log(`${control.id} element:`, element)
        if (element) {
          element.addEventListener('click', control.action)
          console.log(`${control.id} listener added`)
        } else {
          console.log(`${control.id} element not found`)
        }
      })
      console.log('Grid controls setup complete')

      // 問題生成
      console.log('Setting up problem generation listeners...')
      const problemElements = [
        { id: 'generate-rl-problem', action: () => this.generateRunLengthProblem() },
        { id: 'generate-hf-problem', action: () => this.generateHuffmanProblem() }
      ]
      
      problemElements.forEach(prob => {
        const element = document.getElementById(prob.id)
        console.log(`${prob.id} element:`, element)
        if (element) {
          element.addEventListener('click', prob.action)
          console.log(`${prob.id} listener added`)
        } else {
          console.log(`${prob.id} element not found`)
        }
      })
      console.log('Problem generation setup complete')

      // ハフマン符号化
      console.log('Setting up Huffman listeners...')
      const huffmanElement = document.getElementById('build-huffman-tree')
      console.log('build-huffman-tree element:', huffmanElement)
      if (huffmanElement) {
        huffmanElement.addEventListener('click', () => this.buildHuffmanTree())
        console.log('build-huffman-tree listener added')
      } else {
        console.log('build-huffman-tree element not found')
      }
      console.log('Huffman listeners setup complete')
      
      // 出現頻度入力
      console.log('Setting up frequency input listeners...')
      const frequencyChars = ['a', 'b', 'c', 'd', 'e']
      frequencyChars.forEach((charCode, index) => {
        try {
          console.log(`Setting up freq-${charCode} listener...`)
          const inputElement = document.getElementById(`freq-${charCode}`)
          console.log(`freq-${charCode} element:`, inputElement)
          if (inputElement) {
            inputElement.addEventListener('input', (inputEvent) => {
              console.log(`Input event triggered for freq-${charCode}`)
              if (inputEvent && inputEvent.target) {
                this.updateFrequencyTotal()
              }
            })
            console.log(`freq-${charCode} listener added successfully`)
          } else {
            console.log(`freq-${charCode} element not found`)
          }
        } catch (freqError) {
          console.error(`Error setting up freq-${charCode} listener:`, freqError)
        }
      })
      console.log('Frequency inputs setup complete')
    } catch (error) {
      console.error('Error setting up grid/problem/huffman listeners:', error)
    }

    try {
      // 符号化練習
      console.log('Setting up encoding practice listeners...')
      document.getElementById('encode-text')?.addEventListener('click', () => this.encodeText())

      // 木構築コントロール
      console.log('Setting up tree control listeners...')
      document.getElementById('tree-step-back')?.addEventListener('click', () => this.treeStepBack())
      document.getElementById('tree-step-forward')?.addEventListener('click', () => this.treeStepForward())
      document.getElementById('tree-auto-play')?.addEventListener('click', () => this.treeAutoPlay())
      document.getElementById('tree-reset')?.addEventListener('click', () => this.treeReset())
      console.log('Tree controls setup complete')

      // 比較ツール
      console.log('Setting up comparison tool listeners...')
      document.getElementById('compare-methods')?.addEventListener('click', () => this.compareMethods())
      
      // 比較テキストのリアルタイムバリデーション
      const comparisonText = document.getElementById('comparison-text')
      if (comparisonText) {
        comparisonText.addEventListener('input', (event) => {
          if (event && event.target) {
            this.validateComparisonInput(event)
          }
        })
      }
      console.log('Comparison tools setup complete')
    } catch (error) {
      console.error('Error setting up encoding/tree/comparison listeners:', error)
    }
    
    console.log('=== setupEventListeners completed successfully ===')
  }

  switchSection(section) {
    console.log(`Switching to section: ${section}`)
    this.currentSection = section
    
    // ナビゲーションボタンの状態更新
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active')
      if (btn.dataset.section === section) {
        btn.classList.add('active')
      }
    })

    // セクションの表示切り替え
    document.querySelectorAll('.content-section').forEach(sec => {
      if (sec.id === section) {
        sec.classList.add('active')
        sec.style.display = 'block'
        console.log(`Showing section: ${sec.id}`)
      } else {
        sec.classList.remove('active')
        sec.style.display = 'none'
      }
    })

    // セクション切り替え後にキャンバスを再初期化
    if (section === 'run-length') {
      setTimeout(() => {
        this.setupCanvasAndDraw()
      }, 50)
    }
  }

  switchSubsection(section, subsection) {
    console.log(`switchSubsection called: section=${section}, subsection=${subsection}`)
    this.currentSubsection[section] = subsection
    
    // サブセクションボタンの状態更新
    document.querySelectorAll('.section-btn').forEach(btn => {
      btn.classList.remove('active')
      if (btn.dataset.subsection === subsection) {
        btn.classList.add('active')
      }
    })

    // サブセクションの表示切り替え
    const sectionElement = document.getElementById(section)
    if (sectionElement) {
      // セクション名を正しいプレフィックスに変換
      let prefix
      if (section === 'run-length') {
        prefix = 'rl'
      } else if (section === 'huffman') {
        prefix = 'hf'
      } else {
        prefix = section.split('-')[0]
      }
      
      const targetId = `${prefix}-${subsection}`
      console.log(`Looking for subsection ID: ${targetId}`)
      
      sectionElement.querySelectorAll('.subsection').forEach(sub => {
        const isActive = sub.id === targetId
        console.log(`Subsection ${sub.id}: ${isActive ? 'ACTIVE' : 'hidden'}`)
        
        if (isActive) {
          sub.classList.add('active')
          sub.classList.remove('hidden')
          sub.style.display = 'block'
        } else {
          sub.classList.remove('active')
          sub.classList.add('hidden')
          sub.style.display = 'none'
        }
      })
    } else {
      console.error(`Section element not found: ${section}`)
    }
    
    console.log(`switchSubsection completed for ${section}-${subsection}`)
  }


  setupCanvasElement(canvas, type) {
    // 重複イベント設定を防ぐ
    if (canvas.dataset.eventsSetup === 'true') {
      return
    }
    
    // マウスイベント
    canvas.addEventListener('click', (event) => this.handleCanvasClick(event, canvas, type))
    
    // タッチイベント
    canvas.addEventListener('touchstart', (event) => {
      event.preventDefault()
      this.lastTouch = Date.now()
    })
    
    canvas.addEventListener('touchend', (event) => {
      event.preventDefault()
      if (this.lastTouch && Date.now() - this.lastTouch < 300) {
        const touch = event.touches && event.touches[0] || event.changedTouches && event.changedTouches[0]
        if (touch) {
          this.handleCanvasClick(touch, canvas, type)
        }
      }
    })
    
    // イベント設定完了をマーク
    canvas.dataset.eventsSetup = 'true'
  }

  handleCanvasClick(event, canvas, type) {
    if (!event || !canvas) {
      console.warn('Invalid parameters in handleCanvasClick')
      return
    }
    
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX !== undefined ? event.clientX : event.pageX) - rect.left
    const y = (event.clientY !== undefined ? event.clientY : event.pageY) - rect.top
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
    console.log('=== drawGrid called ===')
    console.log('Canvas element:', canvas)
    console.log('Data to draw:', data)
    console.log('Canvas parent:', canvas?.parentElement)
    console.log('Canvas display style:', canvas?.style.display)
    console.log('Canvas computed style:', canvas ? getComputedStyle(canvas).display : 'N/A')
    
    if (!canvas) {
      console.error('Canvas is null in drawGrid')
      return
    }
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Could not get 2d context from canvas')
      return
    }
    
    const cellSize = 40
    
    // キャンバスサイズを明示的に設定
    canvas.width = 320
    canvas.height = 320
    
    console.log('Canvas dimensions set to:', canvas.width, 'x', canvas.height)
    
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
    
    console.log('=== Grid drawing completed ===')
    console.log('Total cells drawn: 64')
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
    
    // 削減率計算（圧縮後サイズ / 元サイズ × 100 として表示）
    const originalSize = 64
    const compressedSize = compressedData.totalBits
    const reductionRatio = (compressedSize / originalSize * 100).toFixed(1)
    
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

  initializeSVG() {
    const svg = document.getElementById('huffman-tree')
    if (svg) {
      svg.setAttribute('width', '800')
      svg.setAttribute('height', '400')
      svg.setAttribute('viewBox', '0 0 800 400')
      svg.style.maxWidth = '100%'
      svg.style.height = 'auto'
    }
  }


  // ハフマン符号化関連メソッド
  updateFrequencyTotal() {
    const frequencies = ['a', 'b', 'c', 'd', 'e']
    const total = frequencies.reduce((sum, char) => {
      const input = document.getElementById(`freq-${char}`)
      return sum + (input ? parseInt(input.value) || 0 : 0)
    }, 0)
    
    document.getElementById('freq-total').textContent = total
    
    // 合計が100でない場合は警告表示
    const totalElement = document.getElementById('freq-total')
    if (total === 100) {
      totalElement.className = 'text-blue-600'
    } else {
      totalElement.className = 'text-red-600'
    }
  }

  buildHuffmanTree() {
    // 頻度データを収集
    const frequencies = {}
    let totalFreq = 0
    
    ['a', 'b', 'c', 'd', 'e'].forEach(char => {
      const input = document.getElementById(`freq-${char}`)
      const value = input ? parseInt(input.value) || 0 : 0
      if (value > 0) {
        frequencies[char.toUpperCase()] = value
        totalFreq += value
      }
    })
    
    if (totalFreq !== 100) {
      alert('出現頻度の合計を100%にしてください')
      return
    }
    
    if (Object.keys(frequencies).length < 2) {
      alert('少なくとも2つの文字の頻度を入力してください')
      return
    }
    
    // ハフマン符号を生成
    this.huffmanCodes = this.generateHuffmanCodes(frequencies)
    this.generateTreeSteps(frequencies)
    this.updateCodeTable()
    
    // 木構築完了を表示
    if (this.treeSteps.length > 0) {
      this.currentTreeStep = this.treeSteps.length - 1
      this.updateTreeVisualization()
      alert('ハフマン木が構築されました！木構築タブで過程を確認できます。')
    }
  }

  generateHuffmanCodes(frequencies) {
    // 優先度付きキュー（ソート済み配列）として初期化
    const nodes = Object.entries(frequencies)
      .filter(([char, freq]) => freq > 0)
      .map(([char, freq]) => ({ char, freq, left: null, right: null }))
      .sort((a, b) => a.freq - b.freq)
    
    // 単一文字の場合の特別処理
    if (nodes.length === 1) {
      this.huffmanTree = nodes[0]
      return { [nodes[0].char]: '0' }
    }
    
    // ボトムアップで木を構築
    while (nodes.length > 1) {
      const left = nodes.shift()   // 最小頻度
      const right = nodes.shift()  // 2番目の最小頻度
      
      const merged = {
        char: null,
        freq: left.freq + right.freq,
        left,
        right
      }
      
      // マージしたノードを正しい位置に挿入してソート順を維持
      let inserted = false
      for (let i = 0; i < nodes.length; i++) {
        if (merged.freq <= nodes[i].freq) {
          nodes.splice(i, 0, merged)
          inserted = true
          break
        }
      }
      if (!inserted) {
        nodes.push(merged)
      }
    }
    
    this.huffmanTree = nodes[0]
    return this.generateCodesFromTree()
  }

  generateCodesFromTree() {
    if (!this.huffmanTree) return {}
    
    const codes = {}
    
    const generateCodes = (node, code = '') => {
      if (node.char !== null) {
        // 葉ノード - 符号を割り当て
        codes[node.char] = code || '0' // 単一文字の場合
      } else {
        // 内部ノード - 再帰
        if (node.left) generateCodes(node.left, code + '0')
        if (node.right) generateCodes(node.right, code + '1')
      }
    }
    
    generateCodes(this.huffmanTree)
    return codes
  }

  generateTreeSteps(frequencies) {
    this.treeSteps = []
    this.currentTreeStep = 0
    
    // 初期状態
    let nodes = Object.entries(frequencies)
      .filter(([char, freq]) => freq > 0)
      .map(([char, freq]) => ({ char, freq, left: null, right: null }))
      .sort((a, b) => a.freq - b.freq)
    
    this.treeSteps.push({
      nodes: [...nodes],
      tree: null,
      description: '初期状態：文字を頻度順にソート'
    })
    
    // 各マージステップ
    while (nodes.length > 1) {
      const left = nodes.shift()
      const right = nodes.shift()
      const merged = {
        char: null,
        freq: left.freq + right.freq,
        left: this.deepCopyNode(left),
        right: this.deepCopyNode(right)
      }
      
      // マージしたノードを挿入
      let inserted = false
      for (let i = 0; i < nodes.length; i++) {
        if (merged.freq <= nodes[i].freq) {
          nodes.splice(i, 0, merged)
          inserted = true
          break
        }
      }
      if (!inserted) {
        nodes.push(merged)
      }
      
      this.treeSteps.push({
        nodes: [...nodes],
        tree: nodes.length === 1 ? this.deepCopyNode(nodes[0]) : null,
        merged: { left: left.char || `(${left.freq})`, right: right.char || `(${right.freq})`, freq: merged.freq },
        description: `マージ: ${left.char || `(${left.freq})`}(${left.freq}) + ${right.char || `(${right.freq})`}(${right.freq}) → (${merged.freq})`
      })
    }
  }

  deepCopyNode(node) {
    if (!node) return null
    return {
      char: node.char,
      freq: node.freq,
      left: this.deepCopyNode(node.left),
      right: this.deepCopyNode(node.right)
    }
  }

  updateCodeTable() {
    const tableBody = document.getElementById('code-table-body')
    if (!tableBody || !this.huffmanCodes) return
    
    tableBody.innerHTML = ''
    
    Object.entries(this.huffmanCodes)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([char, code]) => {
        const frequencies = {}
        ['a', 'b', 'c', 'd', 'e'].forEach(c => {
          const input = document.getElementById(`freq-${c}`)
          if (input) frequencies[c.toUpperCase()] = parseInt(input.value) || 0
        })
        
        const row = document.createElement('tr')
        row.innerHTML = `
          <td class="px-3 py-2 font-mono font-bold">${char}</td>
          <td class="px-3 py-2">${frequencies[char] || 0}%</td>
          <td class="px-3 py-2 font-mono text-blue-600">${code}</td>
          <td class="px-3 py-2">${code.length}ビット</td>
        `
        tableBody.appendChild(row)
      })
  }

  // 木構築ステップ制御
  treeStepBack() {
    if (this.currentTreeStep > 0) {
      this.currentTreeStep--
      this.updateTreeVisualization()
    }
  }

  treeStepForward() {
    if (this.currentTreeStep < this.treeSteps.length - 1) {
      this.currentTreeStep++
      this.updateTreeVisualization()
    }
  }

  treeAutoPlay() {
    if (this.treeSteps.length === 0) return
    
    let step = 0
    const interval = setInterval(() => {
      this.currentTreeStep = step
      this.updateTreeVisualization()
      step++
      
      if (step >= this.treeSteps.length) {
        clearInterval(interval)
      }
    }, 1500)
  }

  treeReset() {
    this.currentTreeStep = 0
    this.updateTreeVisualization()
  }

  updateTreeVisualization() {
    if (this.treeSteps.length === 0) {
      console.log('No tree steps available')
      return
    }
    
    const currentStep = this.treeSteps[this.currentTreeStep]
    const svg = document.getElementById('huffman-tree')
    const stepText = document.getElementById('tree-step-text')
    
    console.log('Current step:', this.currentTreeStep, 'Total steps:', this.treeSteps.length)
    console.log('Current step data:', currentStep)
    
    if (stepText) {
      stepText.textContent = `ステップ ${this.currentTreeStep + 1}/${this.treeSteps.length}: ${currentStep.description}`
    }
    
    if (svg) {
      console.log('SVG element found')
      if (currentStep.tree) {
        console.log('Drawing tree:', currentStep.tree)
        this.drawHuffmanTree(svg, currentStep.tree)
      } else {
        console.log('No tree in current step')
        svg.innerHTML = '<text x="400" y="200" text-anchor="middle" font-size="16" fill="#666">ハフマン木構築中...</text>'
      }
    } else {
      console.error('SVG element not found!')
    }
  }

  drawHuffmanTree(svg, tree) {
    console.log('Drawing tree:', tree)
    svg.innerHTML = ''
    
    if (!tree) {
      console.log('No tree to draw')
      return
    }
    
    // SVGのサイズを設定
    svg.setAttribute('width', '800')
    svg.setAttribute('height', '400')
    svg.setAttribute('viewBox', '0 0 800 400')
    const width = 800
    const height = 400
    
    const drawNode = (node, x, y, level, maxLevel) => {
      const radius = 20
      const levelHeight = (height - 100) / (maxLevel + 1)
      const nodeY = 50 + level * levelHeight
      
      // ノードを描画
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', x)
      circle.setAttribute('cy', nodeY)
      circle.setAttribute('r', radius)
      circle.setAttribute('fill', node.char ? '#3b82f6' : '#e5e7eb')
      circle.setAttribute('stroke', '#374151')
      circle.setAttribute('stroke-width', '2')
      svg.appendChild(circle)
      
      // ノードラベル
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', x)
      text.setAttribute('y', nodeY + 5)
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('font-size', '12')
      text.setAttribute('font-weight', 'bold')
      text.setAttribute('fill', node.char ? 'white' : 'black')
      text.textContent = node.char || node.freq
      svg.appendChild(text)
      
      // 子ノードを描画
      if (node.left || node.right) {
        const childSpacing = width / Math.pow(2, level + 2)
        
        if (node.left) {
          const leftX = x - childSpacing
          const leftY = 50 + (level + 1) * levelHeight
          
          // 線を描画
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
          line.setAttribute('x1', x)
          line.setAttribute('y1', nodeY + radius)
          line.setAttribute('x2', leftX)
          line.setAttribute('y2', leftY - radius)
          line.setAttribute('stroke', '#374151')
          line.setAttribute('stroke-width', '2')
          svg.appendChild(line)
          
          // "0"ラベル
          const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
          label.setAttribute('x', (x + leftX) / 2 - 15)
          label.setAttribute('y', (nodeY + leftY) / 2 - 5)
          label.setAttribute('font-size', '14')
          label.setAttribute('font-weight', 'bold')
          label.setAttribute('fill', '#ef4444')
          label.textContent = '0'
          svg.appendChild(label)
          
          drawNode(node.left, leftX, leftY, level + 1, maxLevel)
        }
        
        if (node.right) {
          const rightX = x + childSpacing
          const rightY = 50 + (level + 1) * levelHeight
          
          // 線を描画
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
          line.setAttribute('x1', x)
          line.setAttribute('y1', nodeY + radius)
          line.setAttribute('x2', rightX)
          line.setAttribute('y2', rightY - radius)
          line.setAttribute('stroke', '#374151')
          line.setAttribute('stroke-width', '2')
          svg.appendChild(line)
          
          // "1"ラベル
          const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
          label.setAttribute('x', (x + rightX) / 2 + 15)
          label.setAttribute('y', (nodeY + rightY) / 2 - 5)
          label.setAttribute('font-size', '14')
          label.setAttribute('font-weight', 'bold')
          label.setAttribute('fill', '#22c55e')
          label.textContent = '1'
          svg.appendChild(label)
          
          drawNode(node.right, rightX, rightY, level + 1, maxLevel)
        }
      }
    }
    
    const getMaxLevel = (node, level = 0) => {
      if (!node.left && !node.right) return level
      const leftLevel = node.left ? getMaxLevel(node.left, level + 1) : level
      const rightLevel = node.right ? getMaxLevel(node.right, level + 1) : level
      return Math.max(leftLevel, rightLevel)
    }
    
    const maxLevel = getMaxLevel(tree)
    drawNode(tree, width / 2, 50, 0, maxLevel)
  }

  // テキスト符号化
  encodeText() {
    const input = document.getElementById('text-input')
    const text = input ? input.value.toUpperCase() : ''
    
    if (!text || !this.huffmanCodes) {
      alert('まずハフマン木を構築し、テキストを入力してください')
      return
    }
    
    // 利用可能な文字をチェック
    const availableChars = Object.keys(this.huffmanCodes)
    const invalidChars = [...text].filter(char => !availableChars.includes(char))
    
    if (invalidChars.length > 0) {
      alert(`符号表にない文字が含まれています: ${invalidChars.join(', ')}`)
      return
    }
    
    // 各文字を符号化
    let encoded = ''
    const originalBits = text.length * 8 // 8ビットASCII
    
    for (const char of text) {
      encoded += this.huffmanCodes[char]
    }
    
    const encodedBits = encoded.length
    const reductionRatio = (encodedBits / originalBits * 100).toFixed(1)
    
    // 結果を表示
    document.getElementById('encoded-text').textContent = encoded
    document.getElementById('original-size').textContent = originalBits
    document.getElementById('encoded-size').textContent = encodedBits
    document.getElementById('encode-ratio').textContent = reductionRatio
    
    // 復号化で確認
    const decoded = this.decodeHuffman(encoded)
    document.getElementById('decoded-text').textContent = decoded
  }

  decodeHuffman(encoded) {
    if (!this.huffmanTree || !encoded) return ''
    
    let decoded = ''
    let current = this.huffmanTree
    
    for (const bit of encoded) {
      // 葉ノードに到達したら文字を出力してルートにリセット
      if (current.char !== null) {
        decoded += current.char
        current = this.huffmanTree
      }
      
      // ビットに基づいて木をナビゲート
      current = bit === '0' ? current.left : current.right
      
      if (!current) {
        return 'エラー: 無効な符号'
      }
    }
    
    // 最終文字を処理
    if (current.char !== null) {
      decoded += current.char
    }
    
    return decoded
  }

  // 比較ツール
  compareMethods() {
    const text = document.getElementById('comparison-text')?.value?.trim()
    
    if (!text) {
      alert('比較するテキストを入力してください')
      return
    }
    
    // 最適ビット計算
    const { originalSize, bitsPerChar, uniqueChars } = this.calculateOptimalBits(text)
    
    // ランレングス符号化サイズ
    const rlSize = this.calculateRunLengthSize(text)
    const rlRatio = (rlSize / originalSize * 100).toFixed(1)
    
    // ハフマン符号化サイズ（頻度ベース）
    const hfSize = this.calculateHuffmanSize(text)
    const hfRatio = (hfSize / originalSize * 100).toFixed(1)
    
    // 結果を表示
    document.getElementById('uncompressed-size').textContent = originalSize
    document.getElementById('bit-calculation').textContent = `${text.length}文字 × ${bitsPerChar}ビット/文字`
    document.getElementById('rl-comp-size').textContent = rlSize
    document.getElementById('rl-comp-ratio').textContent = rlRatio
    document.getElementById('hf-comp-size').textContent = hfSize
    document.getElementById('hf-comp-ratio').textContent = hfRatio
  }

  calculateOptimalBits(text) {
    const uniqueChars = [...new Set(text)].sort()
    const uniqueCount = uniqueChars.length
    
    let bitsPerChar
    if (uniqueCount === 1) {
      bitsPerChar = 1 // 単一文字でも最低1ビット
    } else {
      bitsPerChar = Math.ceil(Math.log2(uniqueCount))
    }
    
    const originalSize = text.length * bitsPerChar
    return { originalSize, bitsPerChar, uniqueChars }
  }

  calculateRunLengthSize(text) {
    // シンプルなランレングス符号化（文字+カウント）
    let totalBits = 0
    let i = 0
    
    while (i < text.length) {
      let count = 1
      while (i + count < text.length && text[i + count] === text[i] && count < 255) {
        count++
      }
      
      totalBits += 8 + 8 // 文字(8bit) + カウント(8bit)
      i += count
    }
    
    return totalBits
  }

  calculateHuffmanSize(text) {
    const freq = {}
    for (const char of text) {
      freq[char] = (freq[char] || 0) + 1
    }
    
    const uniqueCount = Object.keys(freq).length
    
    if (uniqueCount === 1) return text.length // 1ビット/文字
    if (uniqueCount === 2) return text.length // 1ビット/文字
    
    // 実際のハフマン符号化サイズを推定
    const sortedFreq = Object.entries(freq).sort((a, b) => b[1] - a[1])
    let totalBits = 0
    
    // 頻度順に符号長を割り当て（簡易版）
    for (let i = 0; i < sortedFreq.length; i++) {
      const [char, count] = sortedFreq[i]
      let codeBits
      
      // 頻度に基づく符号長の推定
      if (i === 0) codeBits = 1
      else if (i === 1) codeBits = 2
      else if (i <= 3) codeBits = 3
      else codeBits = Math.ceil(Math.log2(uniqueCount))
      
      totalBits += count * codeBits
    }
    
    return totalBits
  }

  validateComparisonInput(event) {
    // 英数字のみを許可
    if (!event || !event.target) {
      console.warn('Invalid event object in validateComparisonInput')
      return
    }
    
    const valid = /^[A-Za-z0-9]*$/
    const value = event.target.value
    
    if (!valid.test(value)) {
      event.target.value = value.replace(/[^A-Za-z0-9]/g, '')
    }
  }

  // 問題生成
  generateRunLengthProblem() {
    const patterns = [
      { data: 'AAABBBCCC', description: '3文字ずつの繰り返し' },
      { data: 'AAAAABBBB', description: '5文字と4文字の組み合わせ' },
      { data: 'ABABABAB', description: '交互パターン' },
      { data: 'AABBCCDD', description: '2文字ずつの繰り返し' },
      { data: 'AAAABBBBCCCCDDDD', description: '4種類の文字' }
    ]
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)]
    const display = document.getElementById('rl-problem-display')
    
    if (display) {
      display.innerHTML = `
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">問題: ${pattern.description}</h4>
          <p class="mb-3">次のデータをランレングス符号化してください：</p>
          <div class="font-mono text-lg bg-white p-2 rounded border mb-3">${pattern.data}</div>
          <p class="text-sm text-gray-600">各文字を8ビット、ランレングス符号化では文字+カウント(8ビット)で計算してください。</p>
        </div>
      `
    }
  }

  generateHuffmanProblem() {
    const problems = [
      {
        frequencies: { A: 40, B: 30, C: 20, D: 10 },
        text: '4文字の頻度分析'
      },
      {
        frequencies: { A: 35, B: 25, C: 25, D: 15 },
        text: '均等に近い分布'
      },
      {
        frequencies: { A: 50, B: 25, C: 15, D: 10 },
        text: '偏った分布'
      }
    ]
    
    const problem = problems[Math.floor(Math.random() * problems.length)]
    const display = document.getElementById('hf-problem-display')
    
    if (display) {
      const freqList = Object.entries(problem.frequencies)
        .map(([char, freq]) => `${char}: ${freq}%`)
        .join(', ')
      
      display.innerHTML = `
        <div class="bg-green-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">問題: ${problem.text}</h4>
          <p class="mb-3">次の頻度分布でハフマン木を構築してください：</p>
          <div class="font-mono bg-white p-2 rounded border mb-3">${freqList}</div>
          <p class="text-sm text-gray-600">上の基本概念タブで頻度を入力して、木構築タブで過程を確認してください。</p>
        </div>
      `
    }
  }

  cleanup() {
    // クリーンアップ処理
  }
}