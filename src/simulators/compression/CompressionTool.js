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
                    <div class="flex justify-center">
                      <canvas id="pixel-grid" width="320" height="320" class="border border-gray-400 max-w-full h-auto" style="max-width: min(320px, calc(100vw - 2rem)); max-height: min(320px, calc(100vw - 2rem));"></canvas>
                    </div>
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
                  <div class="flex justify-center">
                    <canvas id="practice-grid" width="320" height="320" class="border border-gray-400 max-w-full h-auto" style="max-width: min(320px, calc(100vw - 2rem)); max-height: min(320px, calc(100vw - 2rem));"></canvas>
                  </div>
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
              <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">🌳 ハフマン木構築過程</h3>
              <div class="space-y-6">
                <!-- 美しいナビゲーションコントロール -->
                <div class="flex flex-wrap justify-center gap-3">
                  <button id="tree-step-back" class="huffman-nav-button">⏮️ 戻る</button>
                  <button id="tree-step-forward" class="huffman-nav-button">次へ ⏭️</button>
                  <button id="tree-auto-play" class="huffman-nav-button">▶️ 自動再生</button>
                  <button id="tree-reset" class="huffman-nav-button">🔄 リセット</button>
                </div>
                
                <!-- 美しいステップインジケーター -->
                <div id="tree-step-indicator" class="huffman-step-indicator">
                  ステップ 1/7: 初期状態 - 各文字を個別ノードとして配置
                </div>
                
                <!-- 美しいハフマン木表示コンテナ -->
                <div class="huffman-tree-container">
                  <svg id="huffman-tree" class="w-full h-96" style="background: transparent;">
                    <!-- グラデーションとフィルターの定義 -->
                    <defs>
                      <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
                      </filter>
                      <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
                      </linearGradient>
                    </defs>
                    <!-- 背景 -->
                    <rect width="100%" height="100%" fill="url(#backgroundGradient)" rx="12"/>
                  </svg>
                </div>
                
                <!-- 美しい説明パネル -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span class="text-white font-bold text-lg">💡</span>
                      </div>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-blue-900 mb-2">構築のポイント</h4>
                      <div id="tree-step-text" class="text-blue-800 leading-relaxed">
                        ハフマン木構築をステップ実行できます。各ステップで最も頻度の低い2つのノードを結合していきます。
                      </div>
                    </div>
                  </div>
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
    console.log('=== buildHuffmanTree called ===')
    
    // 頻度データを収集
    const frequencies = {}
    let totalFreq = 0
    
    try {
      const characters = ['a', 'b', 'c', 'd', 'e']
      console.log('Characters array:', characters)
      
      if (!Array.isArray(characters)) {
        throw new Error('Characters array is not defined')
      }
      
      characters.forEach(char => {
        try {
          const input = document.getElementById(`freq-${char}`)
          const value = input ? parseInt(input.value) || 0 : 0
          console.log(`freq-${char}: ${value}`)
          if (value > 0) {
            frequencies[char.toUpperCase()] = value
            totalFreq += value
          }
        } catch (charError) {
          console.error(`Error processing character ${char}:`, charError)
        }
      })
    } catch (error) {
      console.error('Error in frequency collection:', error)
      alert('頻度データの収集中にエラーが発生しました。')
      return
    }
    
    console.log('Collected frequencies:', frequencies)
    console.log('Total frequency:', totalFreq)
    
    if (totalFreq !== 100) {
      alert('出現頻度の合計を100%にしてください')
      return
    }
    
    if (Object.keys(frequencies).length < 2) {
      alert('少なくとも2つの文字の頻度を入力してください')
      return
    }
    
    // SVG要素の存在確認
    const svg = document.getElementById('huffman-tree')
    console.log('SVG element check:', svg)
    if (!svg) {
      console.error('SVG element "huffman-tree" not found!')
      alert('ハフマン木を表示するためのSVG要素が見つかりません。木構築タブに移動してから実行してください。')
      return
    }
    
    // ハフマン符号を生成
    console.log('Generating Huffman codes...')
    try {
      this.huffmanCodes = this.generateHuffmanCodes(frequencies)
      console.log('Generated codes:', this.huffmanCodes)
      
      if (!this.huffmanCodes || typeof this.huffmanCodes !== 'object') {
        throw new Error('generateHuffmanCodes returned invalid result')
      }
    } catch (codeError) {
      console.error('Error generating Huffman codes:', codeError)
      alert('ハフマン符号の生成中にエラーが発生しました。')
      return
    }
    
    console.log('Generating tree steps...')
    try {
      this.generateTreeSteps(frequencies)
      console.log('Generated steps:', this.treeSteps.length)
    } catch (stepError) {
      console.error('Error generating tree steps:', stepError)
      // ステップ生成に失敗してもコードテーブルは更新する
    }
    
    console.log('Updating code table...')
    this.updateCodeTable()
    
    // 木構築完了を表示
    if (this.treeSteps.length > 0) {
      // 最初のステップから開始（初期状態を表示）
      this.currentTreeStep = 0
      console.log('Setting to first step and updating tree visualization...')
      
      // 自動的に木構築タブに切り替え
      this.switchSubsection('huffman', 'tree')
      
      // タブ切り替え後に少し遅延してから描画を更新
      setTimeout(() => {
        this.updateTreeVisualization()
      }, 100)
      
      alert('ハフマン木が構築されました！木構築タブで過程を確認できます。')
    }
  }

  generateHuffmanCodes(frequencies) {
    console.log('generateHuffmanCodes called with:', frequencies)
    
    if (!frequencies || typeof frequencies !== 'object') {
      console.error('Invalid frequencies object:', frequencies)
      return {}
    }
    
    try {
      // 優先度付きキュー（ソート済み配列）として初期化
      const entries = Object.entries(frequencies)
      console.log('Object.entries result:', entries)
      
      if (!Array.isArray(entries)) {
        throw new Error('Object.entries did not return an array')
      }
      
      const nodes = entries
        .filter(([char, freq]) => {
          console.log(`Filtering: ${char} = ${freq}`)
          return freq > 0
        })
        .map(([char, freq]) => {
          console.log(`Mapping: ${char} = ${freq}`)
          return { char, freq, left: null, right: null }
        })
        .sort((a, b) => {
          console.log(`Sorting: ${a.char}(${a.freq}) vs ${b.char}(${b.freq})`)
          return a.freq - b.freq
        })
      
      console.log('Generated nodes:', nodes)
      
      // 単一文字の場合の特別処理
      if (nodes.length === 1) {
        this.huffmanTree = nodes[0]
        return { [nodes[0].char]: '0' }
      }
      
      // ボトムアップで木を構築
      while (nodes.length > 1) {
        const left = nodes.shift()   // 最小頻度
        const right = nodes.shift()  // 2番目の最小頻度
        
        // 結合ノードの文字列を生成
        const leftChars = this.getNodeChars(left)
        const rightChars = this.getNodeChars(right)
        const mergedChars = leftChars + rightChars
        
        const merged = {
          char: null,
          displayChars: mergedChars,
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
    } catch (error) {
      console.error('Error in generateHuffmanCodes:', error)
      return {}
    }
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
    console.log('generateTreeSteps called with:', frequencies)
    this.treeSteps = []
    this.currentTreeStep = 0
    
    if (!frequencies || typeof frequencies !== 'object') {
      console.error('Invalid frequencies object in generateTreeSteps:', frequencies)
      return
    }
    
    try {
      // 初期状態
      const entries = Object.entries(frequencies)
      console.log('Tree steps - Object.entries result:', entries)
      
      if (!Array.isArray(entries)) {
        throw new Error('Object.entries did not return an array in generateTreeSteps')
      }
      
      let nodes = entries
        .filter(([char, freq]) => {
          console.log(`Tree steps filtering: ${char} = ${freq}`)
          return freq > 0
        })
        .map(([char, freq]) => {
          console.log(`Tree steps mapping: ${char} = ${freq}`)
          return { char, freq, left: null, right: null }
        })
        .sort((a, b) => {
          console.log(`Tree steps sorting: ${a.char}(${a.freq}) vs ${b.char}(${b.freq})`)
          return a.freq - b.freq
        })
      
      console.log('Tree steps - generated nodes:', nodes)
      
      if (!Array.isArray(nodes)) {
        throw new Error('Failed to generate nodes array')
      }
      
      this.treeSteps.push({
        nodes: [...nodes],
        tree: null,
        description: '初期状態：文字を頻度順にソート',
        forestNodes: this.buildForestSnapshot(nodes)
      })
      
      // 各マージステップ
      while (nodes.length > 1) {
        const left = nodes.shift()
        const right = nodes.shift()
        
        if (!left || !right) {
          throw new Error('Failed to get left or right node during merge')
        }
        
        // 結合ノードの文字列を生成（子ノードの文字を連結）
        const leftChars = this.getNodeChars(left)
        const rightChars = this.getNodeChars(right)
        const mergedChars = leftChars + rightChars
        
        const merged = {
          char: null, // 葉ノードではないことを示す
          displayChars: mergedChars, // 結合された文字列
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
          description: `マージ: ${left.char || `(${left.freq})`}(${left.freq}) + ${right.char || `(${right.freq})`}(${right.freq}) → (${merged.freq})`,
          // 段階的木構造表示用のデータ
          forestNodes: this.buildForestSnapshot(nodes),
          highlightPair: { left: this.deepCopyNode(left), right: this.deepCopyNode(right) },
          newParent: this.deepCopyNode(merged)
        })
      }
    } catch (error) {
      console.error('Error in generateTreeSteps:', error)
      this.treeSteps = []
      alert('ハフマン木のステップ生成中にエラーが発生しました。')
    }
  }

  deepCopyNode(node) {
    if (!node) return null
    return {
      char: node.char,
      displayChars: node.displayChars,
      freq: node.freq,
      left: this.deepCopyNode(node.left),
      right: this.deepCopyNode(node.right)
    }
  }

  getNodeChars(node) {
    if (!node) return ''
    
    // 葉ノードの場合は文字を返す
    if (node.char) {
      return node.char
    }
    
    // 結合ノードで既にdisplayCharsがある場合はそれを返す
    if (node.displayChars) {
      return node.displayChars
    }
    
    // 子ノードから文字を再構築
    const leftChars = this.getNodeChars(node.left)
    const rightChars = this.getNodeChars(node.right)
    return leftChars + rightChars
  }

  buildForestSnapshot(nodes) {
    // 現在の森（複数の木）の状態をスナップショット
    return nodes.map(node => this.deepCopyNode(node))
  }

  drawProgressiveHuffmanTree(svg, stepData) {
    console.log('Drawing progressive tree for step:', stepData)
    svg.innerHTML = ''
    
    if (!stepData) {
      console.log('No step data provided')
      return
    }
    
    // 動的サイズ計算
    const dimensions = this.calculateOptimalDimensions(stepData)
    
    // SVGのサイズを動的に設定
    svg.setAttribute('width', dimensions.width)
    svg.setAttribute('height', dimensions.height)
    svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)
    
    // 親コンテナのサイズも調整
    const container = svg.parentElement
    if (container) {
      container.style.minHeight = `${dimensions.height}px`
      container.style.width = '100%'
      container.style.overflow = 'auto'
    }
    
    if (stepData.tree) {
      // 最終ステップ：完成した木を表示
      this.drawCompleteTree(svg, stepData.tree, dimensions.width, dimensions.height)
    } else if (stepData.forestNodes) {
      // 中間ステップ：森の状態を表示
      this.drawForestStage(svg, stepData.forestNodes, stepData.highlightPair, stepData.newParent, dimensions.width, dimensions.height)
    } else if (stepData.nodes) {
      // 初期ステップ：個別ノードを表示
      console.log('=== 初期ステップでノードを表示 ===')
      console.log('stepData.nodes:', stepData.nodes.map(n => n.char + '(' + n.freq + ')'))
      this.drawInitialNodesCorrectly(svg, stepData.nodes, dimensions.width, dimensions.height)
    }
  }

  calculateOptimalDimensions(stepData) {
    const nodeRadius = 30
    const minSpacing = 60
    const levelHeight = 90
    const padding = nodeRadius + 20  // ノード半径 + 余白
    
    let maxDepth = 0
    let maxWidth = 0
    
    if (stepData.tree) {
      // 完成した木の場合
      maxDepth = this.getTreeDepth(stepData.tree)
      maxWidth = this.calculateTreeWidthForDisplay(stepData.tree)
    } else if (stepData.forestNodes) {
      // 森の状態の場合
      maxDepth = Math.max(...stepData.forestNodes.map(tree => this.getTreeDepth(tree)))
      const totalWidth = stepData.forestNodes.reduce((sum, tree) => {
        return sum + this.calculateTreeWidthForDisplay(tree)
      }, 0)
      const spacingWidth = (stepData.forestNodes.length - 1) * minSpacing
      maxWidth = totalWidth + spacingWidth
    } else if (stepData.nodes) {
      // 初期ノードの場合
      maxDepth = 0
      maxWidth = stepData.nodes.length * (nodeRadius * 2 + minSpacing)
    }
    
    // 最小・最大サイズの制限
    const minWidth = 600
    const maxWidthLimit = 1200
    const minHeight = 400
    const maxHeightLimit = 800
    
    const calculatedWidth = Math.max(minWidth, Math.min(maxWidthLimit, maxWidth + padding * 2))
    const calculatedHeight = Math.max(minHeight, Math.min(maxHeightLimit, (maxDepth * levelHeight) + padding * 2 + 100))
    
    return {
      width: calculatedWidth,
      height: calculatedHeight,
      padding: padding,
      maxDepth: maxDepth
    }
  }

  calculateTreeWidthForDisplay(tree) {
    if (!tree) return 0
    
    // 葉ノードの場合
    if (!tree.left && !tree.right) {
      return 80  // ノード直径 + 最小余白
    }
    
    // 内部ノードの場合、子の幅を計算
    const leftWidth = tree.left ? this.calculateTreeWidthForDisplay(tree.left) : 0
    const rightWidth = tree.right ? this.calculateTreeWidthForDisplay(tree.right) : 0
    const minSpacing = 80
    
    return Math.max(leftWidth + rightWidth + minSpacing, 80)
  }

  drawInitialNodesCorrectly(svg, nodes, width, height) {
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
      console.error('No nodes to display!')
      return
    }
    
    console.log('=== 正しい初期ノード表示開始 ===')
    console.log('Nodes to display:', nodes.map(n => `${n.char}(${n.freq})`))
    console.log('Container size:', width, 'x', height)
    
    const nodeRadius = 30
    const minSpacing = 120  // 最小間隔を120pxに設定
    const padding = 60
    
    // 頻度の昇順でソート（E, D, C, B, A）
    const sortedNodes = [...nodes].sort((a, b) => a.freq - b.freq)
    console.log('Sorted nodes:', sortedNodes.map(n => `${n.char}(${n.freq})`))
    
    // 下部のY座標を計算
    const baseY = height - padding - nodeRadius - 20
    console.log('Base Y position:', baseY)
    
    // 必要な全体幅を計算
    const totalSpacing = (sortedNodes.length - 1) * minSpacing
    const availableWidth = width - (padding * 2)
    
    let actualSpacing = minSpacing
    let startX = padding + nodeRadius
    
    if (totalSpacing > availableWidth) {
      // 収まらない場合は間隔を調整
      actualSpacing = availableWidth / (sortedNodes.length - 1)
      console.log('Spacing adjusted to:', actualSpacing)
    } else {
      // 余裕がある場合は中央揃え
      const extraSpace = availableWidth - totalSpacing
      startX = padding + nodeRadius + (extraSpace / 2)
      console.log('Centered with extra space:', extraSpace)
    }
    
    console.log('Start X:', startX, 'Actual spacing:', actualSpacing)
    
    // 各ノードを配置して描画
    sortedNodes.forEach((node, index) => {
      const x = startX + (index * actualSpacing)
      const y = baseY
      
      console.log(`Drawing node ${node.char}(${node.freq}) at (${x.toFixed(1)}, ${y.toFixed(1)})`)
      
      // 美しいノードを描画
      this.drawBeautifulNodeWithScale(svg, node, x, y, false, false, 1)
    })
    
    console.log('=== 正しい初期ノード表示完了 ===')
  }

  drawInitialNodes(svg, nodes, width, height) {
    // 古いメソッドは新しいメソッドにリダイレクト
    this.drawInitialNodesCorrectly(svg, nodes, width, height)
  }

  drawForestStage(svg, forestNodes, highlightPair, newParent, width, height) {
    console.log('=== 森の段階表示 ===')
    console.log('Forest nodes:', forestNodes.map(tree => {
      if (tree.char) return tree.char
      return `(${tree.freq})`
    }))
    
    // 各木を個別に正しいレイアウトで描画
    const nodeRadius = 30
    const padding = 60
    const minSpacing = 150  // 木間の最小間隔
    
    // 各木の幅を計算
    const treeWidths = forestNodes.map(tree => {
      if (!tree.left && !tree.right) {
        return nodeRadius * 2 + 20  // 葉ノードの幅
      }
      return this.calculateTreeWidth(tree) || 100
    })
    
    const totalRequiredWidth = treeWidths.reduce((sum, w) => sum + w, 0) + (forestNodes.length - 1) * minSpacing
    const availableWidth = width - (padding * 2)
    
    let actualSpacing = minSpacing
    let scale = 1
    
    if (totalRequiredWidth > availableWidth) {
      scale = availableWidth / totalRequiredWidth
      scale = Math.max(scale, 0.7)  // 最小スケール
      actualSpacing = minSpacing * scale
    }
    
    let currentX = padding
    
    forestNodes.forEach((tree, index) => {
      const isHighlighted = highlightPair && (
        this.isSameNode(tree, highlightPair.left) || 
        this.isSameNode(tree, highlightPair.right)
      )
      
      // 各木を個別に描画
      const treeX = currentX + (treeWidths[index] * scale) / 2
      this.drawSubTreeFromTopWithScale(svg, tree, treeX, padding + 40, isHighlighted, scale)
      
      // 次の木の位置を計算
      currentX += (treeWidths[index] * scale) + actualSpacing
    })
    
    console.log('=== 森の段階表示完了 ===')
    
    // 新しい親ノードを点線で表示（結合予定）
    if (newParent && highlightPair) {
      const leftIndex = forestNodes.findIndex(node => this.isSameNode(node, highlightPair.left))
      const rightIndex = forestNodes.findIndex(node => this.isSameNode(node, highlightPair.right))
      
      if (leftIndex !== -1 && rightIndex !== -1) {
        const leftTree = forestNodes[leftIndex]
        const rightTree = forestNodes[rightIndex]
        
        // 実際の木の位置を再計算
        let leftX = 20 + treeWidths[0] / 2
        let rightX = 20 + treeWidths[0] / 2
        
        for (let i = 0; i < leftIndex; i++) {
          leftX += treeWidths[i] / 2 + spacing + treeWidths[i + 1] / 2
        }
        for (let i = 0; i < rightIndex; i++) {
          rightX += treeWidths[i] / 2 + spacing + treeWidths[i + 1] / 2
        }
        
        const parentX = (leftX + rightX) / 2
        
        // 左右の木の最上部を計算
        const leftDepth = this.getTreeDepth(leftTree)
        const rightDepth = this.getTreeDepth(rightTree)
        const maxDepth = Math.max(leftDepth, rightDepth)
        const parentY = baseY - (maxDepth * 80) - 80  // さらに上に親ノード配置（間隔増加）
        
        // 親ノードを描画
        this.drawTreeNode(svg, newParent, parentX, parentY, 30, true, true)
        
        // 接続線を描画（子の最上部に接続）
        const leftTopY = baseY - (leftDepth * 80)
        const rightTopY = baseY - (rightDepth * 80)
        this.drawConnection(svg, parentX, parentY + 30, leftX, leftTopY - 30, true)
        this.drawConnection(svg, parentX, parentY + 30, rightX, rightTopY - 30, true)
      }
    }
  }

  drawSubTree(svg, tree, centerX, baseY, isHighlighted = false) {
    const maxDepth = this.getTreeDepth(tree)
    const spacing = 60
    
    const drawNode = (node, x, y, level) => {
      if (!node) return
      
      const radius = 25
      this.drawTreeNode(svg, node, x, y, radius, isHighlighted)
      
      if (node.left || node.right) {
        const childSpacing = spacing / Math.pow(1.5, level)
        
        if (node.left) {
          const leftX = x - childSpacing
          const leftY = y + 70
          this.drawConnection(svg, x, y + radius, leftX, leftY - radius, isHighlighted)
          drawNode(node.left, leftX, leftY, level + 1)
        }
        
        if (node.right) {
          const rightX = x + childSpacing
          const rightY = y + 70
          this.drawConnection(svg, x, y + radius, rightX, rightY - radius, isHighlighted)
          drawNode(node.right, rightX, rightY, level + 1)
        }
      }
    }
    
    drawNode(tree, centerX, baseY, 0)
  }

  drawSubTreeFromTop(svg, tree, centerX, topY, isHighlighted = false) {
    this.drawSubTreeFromTopWithScale(svg, tree, centerX, topY, isHighlighted, 1)
  }

  drawSubTreeFromTopWithScale(svg, tree, centerX, topY, isHighlighted = false, scale = 1) {
    // SVGのサイズを取得
    const svgRect = svg.getBoundingClientRect()
    const containerWidth = parseFloat(svg.getAttribute('width')) || svgRect.width || 800
    const containerHeight = parseFloat(svg.getAttribute('height')) || svgRect.height || 500
    
    console.log('=== ハフマン木描画開始 ===')
    console.log('Container dimensions:', containerWidth, 'x', containerHeight)
    
    // 完全に新しい正しいレイアウトアルゴリズムを使用
    const nodePositions = this.calculateCorrectTreeLayout(tree, containerWidth, containerHeight, scale)
    
    // デバッグ: 座標を出力
    this.debugNodePositions(nodePositions)
    
    // 重なり検出
    this.detectNodeOverlaps(nodePositions)
    
    // 全ノードを描画
    this.drawBeautifulNodesWithScale(svg, nodePositions, isHighlighted, scale)
    
    // 美しい接続線を描画
    this.drawBeautifulConnectionsWithScale(svg, nodePositions, isHighlighted, scale)
  }

  calculateCorrectTreeLayout(tree, containerWidth, containerHeight, scale = 1) {
    if (!tree) return new Map()
    
    console.log('=== 正しいレイアウト計算開始 ===')
    
    const positions = new Map()
    const nodeRadius = 30 * scale
    const minSpacing = 150 * scale  // 最小間隔150px
    const padding = 60 * scale
    
    // 1. 葉ノードを収集
    const leafNodes = this.collectLeafNodes(tree)
    console.log('Leaf nodes found:', leafNodes.map(n => n.char || n.freq))
    
    // 2. 葉ノードを下部に横一列配置
    this.layoutLeafNodesHorizontally(leafNodes, positions, containerWidth, containerHeight, minSpacing, padding)
    
    // 3. 内部ノードを子ノードの中央上部に配置
    this.layoutInternalNodes(tree, positions, containerHeight, padding)
    
    console.log('=== レイアウト計算完了 ===')
    return positions
  }

  collectLeafNodes(tree) {
    if (!tree) return []
    
    const leafNodes = []
    
    const traverse = (node) => {
      if (!node) return
      
      // 葉ノード（子ノードがない）の場合
      if (!node.left && !node.right) {
        leafNodes.push(node)
        return
      }
      
      // 子ノードを再帰的に探索
      if (node.left) traverse(node.left)
      if (node.right) traverse(node.right)
    }
    
    traverse(tree)
    
    // 频度の昇順でソート（E, D, C, B, Aの順）
    leafNodes.sort((a, b) => a.freq - b.freq)
    
    return leafNodes
  }

  layoutLeafNodesHorizontally(leafNodes, positions, containerWidth, containerHeight, minSpacing, padding) {
    if (leafNodes.length === 0) return
    
    console.log('=== 葉ノードの横一列配置 ===')
    
    // 下部の固定位置
    const baseY = containerHeight - padding - 40  // 下から余白を取って固定
    
    // 必要な幅を計算
    const totalRequiredWidth = (leafNodes.length - 1) * minSpacing
    const availableWidth = containerWidth - (padding * 2)
    
    let actualSpacing = minSpacing
    let startX = padding
    
    if (totalRequiredWidth <= availableWidth) {
      // 余裕がある場合は中央揃えで均等配置
      const extraSpace = availableWidth - totalRequiredWidth
      startX = padding + (extraSpace / 2)
    } else {
      // 収まらない場合は間隔を調整
      actualSpacing = availableWidth / (leafNodes.length - 1)
      startX = padding
    }
    
    leafNodes.forEach((node, index) => {
      const x = startX + (index * actualSpacing)
      const y = baseY
      
      positions.set(node, { x, y, level: 'leaf' })
      console.log(`葉ノード ${node.char}(${node.freq}): (${x.toFixed(1)}, ${y.toFixed(1)})`)
    })
    
    console.log('=== 葉ノード配置完了 ===')
  }

  layoutInternalNodes(tree, positions, containerHeight, padding) {
    if (!tree) return
    
    console.log('=== 内部ノードの配置 ===')
    
    // 最大深度を計算
    const maxDepth = this.getTreeDepth(tree)
    const levelHeight = 80  // レベル間の高さ
    
    const layoutNode = (node, level = 0) => {
      if (!node) return
      
      // 葉ノードは既に配置済み
      if (!node.left && !node.right) {
        return
      }
      
      // 子ノードを先に配置
      if (node.left) layoutNode(node.left, level + 1)
      if (node.right) layoutNode(node.right, level + 1)
      
      // 子ノードの位置から親ノードの位置を計算
      const leftPos = node.left ? positions.get(node.left) : null
      const rightPos = node.right ? positions.get(node.right) : null
      
      let x, y
      
      if (leftPos && rightPos) {
        // 左右の子ノードの中央
        x = (leftPos.x + rightPos.x) / 2
        y = Math.min(leftPos.y, rightPos.y) - levelHeight
      } else if (leftPos) {
        // 左の子ノードの上
        x = leftPos.x
        y = leftPos.y - levelHeight
      } else if (rightPos) {
        // 右の子ノードの上
        x = rightPos.x
        y = rightPos.y - levelHeight
      }
      
      // 上端の制限をチェック
      y = Math.max(y, padding + 40)
      
      positions.set(node, { x, y, level: maxDepth - level - 1 })
      
      const nodeLabel = node.char || `(${node.freq})`
      console.log(`内部ノード ${nodeLabel}: (${x.toFixed(1)}, ${y.toFixed(1)}) level=${maxDepth - level - 1}`)
    }
    
    layoutNode(tree)
    console.log('=== 内部ノード配置完了 ===')
  }

  debugNodePositions(positions) {
    console.log('=== ノード座標デバッグ ===')
    positions.forEach((pos, node) => {
      const label = node.char || `(${node.freq})`
      console.log(`${label}: x=${pos.x.toFixed(1)}, y=${pos.y.toFixed(1)}, level=${pos.level}`)
    })
    console.log('=== デバッグ完了 ===')
  }

  detectNodeOverlaps(positions) {
    console.log('=== 重なり検出 ===')
    const nodeRadius = 30
    const minDistance = nodeRadius * 2 + 10  // 最小距離
    
    const posArray = Array.from(positions.entries())
    let overlapCount = 0
    
    for (let i = 0; i < posArray.length; i++) {
      for (let j = i + 1; j < posArray.length; j++) {
        const [node1, pos1] = posArray[i]
        const [node2, pos2] = posArray[j]
        
        const distance = Math.sqrt(
          Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
        )
        
        if (distance < minDistance) {
          const label1 = node1.char || `(${node1.freq})`
          const label2 = node2.char || `(${node2.freq})`
          console.warn(`重なり検出: ${label1} と ${label2} - 距離: ${distance.toFixed(1)}px (最小: ${minDistance}px)`)
          overlapCount++
        }
      }
    }
    
    if (overlapCount === 0) {
      console.log('✅ 重なりなし - 正しい配置です')
    } else {
      console.error(`⚠️ ${overlapCount}個の重なりを検出しました`)
    }
    console.log('=== 重なり検出完了 ===')
  }

  calculateBeautifulNodePositionsWithScale(tree, rootX, rootY, levelHeight, containerWidth, containerHeight, scale) {
    const positions = new Map()
    const nodeRadius = 30 * scale
    
    // 各レベルの葉の数を計算してバランスの良い配置を決定
    const getLeafCount = (node) => {
      if (!node) return 0
      if (!node.left && !node.right) return 1
      return getLeafCount(node.left) + getLeafCount(node.right)
    }
    
    const calculatePositions = (node, x, y, level, leftBound, rightBound) => {
      if (!node) return
      
      const leafCount = getLeafCount(node)
      const spacing = Math.max(100 * scale, (rightBound - leftBound) / Math.max(leafCount, 1))  // 最小間隔を増加
      
      // 境界チェック：ノードが表示領域内に収まるか確認（より保守的に）
      const safetyMargin = nodeRadius + (30 * scale)  // 安全マージンを増加
      const adjustedX = this.ensureWithinBounds(x, safetyMargin, containerWidth - safetyMargin)
      const adjustedY = this.ensureWithinBounds(y, safetyMargin, containerHeight - safetyMargin)
      
      // 現在のノード位置を設定
      positions.set(node, { x: adjustedX, y: adjustedY, level, leafCount })
      
      if (node.left || node.right) {
        const leftLeafCount = getLeafCount(node.left)
        const rightLeafCount = getLeafCount(node.right)
        
        if (node.left) {
          const leftX = adjustedX - (spacing * rightLeafCount / 2)
          const leftY = adjustedY + levelHeight
          calculatePositions(node.left, leftX, leftY, level + 1, leftBound, adjustedX)
        }
        
        if (node.right) {
          const rightX = adjustedX + (spacing * leftLeafCount / 2)
          const rightY = adjustedY + levelHeight
          calculatePositions(node.right, rightX, rightY, level + 1, adjustedX, rightBound)
        }
      }
    }
    
    // 初期計算範囲を設定（より大きなパディングを考慮）
    const padding = nodeRadius + (40 * scale)  // パディングを増加
    const availableWidth = containerWidth - (padding * 2)
    const startX = containerWidth / 2
    const startY = Math.max(padding, rootY)
    
    calculatePositions(tree, startX, startY, 0, padding, containerWidth - padding)
    
    return positions
  }

  drawBeautifulNodesWithScale(svg, positions, isHighlighted, scale) {
    positions.forEach((pos, node) => {
      this.drawBeautifulNodeWithScale(svg, node, pos.x, pos.y, isHighlighted, false, scale)
    })
  }

  drawBeautifulConnectionsWithScale(svg, positions, isHighlighted, scale) {
    positions.forEach((pos, node) => {
      if (node.left) {
        const parentPos = positions.get(node)
        const childPos = positions.get(node.left)
        this.drawBeautifulConnectionWithScale(svg, parentPos.x, parentPos.y, childPos.x, childPos.y, isHighlighted, '0', scale)
      }
      if (node.right) {
        const parentPos = positions.get(node)
        const childPos = positions.get(node.right)
        this.drawBeautifulConnectionWithScale(svg, parentPos.x, parentPos.y, childPos.x, childPos.y, isHighlighted, '1', scale)
      }
    })
  }

  calculateBeautifulNodePositions(tree, rootX, rootY, levelHeight, containerWidth, containerHeight) {
    const positions = new Map()
    const nodeRadius = 30
    
    // 各レベルの葉の数を計算してバランスの良い配置を決定
    const getLeafCount = (node) => {
      if (!node) return 0
      if (!node.left && !node.right) return 1
      return getLeafCount(node.left) + getLeafCount(node.right)
    }
    
    const calculatePositions = (node, x, y, level, leftBound, rightBound) => {
      if (!node) return
      
      const leafCount = getLeafCount(node)
      const spacing = Math.max(100, (rightBound - leftBound) / Math.max(leafCount, 1))  // 最小間隔を増加
      
      // 境界チェック：ノードが表示領域内に収まるか確認（より保守的に）
      const safetyMargin = nodeRadius + 30  // 安全マージンを増加
      const adjustedX = this.ensureWithinBounds(x, safetyMargin, containerWidth - safetyMargin)
      const adjustedY = this.ensureWithinBounds(y, safetyMargin, containerHeight - safetyMargin)
      
      // 現在のノード位置を設定
      positions.set(node, { x: adjustedX, y: adjustedY, level, leafCount })
      
      if (node.left || node.right) {
        const leftLeafCount = getLeafCount(node.left)
        const rightLeafCount = getLeafCount(node.right)
        
        if (node.left) {
          const leftX = adjustedX - (spacing * rightLeafCount / 2)
          const leftY = adjustedY + levelHeight
          calculatePositions(node.left, leftX, leftY, level + 1, leftBound, adjustedX)
        }
        
        if (node.right) {
          const rightX = adjustedX + (spacing * leftLeafCount / 2)
          const rightY = adjustedY + levelHeight
          calculatePositions(node.right, rightX, rightY, level + 1, adjustedX, rightBound)
        }
      }
    }
    
    // 初期計算範囲を設定（より大きなパディングを考慮）
    const padding = nodeRadius + 40  // パディングを増加
    const availableWidth = containerWidth - (padding * 2)
    const startX = containerWidth / 2
    const startY = Math.max(padding, rootY)
    
    calculatePositions(tree, startX, startY, 0, padding, containerWidth - padding)
    
    // 全体の境界チェックとスケール調整
    return this.validateAndAdjustPositions(positions, containerWidth, containerHeight, nodeRadius)
  }

  ensureWithinBounds(value, minBound, maxBound) {
    return Math.max(minBound, Math.min(maxBound, value))
  }

  validateAndAdjustPositions(positions, containerWidth, containerHeight, nodeRadius) {
    // 全ノードの境界を計算
    let minX = Infinity, maxX = -Infinity
    let minY = Infinity, maxY = -Infinity
    
    positions.forEach((pos) => {
      minX = Math.min(minX, pos.x - nodeRadius)
      maxX = Math.max(maxX, pos.x + nodeRadius)
      minY = Math.min(minY, pos.y - nodeRadius)
      maxY = Math.max(maxY, pos.y + nodeRadius)
    })
    
    const actualWidth = maxX - minX
    const actualHeight = maxY - minY
    const padding = 50  // パディングを大幅に増加
    
    // はみ出しチェック（より保守的に）
    if (actualWidth > containerWidth - padding * 2 || actualHeight > containerHeight - padding * 2) {
      // スケール調整が必要
      const scaleX = (containerWidth - padding * 2) / actualWidth
      const scaleY = (containerHeight - padding * 2) / actualHeight
      const scale = Math.min(scaleX, scaleY, 0.9)  // 最大スケール0.9に制限してより安全に
      
      const centerX = containerWidth / 2
      const centerY = containerHeight / 2
      const originalCenterX = (minX + maxX) / 2
      const originalCenterY = (minY + maxY) / 2
      
      // スケール調整と中央寄せ
      positions.forEach((pos, node) => {
        pos.x = centerX + (pos.x - originalCenterX) * scale
        pos.y = centerY + (pos.y - originalCenterY) * scale
      })
      
      console.log(`Tree scaled to ${(scale * 100).toFixed(1)}% to fit container`)
    }
    
    return positions
  }

  drawBeautifulNodes(svg, positions, isHighlighted) {
    positions.forEach((pos, node) => {
      this.drawBeautifulNode(svg, node, pos.x, pos.y, isHighlighted)
    })
  }

  drawBeautifulConnections(svg, positions, isHighlighted) {
    positions.forEach((pos, node) => {
      if (node.left) {
        const parentPos = positions.get(node)
        const childPos = positions.get(node.left)
        this.drawBeautifulConnection(svg, parentPos.x, parentPos.y, childPos.x, childPos.y, isHighlighted, '0')
      }
      if (node.right) {
        const parentPos = positions.get(node)
        const childPos = positions.get(node.right)
        this.drawBeautifulConnection(svg, parentPos.x, parentPos.y, childPos.x, childPos.y, isHighlighted, '1')
      }
    })
  }

  drawBeautifulConnectionWithScale(svg, x1, y1, x2, y2, isHighlighted, bitLabel, scale = 1) {
    const radius = 30 * scale  // ノードの半径（スケール適用）
    
    // ベジェ曲線の制御点を計算
    const controlY = y1 + (y2 - y1) * 0.6  // 曲線の深さ
    const controlX1 = x1
    const controlX2 = x2
    
    // SVGパス要素を作成
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const pathData = `M ${x1} ${y1 + radius} Q ${controlX1} ${controlY} ${x2} ${y2 - radius}`
    
    path.setAttribute('d', pathData)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', isHighlighted ? '#ef4444' : '#6b7280')
    path.setAttribute('stroke-width', isHighlighted ? '3' : '2.5')
    path.setAttribute('stroke-linecap', 'round')
    path.setAttribute('opacity', '0.8')
    
    // グラデーション効果
    if (!isHighlighted) {
      path.setAttribute('stroke', '#4f46e5')
      path.setAttribute('opacity', '0.7')
    }
    
    svg.appendChild(path)
    
    // ビットラベル（0/1）を美しく配置（スケール適用）
    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2 - (10 * scale)
    
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    label.setAttribute('x', midX)
    label.setAttribute('y', midY)
    label.setAttribute('text-anchor', 'middle')
    label.setAttribute('font-family', 'Inter, sans-serif')
    label.setAttribute('font-size', Math.max(10, 14 * scale))
    label.setAttribute('font-weight', '600')
    label.setAttribute('fill', bitLabel === '0' ? '#dc2626' : '#16a34a')
    label.textContent = bitLabel
    
    // ラベルの背景円（スケール適用）
    const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    labelBg.setAttribute('cx', midX)
    labelBg.setAttribute('cy', midY - (5 * scale))
    labelBg.setAttribute('r', Math.max(8, 12 * scale))
    labelBg.setAttribute('fill', 'white')
    labelBg.setAttribute('stroke', bitLabel === '0' ? '#dc2626' : '#16a34a')
    labelBg.setAttribute('stroke-width', Math.max(1, 1.5 * scale))
    labelBg.setAttribute('opacity', '0.95')
    
    svg.appendChild(labelBg)
    svg.appendChild(label)
  }

  calculateTreeWidth(tree, level = 0) {
    if (!tree) return 0
    
    // 葉ノードの場合
    if (!tree.left && !tree.right) {
      return 60  // ノード直径 + マージン
    }
    
    // 内部ノードの場合、子の幅を再帰的に計算
    const baseSpacing = 80
    const actualSpacing = Math.max(baseSpacing / Math.pow(1.3, level), 40) * 2  // 左右の合計
    const leftWidth = tree.left ? this.calculateTreeWidth(tree.left, level + 1) : 0
    const rightWidth = tree.right ? this.calculateTreeWidth(tree.right, level + 1) : 0
    
    return Math.max(leftWidth + rightWidth + actualSpacing, 60)
  }

  drawCompleteTree(svg, tree, width, height) {
    console.log('=== 完成したハフマン木を表示 ===')
    
    // 新しい正しいレイアウトアルゴリズムで描画
    this.drawSubTreeFromTopWithScale(svg, tree, width / 2, 0, false, 1)
    
    console.log('=== 完成した木の表示完了 ===')
  }

  drawBeautifulNodeWithScale(svg, node, x, y, isHighlighted = false, isDashed = false, scale = 1) {
    const radius = 30 * scale
    
    // グラデーション定義を作成
    const defs = svg.querySelector('defs') || svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'defs'))
    
    // 葉ノード用グラデーション
    if (!defs.querySelector('#leafGradient')) {
      const leafGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
      leafGradient.setAttribute('id', 'leafGradient')
      leafGradient.setAttribute('x1', '0%')
      leafGradient.setAttribute('y1', '0%')
      leafGradient.setAttribute('x2', '100%')
      leafGradient.setAttribute('y2', '100%')
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
      stop1.setAttribute('offset', '0%')
      stop1.setAttribute('stop-color', '#60a5fa')
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
      stop2.setAttribute('offset', '100%')
      stop2.setAttribute('stop-color', '#3b82f6')
      
      leafGradient.appendChild(stop1)
      leafGradient.appendChild(stop2)
      defs.appendChild(leafGradient)
    }
    
    // 内部ノード用グラデーション
    if (!defs.querySelector('#internalGradient')) {
      const internalGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
      internalGradient.setAttribute('id', 'internalGradient')
      internalGradient.setAttribute('x1', '0%')
      internalGradient.setAttribute('y1', '0%')
      internalGradient.setAttribute('x2', '100%')
      internalGradient.setAttribute('y2', '100%')
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
      stop1.setAttribute('offset', '0%')
      stop1.setAttribute('stop-color', '#f3f4f6')
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
      stop2.setAttribute('offset', '100%')
      stop2.setAttribute('stop-color', '#d1d5db')
      
      internalGradient.appendChild(stop1)
      internalGradient.appendChild(stop2)
      defs.appendChild(internalGradient)
    }
    
    // ハイライト用グラデーション
    if (!defs.querySelector('#highlightGradient')) {
      const highlightGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
      highlightGradient.setAttribute('id', 'highlightGradient')
      highlightGradient.setAttribute('x1', '0%')
      highlightGradient.setAttribute('y1', '0%')
      highlightGradient.setAttribute('x2', '100%')
      highlightGradient.setAttribute('y2', '100%')
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
      stop1.setAttribute('offset', '0%')
      stop1.setAttribute('stop-color', '#fca5a5')
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
      stop2.setAttribute('offset', '100%')
      stop2.setAttribute('stop-color', '#ef4444')
      
      highlightGradient.appendChild(stop1)
      highlightGradient.appendChild(stop2)
      defs.appendChild(highlightGradient)
    }
    
    // 影効果
    const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    shadow.setAttribute('cx', x + 3)
    shadow.setAttribute('cy', y + 3)
    shadow.setAttribute('r', radius)
    shadow.setAttribute('fill', 'rgba(0, 0, 0, 0.2)')
    shadow.setAttribute('opacity', '0.6')
    svg.appendChild(shadow)
    
    // メインノード円
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', x)
    circle.setAttribute('cy', y)
    circle.setAttribute('r', radius)
    
    if (isHighlighted) {
      circle.setAttribute('fill', 'url(#highlightGradient)')
    } else if (node.char) {
      circle.setAttribute('fill', 'url(#leafGradient)')
    } else {
      circle.setAttribute('fill', 'url(#internalGradient)')
    }
    
    circle.setAttribute('stroke', isHighlighted ? '#dc2626' : '#6b7280')
    circle.setAttribute('stroke-width', isHighlighted ? '3' : '2')
    circle.setAttribute('filter', 'url(#dropShadow)')
    
    if (isDashed) {
      circle.setAttribute('stroke-dasharray', '8,4')
      circle.setAttribute('opacity', '0.8')
    }
    
    // ホバー効果のクラスを追加
    circle.setAttribute('class', 'huffman-node-beautiful')
    
    svg.appendChild(circle)
    
    // ノードラベルを美しく描画
    this.drawBeautifulNodeLabel(svg, x, y, node)
    
    // ハイライト効果
    if (isHighlighted) {
      const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      highlight.setAttribute('cx', x)
      highlight.setAttribute('cy', y)
      highlight.setAttribute('r', radius + 8)
      highlight.setAttribute('fill', 'none')
      highlight.setAttribute('stroke', '#ef4444')
      highlight.setAttribute('stroke-width', '3')
      highlight.setAttribute('opacity', '0.6')
      highlight.setAttribute('stroke-dasharray', '10,5')
      
      // アニメーション効果
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform')
      animate.setAttribute('attributeName', 'transform')
      animate.setAttribute('type', 'rotate')
      animate.setAttribute('values', '0 ' + x + ' ' + y + ';360 ' + x + ' ' + y)
      animate.setAttribute('dur', '3s')
      animate.setAttribute('repeatCount', 'indefinite')
      
      highlight.appendChild(animate)
      svg.appendChild(highlight)
    }
  }

  drawBeautifulNodeLabel(svg, x, y, node) {
    const isLeaf = !!node.char
    
    if (isLeaf) {
      // 葉ノードのラベル
      const charLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      charLabel.setAttribute('x', x)
      charLabel.setAttribute('y', y - 5)
      charLabel.setAttribute('text-anchor', 'middle')
      charLabel.setAttribute('font-family', 'Inter, sans-serif')
      charLabel.setAttribute('font-size', '16')
      charLabel.setAttribute('font-weight', '700')
      charLabel.setAttribute('fill', 'white')
      charLabel.textContent = node.char
      
      const freqLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      freqLabel.setAttribute('x', x)
      freqLabel.setAttribute('y', y + 10)
      freqLabel.setAttribute('text-anchor', 'middle')
      freqLabel.setAttribute('font-family', 'Inter, sans-serif')
      freqLabel.setAttribute('font-size', '12')
      freqLabel.setAttribute('font-weight', '600')
      freqLabel.setAttribute('fill', 'white')
      freqLabel.textContent = node.freq
      
      svg.appendChild(charLabel)
      svg.appendChild(freqLabel)
    } else {
      // 内部ノードのラベル
      const chars = this.getNodeChars(node)
      const charLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      charLabel.setAttribute('x', x)
      charLabel.setAttribute('y', y - 5)
      charLabel.setAttribute('text-anchor', 'middle')
      charLabel.setAttribute('font-family', 'Inter, sans-serif')
      charLabel.setAttribute('font-size', '14')
      charLabel.setAttribute('font-weight', '600')
      charLabel.setAttribute('fill', '#374151')
      charLabel.textContent = chars
      
      const freqLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      freqLabel.setAttribute('x', x)
      freqLabel.setAttribute('y', y + 10)
      freqLabel.setAttribute('text-anchor', 'middle')
      freqLabel.setAttribute('font-family', 'Inter, sans-serif')
      freqLabel.setAttribute('font-size', '12')
      freqLabel.setAttribute('font-weight', '600')
      freqLabel.setAttribute('fill', '#6b7280')
      freqLabel.textContent = node.freq
      
      svg.appendChild(charLabel)
      svg.appendChild(freqLabel)
    }
  }

  drawBeautifulNode(svg, node, x, y, isHighlighted = false, isDashed = false) {
    this.drawBeautifulNodeWithScale(svg, node, x, y, isHighlighted, isDashed, 1)
  }

  drawBeautifulConnection(svg, x1, y1, x2, y2, isHighlighted, bitLabel) {
    this.drawBeautifulConnectionWithScale(svg, x1, y1, x2, y2, isHighlighted, bitLabel, 1)
  }

  drawTreeNode(svg, node, x, y, radius, isHighlighted = false, isDashed = false) {
    // 新しい美しいノード描画メソッドを使用
    this.drawBeautifulNode(svg, node, x, y, isHighlighted, isDashed)
  }

  drawConnection(svg, x1, y1, x2, y2, isHighlighted = false) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', x1)
    line.setAttribute('y1', y1)
    line.setAttribute('x2', x2)
    line.setAttribute('y2', y2)
    line.setAttribute('stroke', isHighlighted ? '#ef4444' : '#374151')
    line.setAttribute('stroke-width', isHighlighted ? '3' : '2')
    svg.appendChild(line)
  }

  getTreeDepth(node, depth = 0) {
    if (!node) return depth
    if (!node.left && !node.right) return depth
    
    const leftDepth = node.left ? this.getTreeDepth(node.left, depth + 1) : depth
    const rightDepth = node.right ? this.getTreeDepth(node.right, depth + 1) : depth
    return Math.max(leftDepth, rightDepth)
  }

  isSameNode(node1, node2) {
    if (!node1 || !node2) return false
    return node1.char === node2.char && node1.freq === node2.freq
  }

  updateCodeTable() {
    console.log('=== updateCodeTable called ===')
    console.log('this.huffmanCodes:', this.huffmanCodes)
    
    const tableBody = document.getElementById('code-table-body')
    if (!tableBody) {
      console.warn('code-table-body element not found')
      return
    }
    
    // ハフマン符号が正しく生成されているかチェック
    if (!this.huffmanCodes || typeof this.huffmanCodes !== 'object') {
      console.warn('huffmanCodes is not a valid object:', this.huffmanCodes)
      tableBody.innerHTML = '<tr><td colspan="4" class="px-3 py-2 text-center text-gray-500">ハフマン符号が生成されていません</td></tr>'
      return
    }
    
    try {
      const entries = Object.entries(this.huffmanCodes)
      console.log('Object.entries result:', entries)
      
      if (!Array.isArray(entries)) {
        throw new Error('Object.entries did not return an array')
      }
      
      if (entries.length === 0) {
        console.warn('huffmanCodes is empty')
        tableBody.innerHTML = '<tr><td colspan="4" class="px-3 py-2 text-center text-gray-500">符号化する文字がありません</td></tr>'
        return
      }
      
      tableBody.innerHTML = ''
      
      // 頻度データを事前に収集
      const frequencies = {}
      try {
        const characters = ['a', 'b', 'c', 'd', 'e']
        characters.forEach(c => {
          const input = document.getElementById(`freq-${c}`)
          if (input) {
            frequencies[c.toUpperCase()] = parseInt(input.value) || 0
          }
        })
        console.log('Collected frequencies for table:', frequencies)
      } catch (freqError) {
        console.error('Error collecting frequencies:', freqError)
      }
      
      entries
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([char, code]) => {
          try {
            console.log(`Creating row for: ${char} = ${code}`)
            
            const row = document.createElement('tr')
            row.innerHTML = `
              <td class="px-3 py-2 font-mono font-bold">${char}</td>
              <td class="px-3 py-2">${frequencies[char] || 0}%</td>
              <td class="px-3 py-2 font-mono text-blue-600">${code}</td>
              <td class="px-3 py-2">${code.length}ビット</td>
            `
            tableBody.appendChild(row)
          } catch (rowError) {
            console.error(`Error creating row for ${char}:`, rowError)
          }
        })
      
      console.log('Code table updated successfully')
    } catch (error) {
      console.error('Error in updateCodeTable:', error)
      tableBody.innerHTML = '<tr><td colspan="4" class="px-3 py-2 text-center text-red-500">符号表の更新中にエラーが発生しました</td></tr>'
    }
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
      // 新しい段階的木構造表示を使用
      this.drawProgressiveHuffmanTree(svg, currentStep)
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
      
      // ノードラベル - パターン1: 文字\n頻度の縦配置
      this.drawNodeLabel(svg, x, nodeY, node)
      
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

  drawNodeLabel(svg, x, y, node) {
    // ノードの表示文字列を決定
    let displayText
    if (node.char) {
      // 葉ノード: 文字のみ
      displayText = node.char
    } else if (node.displayChars) {
      // 結合ノード: 結合された文字列
      displayText = node.displayChars
    } else {
      // フォールバック
      displayText = '?'
    }
    
    // 文字列が長い場合は調整
    if (displayText.length > 4) {
      displayText = displayText.substring(0, 3) + '…'
    }
    
    const isLeaf = !!node.char
    const textColor = isLeaf ? 'white' : 'black'
    const fontSize = Math.max(8, Math.min(12, 24 / displayText.length))
    
    // 文字ラベル（上部）
    const charText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    charText.setAttribute('x', x)
    charText.setAttribute('y', y - 3)
    charText.setAttribute('text-anchor', 'middle')
    charText.setAttribute('font-size', fontSize)
    charText.setAttribute('font-weight', 'bold')
    charText.setAttribute('fill', textColor)
    charText.textContent = displayText
    svg.appendChild(charText)
    
    // 頻度ラベル（下部）
    const freqText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    freqText.setAttribute('x', x)
    freqText.setAttribute('y', y + 8)
    freqText.setAttribute('text-anchor', 'middle')
    freqText.setAttribute('font-size', '10')
    freqText.setAttribute('font-weight', 'normal')
    freqText.setAttribute('fill', textColor)
    freqText.textContent = node.freq + '%'
    svg.appendChild(freqText)
  }

  drawNodesOnly(svg, nodes) {
    console.log('Drawing individual nodes:', nodes)
    svg.innerHTML = ''
    
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
      console.log('No nodes to draw')
      return
    }
    
    // SVGのサイズを設定
    svg.setAttribute('width', '800')
    svg.setAttribute('height', '400')
    svg.setAttribute('viewBox', '0 0 800 400')
    const width = 800
    const height = 400
    
    // ノードを水平に配置
    const spacing = Math.min(100, width / (nodes.length + 1))
    const startX = (width - (nodes.length - 1) * spacing) / 2
    const y = height / 2
    const radius = 25
    
    nodes.forEach((node, index) => {
      const x = startX + index * spacing
      
      // ノードを描画
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', x)
      circle.setAttribute('cy', y)
      circle.setAttribute('r', radius)
      circle.setAttribute('fill', '#3b82f6')
      circle.setAttribute('stroke', '#374151')
      circle.setAttribute('stroke-width', '2')
      svg.appendChild(circle)
      
      // 統一されたノードラベル表示
      this.drawNodeLabel(svg, x, y, node)
    })
    
    console.log('Individual nodes drawn successfully')
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