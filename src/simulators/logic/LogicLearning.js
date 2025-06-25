export class LogicLearning {
  constructor() {
    this.currentSection = 'basic'
    this.truthTable = {}
    this.logicExpression = ''
    this.variables = ['A', 'B']
    this.maxVariables = 4
    this.currentExpression = ''
  }

  render(container) {
    container.innerHTML = `
      <div class="simulator-container">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">⚡ 論理回路学習</h1>
          <p class="text-gray-600">論理式・真理値表・回路図の総合的な学習環境</p>
        </div>

        <!-- タブナビゲーション -->
        <div class="card mb-8">
          <div class="flex flex-wrap justify-center gap-2 mb-6">
            <button class="logic-tab-btn active" data-tab="basic">基本論理演算</button>
            <button class="logic-tab-btn" data-tab="truth-table">真理値表・回路図</button>
            <button class="logic-tab-btn" data-tab="expression">論理式変換</button>
          </div>
        </div>

        <!-- 基本論理演算セクション -->
        <section id="basic-section" class="logic-section active">
          <div class="card mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">基本論理演算</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- 論理ゲート説明 -->
              <div class="space-y-6">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h3 class="text-lg font-semibold text-blue-800 mb-3">AND ゲート (論理積)</h3>
                  <p class="text-blue-700 mb-3">全ての入力が1の時のみ出力が1</p>
                  <div class="bg-white p-3 rounded border">
                    <div class="font-mono text-sm">
                      A = 1, B = 1 → Y = 1<br>
                      A = 0, B = 1 → Y = 0<br>
                      A = 1, B = 0 → Y = 0<br>
                      A = 0, B = 0 → Y = 0
                    </div>
                  </div>
                </div>

                <div class="bg-green-50 p-4 rounded-lg">
                  <h3 class="text-lg font-semibold text-green-800 mb-3">OR ゲート (論理和)</h3>
                  <p class="text-green-700 mb-3">少なくとも1つの入力が1の時出力が1</p>
                  <div class="bg-white p-3 rounded border">
                    <div class="font-mono text-sm">
                      A = 1, B = 1 → Y = 1<br>
                      A = 0, B = 1 → Y = 1<br>
                      A = 1, B = 0 → Y = 1<br>
                      A = 0, B = 0 → Y = 0
                    </div>
                  </div>
                </div>

                <div class="bg-red-50 p-4 rounded-lg">
                  <h3 class="text-lg font-semibold text-red-800 mb-3">NOT ゲート (否定)</h3>
                  <p class="text-red-700 mb-3">入力を反転させる</p>
                  <div class="bg-white p-3 rounded border">
                    <div class="font-mono text-sm">
                      A = 1 → Y = 0<br>
                      A = 0 → Y = 1
                    </div>
                  </div>
                </div>
              </div>

              <!-- インタラクティブ計算機 -->
              <div class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-lg">
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">論理演算計算機</h3>
                  
                  <div class="space-y-4">
                    <div class="flex items-center space-x-4">
                      <label class="text-sm font-medium">A:</label>
                      <button id="input-a" class="logic-input-btn">0</button>
                      <label class="text-sm font-medium">B:</label>
                      <button id="input-b" class="logic-input-btn">0</button>
                    </div>

                    <div class="grid grid-cols-1 gap-3">
                      <div class="flex justify-between items-center p-3 bg-white rounded border">
                        <span class="font-mono">A AND B =</span>
                        <span id="result-and" class="font-mono font-bold text-blue-600">0</span>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-white rounded border">
                        <span class="font-mono">A OR B =</span>
                        <span id="result-or" class="font-mono font-bold text-green-600">0</span>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-white rounded border">
                        <span class="font-mono">NOT A =</span>
                        <span id="result-not-a" class="font-mono font-bold text-red-600">1</span>
                      </div>
                      <div class="flex justify-between items-center p-3 bg-white rounded border">
                        <span class="font-mono">A XOR B =</span>
                        <span id="result-xor" class="font-mono font-bold text-purple-600">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 真理値表・回路図セクション -->
        <section id="truth-table-section" class="logic-section">
          <div class="card mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">論理式入力・真理値表・回路図</h2>
            
            <!-- 論理式入力エリア -->
            <div class="mb-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- 左側：論理式入力 -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">変数の数</label>
                    <select id="variable-count" class="w-full p-2 border border-gray-300 rounded-md">
                      <option value="2" selected>2変数 (A, B)</option>
                      <option value="3">3変数 (A, B, C)</option>
                      <option value="4">4変数 (A, B, C, D)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">論理式</label>
                    <div id="logic-expression-display" class="w-full p-3 min-h-12 border border-gray-300 rounded-md bg-gray-50 font-mono text-lg">
                      <!-- 論理式がここに表示される -->
                    </div>
                  </div>
                  
                  <div class="flex gap-2">
                    <button id="clear-expression" class="btn-secondary text-sm">クリア</button>
                    <button id="generate-table" class="btn-primary flex-1">真理値表・回路図を生成</button>
                  </div>
                </div>

                <!-- 右側：ボタン入力パネル -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-800">論理式ボタン入力</h3>
                  
                  <!-- 変数ボタン -->
                  <div class="space-y-2">
                    <div class="text-sm font-medium text-gray-700">変数:</div>
                    <div id="variable-buttons" class="flex flex-wrap gap-2">
                      <button class="logic-btn variable-btn" data-value="A">A</button>
                      <button class="logic-btn variable-btn" data-value="B">B</button>
                    </div>
                  </div>
                  
                  <!-- 論理演算子ボタン -->
                  <div class="space-y-2">
                    <div class="text-sm font-medium text-gray-700">演算子:</div>
                    <div class="grid grid-cols-2 gap-2">
                      <button class="logic-btn operator-btn gate-and" data-value=" AND ">AND</button>
                      <button class="logic-btn operator-btn gate-or" data-value=" OR ">OR</button>
                      <button class="logic-btn operator-btn gate-not" data-value="NOT ">NOT</button>
                      <button class="logic-btn operator-btn gate-xor" data-value=" XOR ">XOR</button>
                    </div>
                  </div>
                  
                  <!-- 括弧ボタン -->
                  <div class="space-y-2">
                    <div class="text-sm font-medium text-gray-700">括弧:</div>
                    <div class="flex gap-2">
                      <button class="logic-btn bracket-btn" data-value="(">(</button>
                      <button class="logic-btn bracket-btn" data-value=")">)</button>
                    </div>
                  </div>
                  
                  <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div class="text-sm text-blue-800">
                      <strong>使い方:</strong><br>
                      1. 変数ボタンで変数を選択<br>
                      2. 演算子ボタンで論理演算を追加<br>
                      3. 括弧で優先順位を指定<br>
                      4. 「生成」ボタンで結果を表示
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 結果表示エリア -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <!-- 真理値表 -->
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">真理値表</h3>
                <div id="truth-table-display" class="bg-gray-50 p-4 rounded-lg min-h-48">
                  <div class="text-center text-gray-500">
                    論理式を入力して「真理値表・回路図を生成」をクリックしてください
                  </div>
                </div>
              </div>
              
              <!-- 回路図 -->
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">論理回路図</h3>
                <div id="circuit-display" class="bg-gray-50 p-4 rounded-lg min-h-48">
                  <div class="text-center text-gray-500">
                    論理式を入力すると回路図が表示されます
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 論理式変換セクション -->
        <section id="expression-section" class="logic-section">
          <div class="card mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">論理式変換</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">元の論理式</label>
                  <input type="text" id="original-expression" placeholder="例: (A AND B) OR (NOT C)" 
                         class="w-full p-2 border border-gray-300 rounded-md">
                </div>
                
                <button id="convert-expression" class="btn-primary w-full">変換・簡素化</button>
                
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800 mb-2">ド・モルガンの法則</h4>
                  <div class="text-sm text-blue-700 space-y-1">
                    <div>NOT(A AND B) = (NOT A) OR (NOT B)</div>
                    <div>NOT(A OR B) = (NOT A) AND (NOT B)</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">変換結果</h3>
                <div id="conversion-result" class="bg-gray-50 p-4 rounded-lg min-h-48">
                  <div class="text-center text-gray-500">
                    論理式を入力して変換してください
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    `

    this.setupEventListeners()
    this.updateLogicCalculator()
  }

  setupEventListeners() {
    // タブ切り替え
    document.querySelectorAll('.logic-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab
        this.switchTab(tab)
      })
    })

    // 論理計算機の入力ボタン
    const inputA = document.getElementById('input-a')
    const inputB = document.getElementById('input-b')
    
    if (inputA) {
      inputA.addEventListener('click', () => {
        inputA.textContent = inputA.textContent === '0' ? '1' : '0'
        this.updateLogicCalculator()
      })
    }
    
    if (inputB) {
      inputB.addEventListener('click', () => {
        inputB.textContent = inputB.textContent === '0' ? '1' : '0'
        this.updateLogicCalculator()
      })
    }

    // 変数の数が変更されたときの処理
    const variableCount = document.getElementById('variable-count')
    if (variableCount) {
      variableCount.addEventListener('change', () => {
        this.updateVariableButtons()
      })
    }

    // 論理式ボタン入力
    this.setupLogicButtons()

    // 真理値表・回路図生成
    const generateBtn = document.getElementById('generate-table')
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        this.generateTruthTableAndCircuit()
      })
    }

    // 論理式クリア
    const clearBtn = document.getElementById('clear-expression')
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearExpression()
      })
    }

    // 論理式変換
    const convertBtn = document.getElementById('convert-expression')
    if (convertBtn) {
      convertBtn.addEventListener('click', () => {
        this.convertExpression()
      })
    }

    // 初期状態で変数ボタンを更新
    this.updateVariableButtons()
  }

  setupLogicButtons() {
    // 全ての論理式ボタンにイベントリスナーを追加
    document.querySelectorAll('.logic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.value
        this.addToExpression(value)
      })
    })
  }

  updateVariableButtons() {
    const variableCount = parseInt(document.getElementById('variable-count')?.value || '2')
    const variableButtonsContainer = document.getElementById('variable-buttons')
    
    if (variableButtonsContainer) {
      const variables = ['A', 'B', 'C', 'D'].slice(0, variableCount)
      variableButtonsContainer.innerHTML = variables.map(variable => 
        `<button class="logic-btn variable-btn" data-value="${variable}">${variable}</button>`
      ).join('')
      
      // 新しいボタンにイベントリスナーを追加
      variableButtonsContainer.querySelectorAll('.logic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const value = btn.dataset.value
          this.addToExpression(value)
        })
      })
    }
  }

  addToExpression(value) {
    this.currentExpression += value
    this.updateExpressionDisplay()
  }

  clearExpression() {
    this.currentExpression = ''
    this.updateExpressionDisplay()
  }

  updateExpressionDisplay() {
    const display = document.getElementById('logic-expression-display')
    if (display) {
      display.textContent = this.currentExpression || '（論理式をボタンで入力してください）'
    }
  }

  switchTab(tab) {
    // タブボタンの状態更新
    document.querySelectorAll('.logic-tab-btn').forEach(btn => {
      btn.classList.remove('active')
    })
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active')

    // セクションの表示切り替え
    document.querySelectorAll('.logic-section').forEach(section => {
      section.classList.remove('active')
    })
    document.getElementById(`${tab}-section`).classList.add('active')

    this.currentSection = tab
  }

  updateLogicCalculator() {
    const a = document.getElementById('input-a')?.textContent === '1'
    const b = document.getElementById('input-b')?.textContent === '1'

    // 結果を計算
    const resultAnd = a && b
    const resultOr = a || b
    const resultNotA = !a
    const resultXor = a !== b

    // 結果を表示
    const elements = {
      'result-and': resultAnd ? '1' : '0',
      'result-or': resultOr ? '1' : '0',
      'result-not-a': resultNotA ? '1' : '0',
      'result-xor': resultXor ? '1' : '0'
    }

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id)
      if (element) {
        element.textContent = value
      }
    })
  }

  generateTruthTableAndCircuit() {
    const variableCount = parseInt(document.getElementById('variable-count')?.value || '2')
    const expression = this.currentExpression.trim()
    
    if (!expression) {
      alert('論理式をボタンで入力してください')
      return
    }

    try {
      // 真理値表を生成
      const table = this.createTruthTable(variableCount, expression)
      this.displayTruthTable(table, variableCount)
      
      // 回路図を生成
      this.displayCircuitDiagram(expression)
    } catch (error) {
      document.getElementById('truth-table-display').innerHTML = `
        <div class="text-red-600 text-center">
          <div class="text-lg mb-2">⚠️ エラー</div>
          <div class="text-sm">${error.message}</div>
        </div>
      `
      document.getElementById('circuit-display').innerHTML = `
        <div class="text-red-600 text-center">
          <div class="text-lg mb-2">⚠️ エラー</div>
          <div class="text-sm">回路図を生成できませんでした</div>
        </div>
      `
    }
  }

  createTruthTable(variableCount, expression) {
    const variables = ['A', 'B', 'C', 'D'].slice(0, variableCount)
    const rows = Math.pow(2, variableCount)
    const table = []

    for (let i = 0; i < rows; i++) {
      const row = {}
      
      // 各変数の値を設定
      for (let j = 0; j < variableCount; j++) {
        const variable = variables[j]
        row[variable] = (i >> (variableCount - 1 - j)) & 1
      }
      
      // 論理式を評価
      try {
        row.result = this.evaluateExpression(expression, row)
      } catch (error) {
        throw new Error(`論理式の評価エラー: ${error.message}`)
      }
      
      table.push(row)
    }

    return { variables, table }
  }

  evaluateExpression(expression, values) {
    // 簡単な論理式パーサー
    let expr = expression.toUpperCase()
    
    // 変数を値に置換
    Object.entries(values).forEach(([variable, value]) => {
      const regex = new RegExp(`\\b${variable}\\b`, 'g')
      expr = expr.replace(regex, value.toString())
    })
    
    // 論理演算子を JavaScript の演算子に変換
    expr = expr.replace(/\bAND\b/g, '&&')
    expr = expr.replace(/\bOR\b/g, '||')
    expr = expr.replace(/\bNOT\b/g, '!')
    expr = expr.replace(/\bXOR\b/g, '^')
    
    // 安全性のチェック（数字、演算子、括弧のみ許可）
    if (!/^[0-1\s&|!^()]+$/.test(expr)) {
      throw new Error('無効な文字が含まれています')
    }
    
    try {
      // XOR演算の処理
      expr = expr.replace(/(\d+)\s*\^\s*(\d+)/g, '(($1) !== ($2) ? 1 : 0)')
      
      return eval(expr) ? 1 : 0
    } catch (error) {
      throw new Error('論理式の構文が正しくありません')
    }
  }

  displayTruthTable(data, variableCount) {
    const { variables, table } = data
    
    let html = `
      <div class="overflow-x-auto">
        <table class="w-full bg-white border border-gray-300 rounded">
          <thead class="bg-gray-100">
            <tr>
    `
    
    // ヘッダー
    variables.forEach(variable => {
      html += `<th class="px-3 py-2 border-b font-semibold text-center">${variable}</th>`
    })
    html += `<th class="px-3 py-2 border-b font-semibold text-center bg-blue-100">結果</th></tr></thead><tbody>`
    
    // データ行
    table.forEach((row, index) => {
      html += `<tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">`
      variables.forEach(variable => {
        html += `<td class="px-3 py-2 border-b text-center font-mono">${row[variable]}</td>`
      })
      html += `<td class="px-3 py-2 border-b text-center font-mono font-bold ${row.result ? 'text-green-600' : 'text-red-600'}">${row.result}</td>`
      html += `</tr>`
    })
    
    html += `</tbody></table></div>`
    
    document.getElementById('truth-table-display').innerHTML = html
  }

  convertExpression() {
    const expression = document.getElementById('original-expression')?.value.trim()
    
    if (!expression) {
      alert('論理式を入力してください')
      return
    }

    // 簡単な変換例（実際の実装ではより高度な変換が必要）
    let result = `
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-800 mb-2">元の式:</h4>
          <div class="bg-white p-3 rounded border font-mono">${expression}</div>
        </div>
        <div>
          <h4 class="font-semibold text-gray-800 mb-2">正規化:</h4>
          <div class="bg-white p-3 rounded border font-mono">${expression.toUpperCase()}</div>
        </div>
        <div class="text-sm text-gray-600">
          より高度な論理式変換機能は開発中です。
        </div>
      </div>
    `
    
    document.getElementById('conversion-result').innerHTML = result
  }

  displayCircuitDiagram(expression) {
    // 簡単な回路図表示（テキストベース）
    const circuitDisplay = document.getElementById('circuit-display')
    
    let circuitHtml = `
      <div class="space-y-4">
        <div class="bg-white p-4 rounded border">
          <h4 class="font-semibold text-gray-800 mb-3">論理式: ${expression}</h4>
          <div class="space-y-3">
    `
    
    // 基本的な回路図要素を生成
    if (expression.includes('AND')) {
      circuitHtml += `
        <div class="flex items-center space-x-2 p-2 bg-blue-50 rounded">
          <div class="w-12 h-8 bg-blue-200 rounded flex items-center justify-center text-xs font-bold">AND</div>
          <span class="text-sm">論理積ゲート</span>
        </div>
      `
    }
    
    if (expression.includes('OR')) {
      circuitHtml += `
        <div class="flex items-center space-x-2 p-2 bg-green-50 rounded">
          <div class="w-12 h-8 bg-green-200 rounded flex items-center justify-center text-xs font-bold">OR</div>
          <span class="text-sm">論理和ゲート</span>
        </div>
      `
    }
    
    if (expression.includes('NOT')) {
      circuitHtml += `
        <div class="flex items-center space-x-2 p-2 bg-red-50 rounded">
          <div class="w-12 h-8 bg-red-200 rounded flex items-center justify-center text-xs font-bold">NOT</div>
          <span class="text-sm">否定ゲート</span>
        </div>
      `
    }
    
    if (expression.includes('XOR')) {
      circuitHtml += `
        <div class="flex items-center space-x-2 p-2 bg-purple-50 rounded">
          <div class="w-12 h-8 bg-purple-200 rounded flex items-center justify-center text-xs font-bold">XOR</div>
          <span class="text-sm">排他的論理和ゲート</span>
        </div>
      `
    }
    
    circuitHtml += `
          </div>
        </div>
        <div class="text-center">
          <canvas id="circuit-canvas" width="400" height="200" class="border border-gray-300 rounded bg-white"></canvas>
        </div>
        <div class="text-sm text-gray-600 text-center">
          より詳細な回路図は「回路設計」タブで作成できます
        </div>
      </div>
    `
    
    circuitDisplay.innerHTML = circuitHtml
    
    // 簡単なキャンバス描画
    this.drawSimpleCircuit(expression)
  }

  drawSimpleCircuit(expression) {
    const canvas = document.getElementById('circuit-canvas')
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 背景を設定
    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 簡単な回路図を描画
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    
    // 入力端子
    const variables = this.extractVariables(expression)
    const startY = 50
    const spacing = Math.min(40, 120 / variables.length)
    
    variables.forEach((variable, index) => {
      const y = startY + index * spacing
      
      // 入力線
      ctx.beginPath()
      ctx.moveTo(50, y)
      ctx.lineTo(100, y)
      ctx.stroke()
      
      // 変数ラベル
      ctx.fillStyle = '#1f2937'
      ctx.fillText(variable, 30, y + 5)
    })
    
    // 基本的なゲート記号
    let gateX = 150
    if (expression.includes('AND')) {
      this.drawAndGate(ctx, gateX, 100)
      gateX += 80
    }
    if (expression.includes('OR')) {
      this.drawOrGate(ctx, gateX, 100)
      gateX += 80
    }
    if (expression.includes('NOT')) {
      this.drawNotGate(ctx, gateX, 100)
      gateX += 60
    }
    
    // 出力線
    ctx.beginPath()
    ctx.moveTo(gateX, 100)
    ctx.lineTo(350, 100)
    ctx.stroke()
    
    // 出力ラベル
    ctx.fillStyle = '#1f2937'
    ctx.fillText('Y', 370, 105)
  }

  extractVariables(expression) {
    const matches = expression.match(/[A-D]/g)
    return [...new Set(matches || [])].sort()
  }

  drawAndGate(ctx, x, y) {
    ctx.beginPath()
    ctx.arc(x + 20, y, 15, -Math.PI/2, Math.PI/2)
    ctx.lineTo(x, y + 15)
    ctx.lineTo(x, y - 15)
    ctx.closePath()
    ctx.stroke()
    ctx.fillStyle = '#dbeafe'
    ctx.fill()
    ctx.fillStyle = '#1e40af'
    ctx.fillText('&', x + 10, y + 5)
  }

  drawOrGate(ctx, x, y) {
    ctx.beginPath()
    ctx.arc(x + 10, y, 15, -Math.PI/3, Math.PI/3)
    ctx.arc(x - 5, y, 20, -Math.PI/4, Math.PI/4)
    ctx.closePath()
    ctx.stroke()
    ctx.fillStyle = '#dcfce7'
    ctx.fill()
    ctx.fillStyle = '#166534'
    ctx.fillText('≥1', x + 10, y + 5)
  }

  drawNotGate(ctx, x, y) {
    ctx.beginPath()
    ctx.moveTo(x, y - 10)
    ctx.lineTo(x, y + 10)
    ctx.lineTo(x + 20, y)
    ctx.closePath()
    ctx.stroke()
    ctx.fillStyle = '#fef2f2'
    ctx.fill()
    
    // NOT記号の小さな円
    ctx.beginPath()
    ctx.arc(x + 25, y, 3, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()
  }

  cleanup() {
    // クリーンアップ処理
  }
}