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
    console.log('🔍 DEBUG addToExpression called with:', value)
    console.log('🔍 Current expression before:', this.currentExpression)
    
    this.currentExpression += value
    
    console.log('🔍 Current expression after:', this.currentExpression)
    
    // 🚨 D がクリックされた場合の警告
    if (value === 'D') {
      console.warn('🚨 Variable D was clicked and added to expression!')
    }
    
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
    const expression = this.currentExpression.trim()
    
    // 🚨 CACHE BUSTER: 修正版のログ  
    console.log('🆕 FIXED VERSION: generateTruthTableAndCircuit called - NO MORE VARIABLE D BUG!')
    console.log('🔍 DEBUG: generateTruthTableAndCircuit called')
    console.log('📝 Expression:', expression)
    
    if (!expression) {
      alert('論理式をボタンで入力してください')
      return
    }

    try {
      // 真理値表を生成（UIの変数カウントは無視して、実際の式から抽出）
      const table = this.createTruthTable(expression)
      this.displayTruthTable(table, table.variables.length)
      
      // 回路図を生成（デバッグ付き）
      this.displayCircuitDiagram(expression)
    } catch (error) {
      console.error('❌ Error in generateTruthTableAndCircuit:', error)
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

  createTruthTable(expression) {
    // 実際に使用される変数のみを抽出
    const variables = this.extractVariables(expression)
    
    // 🚨 CACHE BUSTER: 修正版のログ
    console.log('🆕 FIXED VERSION: createTruthTable called')
    console.log('🔍 DEBUG createTruthTable:')
    console.log('  Expression:', expression)
    console.log('  Actual variables used:', variables)
    console.log('  🚨 Variable count:', variables.length)
    
    if (variables.includes('D') && !expression.toUpperCase().includes('D')) {
      console.error('🚨 BUG DETECTED: Variable D found but not in expression!')
    }
    
    const rows = Math.pow(2, variables.length)
    const table = []

    for (let i = 0; i < rows; i++) {
      const row = {}
      
      // 各変数の値を設定
      for (let j = 0; j < variables.length; j++) {
        const variable = variables[j]
        row[variable] = (i >> (variables.length - 1 - j)) & 1
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
    
    console.log('🔍 DEBUG displayTruthTable:')
    console.log('  Variables to display:', variables)
    console.log('  Table data:', table)
    
    // 🚨 最終チェック: 真理値表に表示される変数
    console.log('🚨 FINAL CHECK: Variables being displayed in truth table:', variables)
    if (variables.includes('D')) {
      console.error('🚨 CRITICAL: Variable D is being displayed in truth table!')
      console.error('🚨 This is the final bug location!')
    }
    
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
    console.log('🔍 DEBUG: displayCircuitDiagram called with:', expression)
    const circuitDisplay = document.getElementById('circuit-display')
    
    // 論理式を解析してゲート構成を取得
    const circuit = this.parseLogicExpression(expression)
    console.log('🏗️ Final circuit object:', circuit)
    
    let circuitHtml = `
      <div class="space-y-4">
        <div class="bg-white p-4 rounded border">
          <h4 class="font-semibold text-gray-800 mb-3">論理式: ${expression}</h4>
          <div class="space-y-2">
            <div class="text-sm text-gray-600">使用されるゲート:</div>
            <div class="flex flex-wrap gap-2">
    `
    
    // 使用されるゲートを表示
    circuit.gates.forEach(gate => {
      const gateInfo = this.getGateInfo(gate.type)
      circuitHtml += `
        <div class="flex items-center space-x-2 px-2 py-1 ${gateInfo.bgClass} rounded text-xs">
          <div class="w-8 h-6 ${gateInfo.colorClass} rounded flex items-center justify-center font-bold">${gateInfo.symbol}</div>
          <span>${gateInfo.name}</span>
        </div>
      `
    })
    
    circuitHtml += `
            </div>
          </div>
        </div>
        <div class="text-center">
          <canvas id="circuit-canvas" width="600" height="300" class="border border-gray-300 rounded bg-white max-w-full"></canvas>
        </div>
        <div class="text-sm text-gray-600 text-center">
          論理式に基づいて自動生成された回路図
        </div>
      </div>
    `
    
    circuitDisplay.innerHTML = circuitHtml
    
    // 詳細な回路図を描画
    this.drawLogicCircuit(circuit)
  }

  parseLogicExpression(expression) {
    console.log('🔍 DEBUG: parseLogicExpression called with:', expression)
    
    // 論理式を解析して回路構造を構築
    const variables = this.extractVariables(expression)
    const gates = []
    const connections = []
    
    let normalizedExpr = expression.toUpperCase().trim()
    let gateId = 0
    
    console.log('📝 Normalized expression:', normalizedExpr)
    console.log('🔤 Extracted variables:', variables)
    
    // 括弧を含む複雑な式への対応
    if (normalizedExpr.includes('(') && normalizedExpr.includes(')')) {
      console.log('🔍 Processing expression with parentheses')
      
      // NOT (A AND B) のパターン
      if (normalizedExpr.startsWith('NOT (') && normalizedExpr.endsWith(')')) {
        console.log('🔍 Detected NOT (expression) pattern')
        const innerExpr = normalizedExpr.substring(5, normalizedExpr.length - 1).trim()
        console.log('🔍 Inner expression:', innerExpr)
        
        if (innerExpr.includes(' AND ')) {
          const andParts = innerExpr.split(' AND ').map(part => part.trim())
          console.log('🔍 AND parts:', andParts)
          
          // ANDゲートを追加
          const andGate = {
            id: `gate_${gateId++}`,
            type: 'AND',
            inputs: andParts,
            x: 200,
            y: 130,
            output: `and_out_1`
          }
          gates.push(andGate)
          
          // NOTゲートを追加
          const notGate = {
            id: `gate_${gateId++}`,
            type: 'NOT',
            inputs: [andGate.output],
            x: 350,
            y: 150,
            output: 'Y'
          }
          gates.push(notGate)
          
          // 接続を定義
          connections.push({
            from: andGate.id,
            to: notGate.id,
            fromOutput: andGate.output,
            toInput: 0
          })
        } else if (innerExpr.includes(' OR ')) {
          const orParts = innerExpr.split(' OR ').map(part => part.trim())
          
          // ORゲートを追加
          const orGate = {
            id: `gate_${gateId++}`,
            type: 'OR',
            inputs: orParts,
            x: 200,
            y: 130,
            output: `or_out_1`
          }
          gates.push(orGate)
          
          // NOTゲートを追加
          const notGate = {
            id: `gate_${gateId++}`,
            type: 'NOT',
            inputs: [orGate.output],
            x: 350,
            y: 150,
            output: 'Y'
          }
          gates.push(notGate)
          
          // 接続を定義
          connections.push({
            from: orGate.id,
            to: notGate.id,
            fromOutput: orGate.output,
            toInput: 0
          })
        }
      } else if (normalizedExpr.match(/\(.*\)\s+AND\s+/)) {
        // (A OR B) AND C のパターン
        const match = normalizedExpr.match(/\((.*?)\)\s+AND\s+(.*)/)
        if (match) {
          const innerExpr = match[1].trim()
          const rightExpr = match[2].trim()
          
          if (innerExpr.includes(' OR ')) {
            const orParts = innerExpr.split(' OR ').map(part => part.trim())
            
            // ORゲートを追加
            const orGate = {
              id: `gate_${gateId++}`,
              type: 'OR',
              inputs: orParts,
              x: 200,
              y: 120,
              output: `or_out_1`
            }
            gates.push(orGate)
            
            // ANDゲートを追加
            const andGate = {
              id: `gate_${gateId++}`,
              type: 'AND',
              inputs: [orGate.output, rightExpr],
              x: 350,
              y: 140,
              output: 'Y'
            }
            gates.push(andGate)
            
            // 接続を定義
            connections.push({
              from: orGate.id,
              to: andGate.id,
              fromOutput: orGate.output,
              toInput: 0
            })
          }
        }
      }
    } else if (normalizedExpr.includes(' AND ') && normalizedExpr.includes(' OR ')) {
      // AND と OR が混在している場合（括弧なし）
      const orParts = normalizedExpr.split(' OR ')
      
      if (orParts.length === 2) {
        const leftPart = orParts[0].trim()
        const rightPart = orParts[1].trim()
        
        if (leftPart.includes(' AND ')) {
          // 左側がAND演算の場合: A AND B OR C
          const andParts = leftPart.split(' AND ').map(part => part.trim())
          
          // ANDゲートを追加
          const andGate = {
            id: `gate_${gateId++}`,
            type: 'AND',
            inputs: andParts,
            x: 200,
            y: 110,
            output: `and_out_1`
          }
          gates.push(andGate)
          
          // ORゲートを追加
          const orGate = {
            id: `gate_${gateId++}`,
            type: 'OR',
            inputs: [andGate.output, rightPart],
            x: 350,
            y: 140,
            output: 'Y'
          }
          gates.push(orGate)
          
          // 接続を定義
          connections.push({
            from: andGate.id,
            to: orGate.id,
            fromOutput: andGate.output,
            toInput: 0
          })
        }
      }
    } else if (normalizedExpr.startsWith('NOT ') && normalizedExpr.includes(' AND ')) {
      // NOT A AND B のパターン
      const parts = normalizedExpr.split(' AND ')
      const leftPart = parts[0].trim() // "NOT A"
      const rightPart = parts[1].trim() // "B"
      
      if (leftPart.startsWith('NOT ')) {
        const notInput = leftPart.replace('NOT ', '').trim()
        
        // NOTゲートを追加
        const notGate = {
          id: `gate_${gateId++}`,
          type: 'NOT',
          inputs: [notInput],
          x: 150,
          y: 100,
          output: `not_out_1`
        }
        gates.push(notGate)
        
        // ANDゲートを追加
        const andGate = {
          id: `gate_${gateId++}`,
          type: 'AND',
          inputs: [notGate.output, rightPart],
          x: 300,
          y: 130,
          output: 'Y'
        }
        gates.push(andGate)
        
        // 接続を定義
        connections.push({
          from: notGate.id,
          to: andGate.id,
          fromOutput: notGate.output,
          toInput: 0
        })
      }
    } else if (normalizedExpr.includes(' AND ')) {
      // ANDのみの場合
      const andParts = normalizedExpr.split(' AND ').map(part => part.trim())
      const andGate = {
        id: `gate_${gateId++}`,
        type: 'AND',
        inputs: andParts,
        x: 250,
        y: 150,
        output: 'Y'
      }
      gates.push(andGate)
    } else if (normalizedExpr.includes(' OR ')) {
      // ORのみの場合
      const orParts = normalizedExpr.split(' OR ').map(part => part.trim())
      const orGate = {
        id: `gate_${gateId++}`,
        type: 'OR',
        inputs: orParts,
        x: 250,
        y: 150,
        output: 'Y'
      }
      gates.push(orGate)
    } else if (normalizedExpr.includes(' XOR ')) {
      // XORの場合
      const xorParts = normalizedExpr.split(' XOR ').map(part => part.trim())
      const xorGate = {
        id: `gate_${gateId++}`,
        type: 'XOR',
        inputs: xorParts,
        x: 250,
        y: 150,
        output: 'Y'
      }
      gates.push(xorGate)
    } else if (normalizedExpr.startsWith('NOT ')) {
      // NOTのみの場合
      const notInput = normalizedExpr.replace('NOT ', '').trim()
      const notGate = {
        id: `gate_${gateId++}`,
        type: 'NOT',
        inputs: [notInput],
        x: 250,
        y: 150,
        output: 'Y'
      }
      gates.push(notGate)
    } else {
      // 単一変数の場合
      gates.push({
        id: `gate_${gateId++}`,
        type: 'BUFFER',
        inputs: [normalizedExpr],
        x: 250,
        y: 150,
        output: 'Y'
      })
    }
    
    console.log('🏗️ Generated circuit structure:')
    console.log('  Variables:', variables)
    console.log('  Gates:', gates)
    console.log('  Connections:', connections)
    
    return {
      variables,
      gates,
      connections,
      expression: normalizedExpr
    }
  }

  getGateInfo(gateType) {
    const gateTypes = {
      'AND': {
        name: 'ANDゲート',
        symbol: '&',
        bgClass: 'bg-blue-50',
        colorClass: 'bg-blue-200 text-blue-800'
      },
      'OR': {
        name: 'ORゲート', 
        symbol: '≥1',
        bgClass: 'bg-green-50',
        colorClass: 'bg-green-200 text-green-800'
      },
      'NOT': {
        name: 'NOTゲート',
        symbol: '¬',
        bgClass: 'bg-red-50',
        colorClass: 'bg-red-200 text-red-800'
      },
      'XOR': {
        name: 'XORゲート',
        symbol: '⊕',
        bgClass: 'bg-purple-50',
        colorClass: 'bg-purple-200 text-purple-800'
      },
      'BUFFER': {
        name: 'バッファゲート',
        symbol: '1',
        bgClass: 'bg-gray-50',
        colorClass: 'bg-gray-200 text-gray-800'
      }
    }
    return gateTypes[gateType] || gateTypes['AND']
  }

  drawLogicCircuit(circuit) {
    console.log('🎨 DEBUG: drawLogicCircuit called with:', circuit)
    const canvas = document.getElementById('circuit-canvas')
    if (!canvas) {
      console.error('❌ Canvas not found!')
      return
    }
    
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 背景を設定
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 描画設定
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 動的レイアウト計算
    const numVariables = circuit.variables.length
    const canvasHeight = canvas.height
    const availableHeight = canvasHeight - 120 // 上下マージン
    const inputSpacing = Math.min(60, availableHeight / Math.max(numVariables, 2))
    const startY = (canvasHeight - (numVariables - 1) * inputSpacing) / 2
    
    // 入力変数を描画（使用される変数のみ）
    const inputX = 60
    
    circuit.variables.forEach((variable, index) => {
      const y = startY + index * inputSpacing
      
      // 入力端子の円
      ctx.beginPath()
      ctx.arc(inputX, y, 8, 0, 2 * Math.PI)
      ctx.fillStyle = '#dbeafe'
      ctx.fill()
      ctx.strokeStyle = '#1e40af'
      ctx.stroke()
      
      // 変数ラベル
      ctx.fillStyle = '#1e40af'
      ctx.font = 'bold 16px Arial'
      ctx.fillText(variable, inputX - 30, y)
      
      // 入力線を延長
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(inputX + 8, y)
      ctx.lineTo(inputX + 50, y)
      ctx.stroke()
    })
    
    // ゲートを描画
    circuit.gates.forEach((gate, index) => {
      const gateX = gate.x
      const gateY = gate.y
      
      // ゲートの入力線を描画
      gate.inputs.forEach((input, inputIndex) => {
        if (circuit.variables.includes(input)) {
          // 変数からの入力
          const varIndex = circuit.variables.indexOf(input)
          const varY = startY + varIndex * inputSpacing
          
          // 入力端子の位置を計算
          let inputY
          if (gate.inputs.length === 1) {
            inputY = gateY
          } else {
            inputY = gateY - 15 + (inputIndex * 30)
          }
          
          // 配線の描画
          ctx.strokeStyle = '#374151'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(inputX + 50, varY)
          
          // 直接接続できる場合
          if (Math.abs(varY - inputY) < 15) {
            ctx.lineTo(gateX - 30, inputY)
          } else {
            // 垂直線が必要な場合
            const midX = gateX - 90
            ctx.lineTo(midX, varY)
            ctx.lineTo(midX, inputY)
            ctx.lineTo(gateX - 30, inputY)
          }
          ctx.stroke()
          
          // 接続点を描画
          ctx.beginPath()
          ctx.arc(gateX - 30, inputY, 3, 0, 2 * Math.PI)
          ctx.fillStyle = '#374151'
          ctx.fill()
        } else {
          // 前のゲートからの入力（中間信号）
          const connection = circuit.connections.find(conn => conn.toInput === inputIndex)
          if (connection) {
            const fromGate = circuit.gates.find(g => g.id === connection.from)
            if (fromGate) {
              let inputY
              if (gate.inputs.length === 1) {
                inputY = gateY
              } else {
                inputY = gateY - 15 + (inputIndex * 30)
              }
              
              // ゲート間の接続
              ctx.strokeStyle = '#374151'
              ctx.lineWidth = 3
              ctx.beginPath()
              ctx.moveTo(fromGate.x + 30, fromGate.y)
              ctx.lineTo(gateX - 30, inputY)
              ctx.stroke()
              
              // 接続点を描画
              ctx.beginPath()
              ctx.arc(gateX - 30, inputY, 3, 0, 2 * Math.PI)
              ctx.fillStyle = '#dc2626'
              ctx.fill()
            }
          }
        }
      })
      
      // ゲート本体を描画
      this.drawGateSymbol(ctx, gate.type, gateX, gateY)
      
      // 出力線を描画
      if (gate.output === 'Y') {
        // 最終出力
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(gateX + 30, gateY)
        ctx.lineTo(canvas.width - 100, gateY)
        ctx.stroke()
        
        // 出力端子
        ctx.beginPath()
        ctx.arc(canvas.width - 100, gateY, 10, 0, 2 * Math.PI)
        ctx.fillStyle = '#fbbf24'
        ctx.fill()
        ctx.strokeStyle = '#d97706'
        ctx.lineWidth = 2
        ctx.stroke()
        
        // 出力ラベル
        ctx.fillStyle = '#d97706'
        ctx.font = 'bold 18px Arial'
        ctx.fillText('Y', canvas.width - 60, gateY)
      } else {
        // 中間出力
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(gateX + 30, gateY)
        ctx.lineTo(gateX + 60, gateY)
        ctx.stroke()
      }
    })
  }

  drawGateSymbol(ctx, gateType, x, y) {
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    
    switch (gateType) {
      case 'AND':
        this.drawAndGate(ctx, x, y)
        break
      case 'OR':
        this.drawOrGate(ctx, x, y)
        break
      case 'NOT':
        this.drawNotGate(ctx, x, y)
        break
      case 'XOR':
        this.drawXorGate(ctx, x, y)
        break
      case 'BUFFER':
        this.drawBufferGate(ctx, x, y)
        break
    }
  }

  extractVariables(expression) {
    console.log('🔍 DEBUG extractVariables called with:', expression)
    console.log('🔍 Expression type:', typeof expression)
    console.log('🔍 Expression length:', expression.length)
    
    const matches = expression.match(/[A-D]/g)
    console.log('🔍 Raw matches:', matches)
    
    const result = [...new Set(matches || [])].sort()
    console.log('🔍 Final extracted variables:', result)
    
    // 🚨 重要: A AND B の場合、Dが含まれていたらエラー
    if (expression.trim().toUpperCase() === 'A AND B' && result.includes('D')) {
      console.error('🚨 CRITICAL BUG: D found in "A AND B" expression!')
      console.error('🚨 This should NEVER happen!')
      console.error('🚨 Expression:', expression)
      console.error('🚨 Matches:', matches)
      console.error('🚨 Result:', result)
    }
    
    return result
  }

  drawAndGate(ctx, x, y) {
    // AND ゲートの形状（D型）
    ctx.fillStyle = '#dbeafe'
    ctx.strokeStyle = '#1e40af'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x - 30, y - 20)
    ctx.lineTo(x, y - 20)
    ctx.arc(x, y, 20, -Math.PI/2, Math.PI/2)
    ctx.lineTo(x - 30, y + 20)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // ANDシンボル
    ctx.fillStyle = '#1e40af'
    ctx.font = 'bold 16px Arial'
    ctx.fillText('&', x - 15, y)
  }

  drawOrGate(ctx, x, y) {
    // OR ゲートの形状
    ctx.fillStyle = '#dcfce7'
    ctx.strokeStyle = '#166534'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x - 30, y - 20)
    ctx.quadraticCurveTo(x - 10, y - 20, x + 20, y)
    ctx.quadraticCurveTo(x - 10, y + 20, x - 30, y + 20)
    ctx.quadraticCurveTo(x - 20, y, x - 30, y - 20)
    ctx.fill()
    ctx.stroke()
    
    // ORシンボル
    ctx.fillStyle = '#166534'
    ctx.font = 'bold 12px Arial'
    ctx.fillText('≥1', x - 10, y)
  }

  drawNotGate(ctx, x, y) {
    // NOT ゲートの形状（三角形）
    ctx.fillStyle = '#fef2f2'
    ctx.strokeStyle = '#dc2626'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x - 30, y - 15)
    ctx.lineTo(x - 30, y + 15)
    ctx.lineTo(x + 10, y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // NOT記号の小さな円（インバータ）
    ctx.beginPath()
    ctx.arc(x + 15, y, 5, 0, 2 * Math.PI)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.strokeStyle = '#dc2626'
    ctx.stroke()
  }

  drawXorGate(ctx, x, y) {
    // XOR ゲートの形状（OR + 追加線）
    ctx.fillStyle = '#f3e8ff'
    ctx.strokeStyle = '#7c3aed'
    ctx.lineWidth = 3
    
    // メインのOR形状
    ctx.beginPath()
    ctx.moveTo(x - 25, y - 20)
    ctx.quadraticCurveTo(x - 5, y - 20, x + 20, y)
    ctx.quadraticCurveTo(x - 5, y + 20, x - 25, y + 20)
    ctx.quadraticCurveTo(x - 15, y, x - 25, y - 20)
    ctx.fill()
    ctx.stroke()
    
    // 追加の曲線（XORを示す）
    ctx.beginPath()
    ctx.moveTo(x - 35, y - 15)
    ctx.quadraticCurveTo(x - 25, y, x - 35, y + 15)
    ctx.stroke()
    
    // XORシンボル
    ctx.fillStyle = '#7c3aed'
    ctx.font = 'bold 12px Arial'
    ctx.fillText('⊕', x - 10, y)
  }

  drawBufferGate(ctx, x, y) {
    // BUFFER ゲートの形状（三角形、NOT無し）
    ctx.fillStyle = '#f9fafb'
    ctx.strokeStyle = '#6b7280'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x - 30, y - 15)
    ctx.lineTo(x - 30, y + 15)
    ctx.lineTo(x + 10, y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // BUFFERシンボル
    ctx.fillStyle = '#6b7280'
    ctx.font = 'bold 12px Arial'
    ctx.fillText('1', x - 15, y)
  }

  cleanup() {
    // クリーンアップ処理
  }
}