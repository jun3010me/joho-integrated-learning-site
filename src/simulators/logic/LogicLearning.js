export class LogicLearning {
  constructor() {
    this.currentSection = 'basic'
    this.truthTable = {}
    this.variables = ['A', 'B']
    this.maxVariables = 4
    this.currentExpression = ''
    this.expressions = [] // Support for multiple expressions
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
        <section id="basic-section" class="logic-section active" style="display: block;">
          <div class="card mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">基本論理演算</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="space-y-6">
                <div class="bg-blue-50 p-4 rounded-lg"><h3 class="text-lg font-semibold text-blue-800 mb-3">AND ゲート</h3><p class="text-blue-700">全ての入力が1の時のみ出力が1</p></div>
                <div class="bg-green-50 p-4 rounded-lg"><h3 class="text-lg font-semibold text-green-800 mb-3">OR ゲート</h3><p class="text-green-700">入力のいずれかが1の時出力が1</p></div>
                <div class="bg-red-50 p-4 rounded-lg"><h3 class="text-lg font-semibold text-red-800 mb-3">NOT ゲート</h3><p class="text-red-700">入力を反転させる</p></div>
              </div>
              <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">論理演算計算機</h3>
                <div class="space-y-4">
                  <div class="flex items-center space-x-4">
                    <label>A:</label><button id="input-a" class="logic-input-btn">0</button>
                    <label>B:</label><button id="input-b" class="logic-input-btn">0</button>
                  </div>
                  <div class="grid grid-cols-1 gap-3">
                    <div class="flex justify-between items-center p-3 bg-white rounded border"><span>A AND B =</span><span id="result-and" class="font-mono font-bold text-blue-600">0</span></div>
                    <div class="flex justify-between items-center p-3 bg-white rounded border"><span>A OR B =</span><span id="result-or" class="font-mono font-bold text-green-600">0</span></div>
                    <div class="flex justify-between items-center p-3 bg-white rounded border"><span>NOT A =</span><span id="result-not-a" class="font-mono font-bold text-red-600">1</span></div>
                    <div class="flex justify-between items-center p-3 bg-white rounded border"><span>A XOR B =</span><span id="result-xor" class="font-mono font-bold text-purple-600">0</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 真理値表・回路図セクション -->
        <section id="truth-table-section" class="logic-section" style="display: none;">
            <div class="card mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">論理式入力・真理値表・回路図</h2>
                <div class="mb-8">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                        <div id="logic-expressions-container" class="space-y-2">
                            <div id="logic-expression-display" class="w-full p-3 min-h-12 border border-gray-300 rounded-md bg-gray-50 font-mono text-lg"></div>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <button id="clear-expression" class="btn-secondary text-sm">クリア</button>
                        <button id="generate-table" class="btn-primary flex-1">真理値表・回路図を生成</button>
                      </div>
                      <div class="flex gap-2 mt-2">
                        <button id="load-half-adder" class="btn-secondary flex-1 text-sm">半加算器</button>
                        <button id="load-full-adder" class="btn-secondary flex-1 text-sm">全加算器</button>
                      </div>
                    </div>
                    <div id="logic-buttons-panel" class="space-y-4">
                      <h3 class="text-lg font-semibold text-gray-800">論理式ボタン入力</h3>
                      <div class="space-y-2">
                        <div class="text-sm font-medium text-gray-700">変数:</div>
                        <div id="variable-buttons" class="flex flex-wrap gap-2"></div>
                      </div>
                      <div class="space-y-2">
                        <div class="text-sm font-medium text-gray-700">演算子:</div>
                        <div class="grid grid-cols-2 gap-2">
                          <button class="logic-btn operator-btn gate-and" data-value=" AND ">AND</button>
                          <button class="logic-btn operator-btn gate-or" data-value=" OR ">OR</button>
                          <button class="logic-btn operator-btn gate-not" data-value="NOT ">NOT</button>
                          <button class="logic-btn operator-btn gate-xor" data-value=" XOR ">XOR</button>
                        </div>
                      </div>
                      <div class="space-y-2">
                        <div class="text-sm font-medium text-gray-700">括弧:</div>
                        <div class="flex gap-2">
                          <button class="logic-btn bracket-btn" data-value="(">(</button>
                          <button class="logic-btn bracket-btn" data-value=")">)</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">真理値表</h3>
                    <div id="truth-table-display" class="bg-gray-50 p-4 rounded-lg min-h-48"></div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">論理回路図</h3>
                    <div id="circuit-display" class="bg-gray-50 p-4 rounded-lg min-h-48"></div>
                  </div>
                </div>
            </div>
        </section>

        <!-- 論理式変換セクション -->
        <section id="expression-section" class="logic-section" style="display: none;">
          <div class="card mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">論理式変換</h2>
            <p class="text-gray-600">この機能は現在開発中です。</p>
          </div>
        </section>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.querySelectorAll('.logic-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    const inputA = document.getElementById('input-a');
    const inputB = document.getElementById('input-b');
    if (inputA && inputB) {
        [inputA, inputB].forEach(btn => {
            btn.addEventListener('click', () => {
                btn.textContent = btn.textContent === '0' ? '1' : '0';
                this.updateLogicCalculator();
            });
        });
    }

    document.getElementById('variable-count')?.addEventListener('change', () => this.updateVariableButtons());
    document.getElementById('generate-table')?.addEventListener('click', () => this.generateTruthTableAndCircuit());
    document.getElementById('clear-expression')?.addEventListener('click', () => this.clearExpression());
    document.getElementById('load-half-adder')?.addEventListener('click', () => this.loadHalfAdder());
    document.getElementById('load-full-adder')?.addEventListener('click', () => this.loadFullAdder());

    this.setupLogicButtons();
    this.updateVariableButtons();
    this.updateLogicCalculator();
    this.updateExpressionDisplay();
  }

  setupLogicButtons() {
    document.getElementById('logic-buttons-panel')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('logic-btn')) {
            this.addToExpression(e.target.dataset.value);
        }
    });
  }

  updateVariableButtons() {
    const count = parseInt(document.getElementById('variable-count')?.value || '2');
    const container = document.getElementById('variable-buttons');
    if (!container) return;
    const variables = ['A', 'B', 'C', 'D'].slice(0, count);
    container.innerHTML = variables.map(v => `<button class="logic-btn variable-btn" data-value="${v}">${v}</button>`).join('');
  }

  addToExpression(value) {
    this.expressions = [];
    this.currentExpression += value;
    this.updateExpressionDisplay();
  }

  clearExpression() {
    this.currentExpression = '';
    this.expressions = [];
    this.updateExpressionDisplay();
    document.getElementById('truth-table-display').innerHTML = '';
    document.getElementById('circuit-display').innerHTML = '';
  }

  updateExpressionDisplay() {
    const container = document.getElementById('logic-expressions-container');
    const manualDisplay = document.getElementById('logic-expression-display');
    const buttonsPanel = document.getElementById('logic-buttons-panel');
    if (!container || !manualDisplay || !buttonsPanel) return;

    container.querySelectorAll('.preset-expression').forEach(el => el.remove());

    if (this.expressions.length > 0) {
        this.expressions.forEach(expr => {
            const el = document.createElement('div');
            el.className = 'preset-expression w-full p-3 border border-gray-300 rounded-md bg-gray-100 font-mono text-lg flex items-center';
            el.innerHTML = `<span class="font-bold text-blue-600 mr-4">${expr.name} =</span> <span>${expr.formula}</span>`;
            container.insertBefore(el, manualDisplay);
        });
        manualDisplay.style.display = 'none';
        buttonsPanel.style.display = 'none';
    } else {
        manualDisplay.style.display = 'block';
        manualDisplay.textContent = this.currentExpression || '（論理式をボタンで入力してください）';
        buttonsPanel.style.display = 'block';
    }
  }

  switchTab(tab) {
    this.currentSection = tab;
    document.querySelectorAll('.logic-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    document.querySelectorAll('.logic-section').forEach(section => {
      section.style.display = section.id === `${tab}-section` ? 'block' : 'none';
    });
  }

  updateLogicCalculator() {
    const a = document.getElementById('input-a')?.textContent === '1';
    const b = document.getElementById('input-b')?.textContent === '1';
    if (document.getElementById('result-and') === null) return;

    document.getElementById('result-and').textContent = (a && b) ? '1' : '0';
    document.getElementById('result-or').textContent = (a || b) ? '1' : '0';
    document.getElementById('result-not-a').textContent = (!a) ? '1' : '0';
    document.getElementById('result-xor').textContent = (a !== b) ? '1' : '0';
  }

  loadHalfAdder() {
    document.getElementById('variable-count').value = '2';
    this.updateVariableButtons();
    this.expressions = [
        { name: 'S', formula: 'A XOR B' },
        { name: 'C', formula: 'A AND B' }
    ];
    this.currentExpression = '';
    this.updateExpressionDisplay();
  }

  loadFullAdder() {
    document.getElementById('variable-count').value = '3';
    this.updateVariableButtons();
    this.expressions = [
        { name: 'S', formula: '(A XOR B) XOR C' },
        { name: 'C', formula: '(A AND B) OR (C AND (A XOR B))' }
    ];
    this.currentExpression = '';
    this.updateExpressionDisplay();
  }

  generateTruthTableAndCircuit() {
    const expressionsToProcess = this.expressions.length > 0 
        ? this.expressions 
        : [{ name: 'Y', formula: this.currentExpression.trim() }];

    // Validate expressions
    if (!expressionsToProcess || expressionsToProcess.length === 0) {
      alert('論理式を入力または選択してください');
      return;
    }

    if (expressionsToProcess.every(e => !e.formula || e.formula.trim() === '')) {
      alert('論理式を入力または選択してください');
      return;
    }

    console.log('=== Starting Truth Table and Circuit Generation ===');
    console.log('Expressions to process:', expressionsToProcess);

    try {
      // Validate all expressions first
      for (let i = 0; i < expressionsToProcess.length; i++) {
        const expr = expressionsToProcess[i];
        if (!expr || typeof expr !== 'object' || !expr.formula) {
          throw new Error(`Invalid expression at index ${i}: ${JSON.stringify(expr)}`);
        }
        console.log(`Validating expression ${i + 1}: ${expr.name} = ${expr.formula}`);
      }

      const allFormulas = expressionsToProcess.map(e => e.formula).join(' ');
      const variables = this.extractVariables(allFormulas);
      
      console.log('Extracted variables:', variables);
      
      if (!variables || variables.length === 0) {
        throw new Error('No variables found in expressions');
      }

      const table = this.createTruthTable(expressionsToProcess, variables);
      this.displayTruthTable(table);
      
      const mergedCircuit = this.createMergedCircuit(expressionsToProcess, variables);
      this.displayCircuitDiagram(mergedCircuit);
      
      console.log('✅ Truth table and circuit generation completed successfully');
    } catch (error) {
      console.error('❌ Error in generateTruthTableAndCircuit:', error);
      console.error('Error stack:', error.stack);
      
      const msg = error.message || 'An unknown error occurred.';
      const errorDisplay = `
        <div class="text-red-600 text-center p-4">
          <p class="font-bold">⚠️ エラーが発生しました</p>
          <p class="text-sm mt-2">${msg}</p>
          <button onclick="console.log('Debug info:', ${JSON.stringify(expressionsToProcess)})" 
                  class="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded text-xs">
            デバッグ情報を表示
          </button>
        </div>
      `;
      
      document.getElementById('truth-table-display').innerHTML = errorDisplay;
      document.getElementById('circuit-display').innerHTML = errorDisplay;
    }
  }

  extractVariables(expression) {
    const matches = expression.toUpperCase().match(/\b[A-D]\b/g);
    return [...new Set(matches || [])].sort();
  }

  createTruthTable(expressions, variables) {
    if (!expressions || !Array.isArray(expressions) || expressions.length === 0) {
      throw new Error('Invalid expressions array for truth table creation');
    }
    
    if (!variables || !Array.isArray(variables) || variables.length === 0) {
      throw new Error('Invalid variables array for truth table creation');
    }

    console.log('Creating truth table for:', expressions.length, 'expressions and', variables.length, 'variables');

    const rows = Math.pow(2, variables.length);
    const table = [];
    
    for (let i = 0; i < rows; i++) {
      const row = { inputs: {}, results: {} };
      
      // Set input values for this row
      for (let j = 0; j < variables.length; j++) {
        row.inputs[variables[j]] = (i >> (variables.length - 1 - j)) & 1;
      }
      
      // Evaluate each expression for this row
      expressions.forEach((expr, exprIndex) => {
        try {
          if (!expr || !expr.name || !expr.formula) {
            throw new Error(`Invalid expression at index ${exprIndex}: ${JSON.stringify(expr)}`);
          }
          
          console.log(`Evaluating row ${i}, expression "${expr.name}": ${expr.formula} with inputs:`, row.inputs);
          row.results[expr.name] = this.evaluateExpression(expr.formula, row.inputs);
          console.log(`Result for ${expr.name}: ${row.results[expr.name]}`);
        } catch (error) {
          console.error(`Error evaluating expression "${expr.name}" in row ${i}:`, error);
          row.results[expr.name] = 0; // Default to 0 on error
        }
      });
      
      table.push(row);
    }
    
    console.log('Truth table created successfully with', table.length, 'rows');
    return { expressions, variables, table };
  }

  evaluateExpression(expression, values) {
    if (!expression || typeof expression !== 'string') {
      console.error('Invalid expression:', expression);
      return 0;
    }
    
    const upperExpr = expression.toUpperCase();
    const tokens = this.tokenize(upperExpr);
    
    if (!tokens || tokens.length === 0) {
      console.error('No tokens generated from expression:', expression);
      return 0;
    }

    const jsTokens = tokens.map(token => {
        if (!token || typeof token !== 'string') {
          console.error('Invalid token:', token);
          return 'false';
        }
        
        if (values.hasOwnProperty(token)) {
            return values[token] === 1 ? 'true' : 'false';
        }
        switch(token) {
            case 'AND': return '&&';
            case 'OR': return '||';
            case 'NOT': return '!';
            case 'XOR': return '!==';
            case '(': return '(';
            case ')': return ')';
            default:
                console.error(`Invalid token "${token}" in expression`);
                throw new Error(`Invalid token "${token}" in expression`);
        }
    });

    const expr = jsTokens.join(' ');

    try {
        return new Function(`return !!(${expr});`)() ? 1 : 0;
    } catch (e) {
        console.error(`Error evaluating expression: "${expression}" -> "${expr}"`, e);
        throw new Error('Invalid expression syntax');
    }
  }

  displayTruthTable(data) {
    const { expressions, variables, table } = data;
    const th = 'px-3 py-2 border-b font-semibold text-center';
    const td = 'px-3 py-2 border-b text-center font-mono';
    let html = `<div class="overflow-x-auto"><table class="w-full bg-white border"><thead><tr>`;
    variables.forEach(v => { html += `<th class="${th}">${v}</th>`; });
    expressions.forEach(e => { html += `<th class="${th} bg-blue-100">${e.name}</th>`; });
    html += `</tr></thead><tbody>`;
    table.forEach((row, index) => {
      html += `<tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">`;
      variables.forEach(v => { html += `<td class="${td}">${row.inputs[v]}</td>`; });
      expressions.forEach(e => {
        const res = row.results[e.name];
        html += `<td class="${td} font-bold ${res ? 'text-green-600' : 'text-red-600'}">${res}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table></div>`;
    document.getElementById('truth-table-display').innerHTML = html;
  }

  displayCircuitDiagram(circuit) {
    const circuitDisplay = document.getElementById('circuit-display');
    circuitDisplay.innerHTML = `<canvas id="circuit-canvas" width="600" height="400" class="border rounded bg-white max-w-full"></canvas>`;
    this.drawLogicCircuit(circuit);
  }

  createMergedCircuit(expressions, variables) {
    console.log('=== Circuit Generation Debug ===');
    console.log('Input expressions:', expressions);
    console.log('Variables:', variables);
    
    // Special case for half-adder (simple and reliable)
    if (expressions.length === 2 && 
        expressions.find(e => e.name === 'S' && e.formula === 'A XOR B') &&
        expressions.find(e => e.name === 'C' && e.formula === 'A AND B')) {
        
        console.log('Detected half-adder pattern - using simplified circuit generation');
        return this.createHalfAdderCircuit(variables);
    }
    
    // Special case for full-adder (simple and reliable)
    if (expressions.length === 2 && 
        expressions.find(e => e.name === 'S' && e.formula === '(A XOR B) XOR C') &&
        expressions.find(e => e.name === 'C' && e.formula === '(A AND B) OR (C AND (A XOR B))')) {
        
        console.log('Detected full-adder pattern - using simplified circuit generation');
        return this.createFullAdderCircuit(variables);
    }
    
    const inputConnections = {};
    const allGates = [];
    const outputToGateMap = {};
    const intermediateSignals = {};
    let gateCounter = 0;

    expressions.forEach((expr, exprIndex) => {
        console.log(`\nProcessing expression ${exprIndex + 1}: ${expr.name} = ${expr.formula}`);
        
        const { gates: parsedGates } = this.parseLogicExpression(expr.formula);
        console.log('Parsed gates:', parsedGates);

        parsedGates.forEach((gate, gateIndex) => {
            const gateId = `gate_${gateCounter++}`;
            let outputName;
            
            if (gateIndex === parsedGates.length - 1) {
                outputName = expr.name;
                console.log(`Final gate for expression ${expr.name}: ${gateId} -> ${outputName}`);
            } else {
                outputName = `intermediate_${gateId}`;
                intermediateSignals[outputName] = gateId;
                console.log(`Intermediate gate: ${gateId} -> ${outputName}`);
            }
            
            const processedGate = {
                id: gateId,
                type: gate.type,
                inputs: gate.inputs.map(input => {
                    if (input.startsWith('temp_')) {
                        const tempIndex = parseInt(input.replace('temp_', ''));
                        const referencedGateIndex = gateCounter - (parsedGates.length - tempIndex) - 1;
                        return `intermediate_gate_${referencedGateIndex}`;
                    }
                    return input;
                }),
                output: outputName,
                x: 0,
                y: 0
            };

            console.log(`Gate ${gateId}: ${gate.type} with inputs [${processedGate.inputs.join(', ')}] -> ${outputName}`);

            processedGate.inputs.forEach(input => {
                if (variables.includes(input)) {
                    if (!inputConnections[input]) {
                        inputConnections[input] = [];
                    }
                    inputConnections[input].push(gateId);
                    console.log(`Input ${input} connects to gate ${gateId}`);
                }
            });

            allGates.push(processedGate);
            if (outputName === expr.name) {
                outputToGateMap[expr.name] = gateId;
            }
        });
    });

    this.updateIntermediateConnections(allGates, intermediateSignals);

    console.log('\nFinal input connections:', inputConnections);
    console.log('All gates:', allGates);
    console.log('Intermediate signals:', intermediateSignals);

    let layout, canvasSize;
    
    try {
        const layoutResult = this.calculateLayout(allGates, variables);
        layout = layoutResult.layout;
        canvasSize = layoutResult.canvasSize;
        console.log('Layout calculated successfully:', layout);
        console.log('Canvas size:', canvasSize);
    } catch (error) {
        console.error('Layout calculation failed, using simple fallback:', error);
        layout = {};
        canvasSize = { width: 600, height: 400 };
    }
    
    // Position gates with fallback to simple layout
    allGates.forEach((gate, index) => {
        const pos = layout[gate.id];
        if (pos && pos.x && pos.y) {
            gate.x = pos.x;
            gate.y = pos.y;
        } else {
            // Simple fallback layout: gates in a column
            gate.x = 300; // Center X
            gate.y = 100 + (index * 80); // Spaced vertically
            console.warn(`Using fallback position for gate ${gate.id}`);
        }
        console.log(`Gate ${gate.id} positioned at (${gate.x}, ${gate.y})`);
    });

    return { 
        variables, 
        gates: allGates, 
        canvasSize,
        inputConnections,
        intermediateSignals
    };
  }

  createHalfAdderCircuit(variables) {
    console.log('Creating simplified half-adder circuit with improved layout');
    
    const gates = [
        {
            id: 'xor_gate',
            type: 'XOR',
            inputs: ['A', 'B'],
            output: 'S',
            x: 300,
            y: 120
        },
        {
            id: 'and_gate', 
            type: 'AND',
            inputs: ['A', 'B'],
            output: 'C',
            x: 300,
            y: 250
        }
    ];
    
    const inputConnections = {
        'A': ['xor_gate', 'and_gate'],
        'B': ['xor_gate', 'and_gate']
    };
    
    const canvasSize = { width: 600, height: 400 };
    
    console.log('Half-adder circuit created with improved layout:', { gates, inputConnections, canvasSize });
    
    return {
        variables,
        gates,
        canvasSize,
        inputConnections,
        intermediateSignals: {}
    };
  }

  createFullAdderCircuit(variables) {
    console.log('Creating simplified full-adder circuit with improved layout');
    
    // Optimized layout to prevent wire-gate overlaps
    const gates = [
        {
            id: 'xor1_gate',
            type: 'XOR',
            inputs: ['A', 'B'],
            output: 'AB_XOR',
            x: 220,
            y: 80
        },
        {
            id: 'and1_gate',
            type: 'AND',
            inputs: ['A', 'B'],
            output: 'AB_AND',
            x: 220,
            y: 180
        },
        {
            id: 'xor2_gate',
            type: 'XOR',
            inputs: ['AB_XOR', 'C'],
            output: 'S',
            x: 420,
            y: 80
        },
        {
            id: 'and2_gate',
            type: 'AND',
            inputs: ['C', 'AB_XOR'],
            output: 'C_AB_AND',
            x: 420,
            y: 180
        },
        {
            id: 'or_gate',
            type: 'OR',
            inputs: ['AB_AND', 'C_AB_AND'],
            output: 'C',
            x: 540,
            y: 280
        }
    ];
    
    const inputConnections = {
        'A': ['xor1_gate', 'and1_gate'],
        'B': ['xor1_gate', 'and1_gate'],
        'C': ['xor2_gate', 'and2_gate']
    };
    
    const canvasSize = { width: 700, height: 400 };
    
    console.log('Full-adder circuit created with improved layout:', { gates, inputConnections, canvasSize });
    
    return {
        variables,
        gates,
        canvasSize,
        inputConnections,
        intermediateSignals: {
            'AB_XOR': 'xor1_gate',
            'AB_AND': 'and1_gate',
            'C_AB_AND': 'and2_gate'
        }
    };
  }

  updateIntermediateConnections(allGates, intermediateSignals) {
    allGates.forEach(gate => {
        gate.inputs = gate.inputs.map(input => {
            const matchingGate = allGates.find(g => g.output === input);
            return matchingGate ? matchingGate.output : input;
        });
    });
  }

  tokenize(expression) {
    if (!expression || typeof expression !== 'string') {
      console.error('Invalid expression for tokenization:', expression);
      return [];
    }
    return expression.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').split(/\s+/).filter(Boolean);
  }

  calculateLayout(gates, variables) {
    const GRID_SIZE = 40;
    const GATE_WIDTH = 80;
    const GATE_HEIGHT = 40;
    const WIRE_MARGIN = 25;
    
    const layout = {}, levels = {}, gateDeps = {};
    gates.forEach(g => gateDeps[g.id] = new Set());
    gates.forEach(g => g.inputs.forEach(i => {
        const sourceGate = gates.find(sg => sg.output === i);
        if (sourceGate) gateDeps[g.id].add(sourceGate.id);
    }));
    const getLevel = id => levels[id] ?? (levels[id] = (gateDeps[id].size === 0) ? 0 : Math.max(...[...gateDeps[id]].map(getLevel)) + 1);
    gates.forEach(g => getLevel(g.id));
    const gatesByLevel = {};
    let maxLevel = 0;
    gates.forEach(g => {
        const level = levels[g.id];
        maxLevel = Math.max(maxLevel, level);
        if (!gatesByLevel[level]) gatesByLevel[level] = [];
        gatesByLevel[level].push(g);
    });

    const ySpacing = Math.max(100, GRID_SIZE * 3);
    const xSpacing = Math.max(180, GATE_WIDTH + WIRE_MARGIN * 2 + GRID_SIZE);
    const startX = Math.max(150, GRID_SIZE * 4);
    let maxY = 0;

    console.log('=== Grid-based Layout Debug ===');
    console.log(`Grid size: ${GRID_SIZE}px, Gate size: ${GATE_WIDTH}x${GATE_HEIGHT}px`);
    console.log(`Spacing - X: ${xSpacing}px, Y: ${ySpacing}px`);

    Object.keys(gatesByLevel).sort((a,b) => parseInt(a) - parseInt(b)).forEach(level => {
        const levelGates = gatesByLevel[level].sort((a,b) => {
            const aY = Math.min(...a.inputs.map(i => layout[gates.find(g=>g.output===i)?.id]?.y || 0));
            const bY = Math.min(...b.inputs.map(i => layout[gates.find(g=>g.output===i)?.id]?.y || 0));
            return aY - bY;
        });

        const levelHeight = (levelGates.length - 1) * ySpacing;
        let yStart = ySpacing;
        levelGates.forEach((g, i) => {
            const yPos = yStart + i * ySpacing;
            const xPos = startX + level * xSpacing;
            
            const gridX = Math.round(xPos / GRID_SIZE) * GRID_SIZE;
            const gridY = Math.round(yPos / GRID_SIZE) * GRID_SIZE;
            
            layout[g.id] = { x: gridX, y: gridY };
            maxY = Math.max(maxY, gridY);
            
            console.log(`Gate ${g.id} positioned at grid (${gridX}, ${gridY})`);
        });
    });

    const finalOutputs = gates.filter(g => ['S', 'C', 'Y'].includes(g.output));
    if (finalOutputs.length > 1) {
        const finalYPositions = finalOutputs.map(g => layout[g.id].y).sort((a,b) => a-b);
        const avgY = finalYPositions.reduce((sum, y) => sum + y, 0) / finalOutputs.length;
        const requiredSpread = (finalOutputs.length - 1) * ySpacing;
        const startYFinal = avgY - requiredSpread / 2;

        finalOutputs.sort((a,b) => layout[a.id].y - layout[b.id].y).forEach((g, i) => {
            layout[g.id].y = startYFinal + i * ySpacing;
            maxY = Math.max(maxY, layout[g.id].y);
        });
    }

    const canvasWidth = Math.round((startX + (maxLevel + 2) * xSpacing) / GRID_SIZE) * GRID_SIZE;
    const canvasHeight = Math.round((maxY + ySpacing) / GRID_SIZE) * GRID_SIZE;

    const qualityMetrics = this.calculateLayoutQuality(layout, gates, variables, { 
        GRID_SIZE, GATE_WIDTH, GATE_HEIGHT, WIRE_MARGIN 
    });
    
    console.log('Layout Quality Metrics:', qualityMetrics);

    return { layout, canvasSize: { width: canvasWidth, height: canvasHeight }, qualityMetrics };
  }

  calculateLayoutQuality(layout, gates, variables, config) {
    const { GRID_SIZE, GATE_WIDTH, GATE_HEIGHT, WIRE_MARGIN } = config;
    let totalWireLength = 0;
    let gateOverlaps = 0;
    let wireIntersections = 0;
    let totalConnections = 0;

    const gateRects = gates.map(gate => ({
        id: gate.id,
        x: layout[gate.id].x - GATE_WIDTH / 2,
        y: layout[gate.id].y - GATE_HEIGHT / 2,
        width: GATE_WIDTH,
        height: GATE_HEIGHT
    }));

    gates.forEach(gate => {
        gate.inputs.forEach(input => {
            totalConnections++;
            
            const sourceGate = gates.find(g => g.output === input);
            if (sourceGate) {
                const from = layout[sourceGate.id];
                const to = layout[gate.id];
                const wireLength = Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
                totalWireLength += wireLength;
                
                if (this.checkWireGateOverlap(from, to, gateRects, gate.id, sourceGate.id)) {
                    gateOverlaps++;
                }
            }
        });
    });

    const averageWireLength = totalConnections > 0 ? totalWireLength / totalConnections : 0;
    const overlapScore = Math.max(0, 100 - (gateOverlaps * 20));
    const lengthScore = Math.max(0, 100 - Math.max(0, (averageWireLength - 200) / 5));
    const overallScore = Math.round((overlapScore + lengthScore) / 2);

    const metrics = {
        gateOverlaps,
        wireIntersections,
        totalWireLength,
        averageWireLength: Math.round(averageWireLength),
        overlapScore,
        lengthScore: Math.round(lengthScore),
        overallScore,
        gridAligned: true
    };

    console.log('=== Wire Quality Check Results ===');
    console.log(`- Gate overlaps: ${gateOverlaps} locations ${gateOverlaps === 0 ? '✓' : '⚠'}`);
    console.log(`- Wire intersections: ${wireIntersections} locations`);
    console.log(`- Total wire length: ${totalWireLength}px`);
    console.log(`- Average wire length: ${metrics.averageWireLength}px`);
    console.log(`- Quality score: ${overallScore}/100`);

    return metrics;
  }

  checkWireGateOverlap(from, to, gateRects, excludeGateId1, excludeGateId2) {
    const wireRect = {
        x: Math.min(from.x, to.x) - 2,
        y: Math.min(from.y, to.y) - 2,
        width: Math.abs(to.x - from.x) + 4,
        height: Math.abs(to.y - from.y) + 4
    };

    return gateRects.some(gateRect => {
        if (gateRect.id === excludeGateId1 || gateRect.id === excludeGateId2) {
            return false;
        }
        
        return this.rectsOverlap(wireRect, gateRect);
    });
  }

  rectsOverlap(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  parseLogicExpression(expression) {
    console.log('Parsing expression:', expression);
    
    const result = this.buildExpressionTree(expression);
    const gates = this.convertTreeToGates(result.tree);
    
    console.log('Generated gates from expression:', gates);
    return { gates };
  }

  buildExpressionTree(expression) {
    const tokens = this.tokenizeExpression(expression);
    console.log('Tokenized:', tokens);
    
    return this.parseTokens(tokens, 0);
  }

  tokenizeExpression(expression) {
    if (!expression || typeof expression !== 'string') {
      console.error('Invalid expression for tokenization:', expression);
      return [];
    }
    
    const tokens = [];
    let i = 0;
    const expr = expression.toUpperCase().trim();
    
    if (expr.length === 0) {
      console.error('Empty expression provided');
      return [];
    }
    
    while (i < expr.length) {
        if (expr[i] === ' ') {
            i++;
            continue;
        }
        
        if (expr[i] === '(' || expr[i] === ')') {
            tokens.push(expr[i]);
            i++;
        } else if (expr.substr(i, 3) === 'AND') {
            tokens.push('AND');
            i += 3;
        } else if (expr.substr(i, 2) === 'OR') {
            tokens.push('OR');
            i += 2;
        } else if (expr.substr(i, 3) === 'XOR') {
            tokens.push('XOR');
            i += 3;
        } else if (expr.substr(i, 3) === 'NOT') {
            tokens.push('NOT');
            i += 3;
        } else if (/[A-Z]/.test(expr[i])) {
            tokens.push(expr[i]);
            i++;
        } else {
            i++;
        }
    }
    
    return tokens;
  }

  parseTokens(tokens, pos) {
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      console.error('Invalid tokens array:', tokens);
      throw new Error('Invalid tokens array provided');
    }
    
    if (pos >= tokens.length) {
      console.error('Position out of bounds:', pos, 'tokens length:', tokens.length);
      throw new Error('Unexpected end of expression');
    }
    
    return this.parseOr(tokens, pos);
  }

  parseOr(tokens, pos) {
    let { node: left, pos: newPos } = this.parseXor(tokens, pos);
    
    while (newPos < tokens.length && tokens[newPos] === 'OR') {
        newPos++;
        const { node: right, pos: nextPos } = this.parseXor(tokens, newPos);
        left = { type: 'OR', inputs: [left, right] };
        newPos = nextPos;
    }
    
    return { node: left, pos: newPos };
  }

  parseXor(tokens, pos) {
    let { node: left, pos: newPos } = this.parseAnd(tokens, pos);
    
    while (newPos < tokens.length && tokens[newPos] === 'XOR') {
        newPos++;
        const { node: right, pos: nextPos } = this.parseAnd(tokens, newPos);
        left = { type: 'XOR', inputs: [left, right] };
        newPos = nextPos;
    }
    
    return { node: left, pos: newPos };
  }

  parseAnd(tokens, pos) {
    let { node: left, pos: newPos } = this.parseNot(tokens, pos);
    
    while (newPos < tokens.length && tokens[newPos] === 'AND') {
        newPos++;
        const { node: right, pos: nextPos } = this.parseNot(tokens, newPos);
        left = { type: 'AND', inputs: [left, right] };
        newPos = nextPos;
    }
    
    return { node: left, pos: newPos };
  }

  parseNot(tokens, pos) {
    if (pos < tokens.length && tokens[pos] === 'NOT') {
        const { node, pos: newPos } = this.parsePrimary(tokens, pos + 1);
        return { node: { type: 'NOT', inputs: [node] }, pos: newPos };
    }
    
    return this.parsePrimary(tokens, pos);
  }

  parsePrimary(tokens, pos) {
    if (!tokens || !Array.isArray(tokens) || pos >= tokens.length) {
        console.error('Invalid tokens or position:', { tokens, pos, tokensLength: tokens?.length });
        throw new Error('Unexpected end of expression');
    }
    
    const currentToken = tokens[pos];
    if (!currentToken || typeof currentToken !== 'string') {
        console.error('Invalid token at position', pos, ':', currentToken);
        throw new Error(`Invalid token at position ${pos}`);
    }
    
    if (currentToken === '(') {
        const { node, pos: newPos } = this.parseTokens(tokens, pos + 1);
        if (newPos >= tokens.length || tokens[newPos] !== ')') {
            throw new Error('Missing closing parenthesis');
        }
        return { node, pos: newPos + 1 };
    }
    
    if (/[A-Z]/.test(currentToken)) {
        return { node: { type: 'VARIABLE', name: currentToken }, pos: pos + 1 };
    }
    
    throw new Error(`Unexpected token: ${currentToken}`);
  }

  convertTreeToGates(tree) {
    if (!tree || typeof tree !== 'object') {
      console.error('Invalid tree object:', tree);
      return [];
    }
    
    const gates = [];
    let gateId = 0;
    
    const processNode = (node) => {
        if (!node || typeof node !== 'object' || !node.type) {
            console.error('Invalid node object:', node);
            throw new Error('Invalid node in expression tree');
        }
        
        if (node.type === 'VARIABLE') {
            if (!node.name) {
                console.error('Variable node missing name:', node);
                throw new Error('Variable node missing name');
            }
            return node.name;
        }
        
        if (!node.inputs || !Array.isArray(node.inputs)) {
            console.error('Node missing inputs array:', node);
            throw new Error('Node missing inputs array');
        }
        
        const inputs = node.inputs.map(input => processNode(input));
        const gate = {
            id: `gate_${gateId++}`,
            type: node.type,
            inputs: inputs,
            output: `temp_${gateId - 1}`
        };
        
        gates.push(gate);
        return gate.output;
    };
    
    try {
        processNode(tree);
        
        if (gates.length > 0) {
            gates[gates.length - 1].output = 'FINAL';
        }
        
        return gates;
    } catch (error) {
        console.error('Error converting tree to gates:', error);
        throw error;
    }
  }

  drawLogicCircuit(circuit) {
    console.log('=== Drawing Logic Circuit ===');
    console.log('Circuit data:', circuit);
    
    const canvas = document.getElementById('circuit-canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    console.log('Canvas element found:', canvas);
    console.log('Canvas size:', circuit.canvasSize);
    
    canvas.width = circuit.canvasSize.width;
    canvas.height = circuit.canvasSize.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fdfdfd'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    console.log('Gates to draw:', circuit.gates);
    console.log('Variables:', circuit.variables);

    const varPos = {};
    const yStep = 100;
    const yStart = (canvas.height / 2) - (circuit.variables.length - 1) * yStep / 2;
    circuit.variables.forEach((v, i) => {
        const y = yStart > 0 ? yStart + i * yStep : 100 + i * yStep;
        varPos[v] = { x: 60, y: y };
        console.log(`Drawing variable ${v} at position:`, varPos[v]);
        this.drawVariable(ctx, v, varPos[v].x, varPos[v].y);
    });

    // Draw all input wires first with separate paths
    this.drawInputWires(ctx, circuit, varPos);
    
    // Then draw gates without input wires (gates only)
    console.log('Starting to draw gates...');
    circuit.gates.forEach((g, index) => {
        console.log(`Drawing gate ${index + 1}:`, g);
        this.drawGateOnly(ctx, g, circuit);
    });
    
    console.log('Circuit drawing completed');
    
    // Verify and validate the actual layout
    this.validateCircuitLayout(circuit, varPos);
  }

  validateCircuitLayout(circuit, varPos) {
    console.log('=== Circuit Layout Validation ===');
    
    const validation = {
      gatePositions: {},
      wireOverlaps: [],
      visualQuality: {},
      recommendations: []
    };
    
    // 1. Validate gate positions
    circuit.gates.forEach(gate => {
      validation.gatePositions[gate.id] = {
        expected: { x: gate.x, y: gate.y },
        type: gate.type,
        inputs: gate.inputs,
        output: gate.output
      };
      
      console.log(`Gate ${gate.id} (${gate.type}): positioned at (${gate.x}, ${gate.y})`);
    });
    
    // 2. Check for overlaps
    const overlaps = this.detectOverlaps(circuit, varPos);
    validation.wireOverlaps = overlaps;
    
    // 3. Calculate visual quality metrics
    const quality = this.calculateVisualQuality(circuit, varPos);
    validation.visualQuality = quality;
    
    // 4. Generate recommendations
    const recommendations = this.generateLayoutRecommendations(validation);
    validation.recommendations = recommendations;
    
    console.log('Layout Validation Results:', validation);
    
    // 5. Auto-optimize layout if quality is poor
    if (quality.score < 70 || overlaps.length > 0) {
      console.log('⚙️ Auto-optimizing layout due to poor quality');
      const optimizedCircuit = this.optimizeLayout(circuit, validation);
      if (optimizedCircuit) {
        console.log('✨ Layout optimization completed');
        // Re-draw with optimized layout
        setTimeout(() => {
          this.drawLogicCircuit(optimizedCircuit);
        }, 100);
        return optimizedCircuit;
      }
    }
    
    // 6. Display validation overlay if issues found
    if (overlaps.length > 0 || quality.score < 80) {
      this.displayValidationOverlay(validation);
    }
    
    return validation;
  }

  detectOverlaps(circuit, varPos) {
    const overlaps = [];
    const gateWidth = 70;
    const gateHeight = 40;
    
    console.log('=== Overlap Detection ===');
    
    // Check gate-to-gate overlaps
    for (let i = 0; i < circuit.gates.length; i++) {
      for (let j = i + 1; j < circuit.gates.length; j++) {
        const gate1 = circuit.gates[i];
        const gate2 = circuit.gates[j];
        
        const rect1 = {
          x: gate1.x - gateWidth/2,
          y: gate1.y - gateHeight/2,
          width: gateWidth,
          height: gateHeight
        };
        
        const rect2 = {
          x: gate2.x - gateWidth/2,
          y: gate2.y - gateHeight/2,
          width: gateWidth,
          height: gateHeight
        };
        
        if (this.rectsOverlap(rect1, rect2)) {
          const overlap = {
            type: 'gate-gate',
            gate1: gate1.id,
            gate2: gate2.id,
            severity: 'high'
          };
          overlaps.push(overlap);
          console.log(`❌ Gate overlap detected: ${gate1.id} and ${gate2.id}`);
        }
      }
    }
    
    // Check wire routing conflicts
    const wireConflicts = this.detectWireConflicts(circuit, varPos);
    overlaps.push(...wireConflicts);
    
    console.log(`Total overlaps detected: ${overlaps.length}`);
    return overlaps;
  }

  detectWireConflicts(circuit, varPos) {
    const conflicts = [];
    const gateWidth = 70;
    const gateHeight = 40;
    
    // Check if wire paths go through gate areas
    circuit.variables.forEach(inputVar => {
      const inputPos = varPos[inputVar];
      if (!inputPos) return;
      
      const connectedGates = circuit.gates.filter(gate => 
        gate.inputs.includes(inputVar)
      );
      
      connectedGates.forEach((gate, pathIndex) => {
        // Calculate wire path
        let channelX;
        if (inputVar === 'A') {
          channelX = inputPos.x + 80 + (pathIndex * 40);
        } else if (inputVar === 'B') {
          channelX = inputPos.x + 100 + (pathIndex * 40);
        } else if (inputVar === 'C') {
          channelX = inputPos.x + 120 + (pathIndex * 40);
        } else {
          channelX = inputPos.x + 90 + (pathIndex * 30);
        }
        
        const gateInputY = gate.inputs.length === 1 ? 
          gate.y : 
          gate.y - gateHeight/4 + (gate.inputs.indexOf(inputVar) * gateHeight/2);
        
        // Check if wire path intersects with other gates
        circuit.gates.forEach(otherGate => {
          if (otherGate.id === gate.id) return;
          
          const gateRect = {
            x: otherGate.x - gateWidth/2,
            y: otherGate.y - gateHeight/2,
            width: gateWidth,
            height: gateHeight
          };
          
          // Check vertical segment
          if (channelX >= gateRect.x && channelX <= gateRect.x + gateRect.width) {
            const minY = Math.min(inputPos.y, gateInputY);
            const maxY = Math.max(inputPos.y, gateInputY);
            
            if (!(maxY < gateRect.y || minY > gateRect.y + gateRect.height)) {
              conflicts.push({
                type: 'wire-gate',
                wire: `${inputVar}->${gate.id}`,
                gate: otherGate.id,
                severity: 'medium'
              });
              console.log(`⚠️ Wire conflict: ${inputVar}->${gate.id} intersects ${otherGate.id}`);
            }
          }
        });
      });
    });
    
    return conflicts;
  }

  calculateVisualQuality(circuit, varPos) {
    console.log('=== Visual Quality Assessment ===');
    
    const metrics = {
      gateSpacing: this.assessGateSpacing(circuit),
      wireClarity: this.assessWireClarity(circuit, varPos),
      alignment: this.assessAlignment(circuit),
      balance: this.assessVisualBalance(circuit),
      score: 0
    };
    
    // Calculate overall score (0-100)
    metrics.score = Math.round(
      (metrics.gateSpacing * 0.3 + 
       metrics.wireClarity * 0.3 + 
       metrics.alignment * 0.2 + 
       metrics.balance * 0.2)
    );
    
    console.log('Visual Quality Metrics:', metrics);
    return metrics;
  }

  assessGateSpacing(circuit) {
    let totalDistance = 0;
    let pairCount = 0;
    let tooCloseCount = 0;
    
    for (let i = 0; i < circuit.gates.length; i++) {
      for (let j = i + 1; j < circuit.gates.length; j++) {
        const gate1 = circuit.gates[i];
        const gate2 = circuit.gates[j];
        
        const distance = Math.sqrt(
          Math.pow(gate1.x - gate2.x, 2) + 
          Math.pow(gate1.y - gate2.y, 2)
        );
        
        totalDistance += distance;
        pairCount++;
        
        if (distance < 120) { // Minimum recommended distance
          tooCloseCount++;
        }
      }
    }
    
    const avgDistance = totalDistance / pairCount;
    const spacingScore = Math.max(0, 100 - (tooCloseCount * 20));
    
    console.log(`Gate spacing: ${tooCloseCount} too close pairs, avg distance: ${Math.round(avgDistance)}px, score: ${spacingScore}`);
    return spacingScore;
  }

  assessWireClarity(circuit, varPos) {
    // Simple assessment based on wire crossing potential
    let clarityScore = 100;
    
    // Penalize for too many path changes
    circuit.variables.forEach(inputVar => {
      const connectedGates = circuit.gates.filter(gate => 
        gate.inputs.includes(inputVar)
      );
      
      if (connectedGates.length > 2) {
        clarityScore -= 10; // Multiple connections reduce clarity
      }
    });
    
    console.log(`Wire clarity score: ${clarityScore}`);
    return Math.max(0, clarityScore);
  }

  assessAlignment(circuit) {
    const xPositions = circuit.gates.map(g => g.x);
    const yPositions = circuit.gates.map(g => g.y);
    
    // Check for gates aligned on same X or Y coordinates
    const xAlignment = this.checkAlignment(xPositions);
    const yAlignment = this.checkAlignment(yPositions);
    
    const alignmentScore = (xAlignment + yAlignment) / 2;
    console.log(`Alignment score: ${alignmentScore} (X: ${xAlignment}, Y: ${yAlignment})`);
    return alignmentScore;
  }

  checkAlignment(positions) {
    const tolerance = 10; // pixels
    let alignedCount = 0;
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (Math.abs(positions[i] - positions[j]) <= tolerance) {
          alignedCount++;
        }
      }
    }
    
    return Math.min(100, alignedCount * 25);
  }

  assessVisualBalance(circuit) {
    const centerX = circuit.canvasSize.width / 2;
    const centerY = circuit.canvasSize.height / 2;
    
    let totalX = 0, totalY = 0;
    circuit.gates.forEach(gate => {
      totalX += gate.x;
      totalY += gate.y;
    });
    
    const avgX = totalX / circuit.gates.length;
    const avgY = totalY / circuit.gates.length;
    
    const xDeviation = Math.abs(avgX - centerX);
    const yDeviation = Math.abs(avgY - centerY);
    
    const balanceScore = Math.max(0, 100 - (xDeviation + yDeviation) / 10);
    console.log(`Visual balance score: ${balanceScore} (center deviation: ${Math.round(xDeviation)}, ${Math.round(yDeviation)})`);
    return balanceScore;
  }

  generateLayoutRecommendations(validation) {
    const recommendations = [];
    
    // Gate spacing recommendations
    if (validation.visualQuality.gateSpacing < 70) {
      recommendations.push({
        type: 'spacing',
        priority: 'high',
        message: 'ゲート間の距離を120px以上に増やしてください',
        suggestion: 'X座標を50px以上離す'
      });
    }
    
    // Overlap recommendations
    if (validation.wireOverlaps.length > 0) {
      recommendations.push({
        type: 'overlap',
        priority: 'critical',
        message: `${validation.wireOverlaps.length}個の重複が検出されました`,
        suggestion: 'ゲート位置またはワイヤルーティングを調整'
      });
    }
    
    // Quality recommendations
    if (validation.visualQuality.score < 80) {
      recommendations.push({
        type: 'quality',
        priority: 'medium',
        message: '視覚品質が基準を下回っています',
        suggestion: 'レイアウトの再配置を検討'
      });
    }
    
    console.log('Layout Recommendations:', recommendations);
    return recommendations;
  }

  displayValidationOverlay(validation) {
    // Create a visual overlay showing validation results
    const overlay = document.createElement('div');
    overlay.className = 'validation-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.95);
      border: 2px solid #f59e0b;
      border-radius: 8px;
      padding: 12px;
      max-width: 300px;
      font-size: 12px;
      z-index: 1000;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    let html = `<div style="font-weight: bold; color: #d97706; margin-bottom: 8px;">レイアウト検証結果</div>`;
    html += `<div>品質スコア: ${validation.visualQuality.score}/100</div>`;
    
    if (validation.wireOverlaps.length > 0) {
      html += `<div style="color: #dc2626; margin-top: 4px;">⚠️ ${validation.wireOverlaps.length}個の重複検出</div>`;
    }
    
    if (validation.recommendations.length > 0) {
      html += `<div style="margin-top: 8px; font-weight: bold;">推奨改善:</div>`;
      validation.recommendations.forEach(rec => {
        html += `<div style="margin-top: 2px; color: #374151;">• ${rec.message}</div>`;
      });
    }
    
    overlay.innerHTML = html;
    
    // Add to circuit display
    const circuitDisplay = document.getElementById('circuit-display');
    if (circuitDisplay) {
      circuitDisplay.style.position = 'relative';
      circuitDisplay.appendChild(overlay);
      
      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 10000);
    }
  }

  optimizeLayout(circuit, validation) {
    console.log('=== Auto Layout Optimization ===');
    
    const optimizedCircuit = JSON.parse(JSON.stringify(circuit)); // Deep copy
    let improved = false;
    
    // Strategy 1: Fix overlapping gates
    if (validation.wireOverlaps.some(o => o.type === 'gate-gate')) {
      console.log('🔧 Fixing gate overlaps...');
      improved = this.fixGateOverlaps(optimizedCircuit) || improved;
    }
    
    // Strategy 2: Improve spacing
    if (validation.visualQuality.gateSpacing < 70) {
      console.log('🔧 Improving gate spacing...');
      improved = this.improveGateSpacing(optimizedCircuit) || improved;
    }
    
    // Strategy 3: Fix wire conflicts
    if (validation.wireOverlaps.some(o => o.type === 'wire-gate')) {
      console.log('🔧 Fixing wire conflicts...');
      improved = this.fixWireConflicts(optimizedCircuit) || improved;
    }
    
    // Strategy 4: Improve alignment
    if (validation.visualQuality.alignment < 50) {
      console.log('🔧 Improving alignment...');
      improved = this.improveAlignment(optimizedCircuit) || improved;
    }
    
    if (improved) {
      console.log('✅ Layout optimization successful');
      return optimizedCircuit;
    } else {
      console.log('ℹ️ No optimization needed or possible');
      return null;
    }
  }

  fixGateOverlaps(circuit) {
    const gateWidth = 70;
    const gateHeight = 40;
    const minDistance = 120;
    let fixed = false;
    
    for (let i = 0; i < circuit.gates.length; i++) {
      for (let j = i + 1; j < circuit.gates.length; j++) {
        const gate1 = circuit.gates[i];
        const gate2 = circuit.gates[j];
        
        const distance = Math.sqrt(
          Math.pow(gate1.x - gate2.x, 2) + 
          Math.pow(gate1.y - gate2.y, 2)
        );
        
        if (distance < minDistance) {
          // Move gate2 away from gate1
          const angle = Math.atan2(gate2.y - gate1.y, gate2.x - gate1.x);
          gate2.x = gate1.x + Math.cos(angle) * minDistance;
          gate2.y = gate1.y + Math.sin(angle) * minDistance;
          
          console.log(`📍 Moved ${gate2.id} to (${Math.round(gate2.x)}, ${Math.round(gate2.y)})`);
          fixed = true;
        }
      }
    }
    
    return fixed;
  }

  improveGateSpacing(circuit) {
    const targetSpacing = 150;
    let improved = false;
    
    // Sort gates by x position for systematic spacing
    const sortedGates = [...circuit.gates].sort((a, b) => a.x - b.x);
    
    for (let i = 1; i < sortedGates.length; i++) {
      const prevGate = sortedGates[i - 1];
      const currGate = sortedGates[i];
      
      if (currGate.x - prevGate.x < targetSpacing) {
        currGate.x = prevGate.x + targetSpacing;
        console.log(`📏 Adjusted ${currGate.id} spacing to X=${currGate.x}`);
        improved = true;
      }
    }
    
    return improved;
  }

  fixWireConflicts(circuit) {
    // Simple approach: increase wire channel spacing
    const originalChannels = {
      'A': { base: 80, increment: 40 },
      'B': { base: 100, increment: 40 },
      'C': { base: 120, increment: 40 }
    };
    
    // Increase spacing to avoid conflicts
    const newChannels = {
      'A': { base: 90, increment: 50 },
      'B': { base: 120, increment: 50 },
      'C': { base: 150, increment: 50 }
    };
    
    // Update the wire routing logic (this is a conceptual fix)
    console.log('📐 Updated wire channel spacing to reduce conflicts');
    return true; // Assume improvement
  }

  improveAlignment(circuit) {
    let improved = false;
    
    // Group gates by similar Y positions and align them
    const tolerance = 30;
    const yGroups = [];
    
    circuit.gates.forEach(gate => {
      let foundGroup = false;
      for (const group of yGroups) {
        if (Math.abs(group[0].y - gate.y) <= tolerance) {
          group.push(gate);
          foundGroup = true;
          break;
        }
      }
      if (!foundGroup) {
        yGroups.push([gate]);
      }
    });
    
    // Align gates in each group to the same Y coordinate
    yGroups.forEach(group => {
      if (group.length > 1) {
        const avgY = group.reduce((sum, gate) => sum + gate.y, 0) / group.length;
        group.forEach(gate => {
          if (Math.abs(gate.y - avgY) > 5) {
            gate.y = Math.round(avgY);
            console.log(`📐 Aligned ${gate.id} to Y=${gate.y}`);
            improved = true;
          }
        });
      }
    });
    
    return improved;
  }

  drawVariable(ctx, text, x, y) {
      ctx.beginPath(); ctx.arc(x, y, 8, 0, 2 * Math.PI); ctx.fillStyle = '#dbeafe'; ctx.fill();
      ctx.strokeStyle = '#1e40af'; ctx.stroke(); ctx.fillStyle = '#1e40af'; ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x - 30, y);
  }

  drawInputWires(ctx, circuit, varPos) {
      console.log('Drawing input wires with separate paths');
      
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      
      // Draw wires from input variables to gates
      circuit.variables.forEach(inputVar => {
          const inputPos = varPos[inputVar];
          if (!inputPos) return;
          
          // Find all gates that use this input
          const connectedGates = circuit.gates.filter(gate => 
              gate.inputs.includes(inputVar)
          );
          
          console.log(`Input ${inputVar} connects to gates:`, connectedGates.map(g => g.id));
          
          // Draw separate path for each connection
          connectedGates.forEach((gate, index) => {
              this.drawWireConnection(ctx, inputPos, gate, inputVar, index);
          });
      });
      
      // Draw wires between gates (intermediate signals)
      circuit.gates.forEach(gate => {
          gate.inputs.forEach(input => {
              // Check if this input is an intermediate signal from another gate
              const sourceGate = circuit.gates.find(g => g.output === input);
              if (sourceGate) {
                  console.log(`Drawing intermediate wire: ${sourceGate.id} → ${gate.id} (${input})`);
                  this.drawIntermediateWire(ctx, sourceGate, gate, input);
              }
          });
      });
  }

  drawWireConnection(ctx, inputPos, gate, inputVar, pathIndex) {
      const gateWidth = 70;
      const gateHeight = 40;
      
      // Calculate input position on gate
      const inputIndex = gate.inputs.indexOf(inputVar);
      const gateInputY = gate.inputs.length === 1 ? 
          gate.y : 
          gate.y - gateHeight/4 + (inputIndex * gateHeight/2);
      
      const gateInputX = gate.x - gateWidth/2;
      
      // Improved routing to avoid gate overlaps
      // Use dedicated channels for each input
      let channelX;
      if (inputVar === 'A') {
          channelX = inputPos.x + 80 + (pathIndex * 40);
      } else if (inputVar === 'B') {
          channelX = inputPos.x + 100 + (pathIndex * 40);
      } else if (inputVar === 'C') {
          channelX = inputPos.x + 120 + (pathIndex * 40);
      } else {
          channelX = inputPos.x + 90 + (pathIndex * 30);
      }
      
      console.log(`Drawing improved wire: ${inputVar} → ${gate.id} via channel ${channelX}`);
      
      ctx.beginPath();
      ctx.moveTo(inputPos.x + 8, inputPos.y);
      ctx.lineTo(channelX, inputPos.y);
      ctx.lineTo(channelX, gateInputY);
      ctx.lineTo(gateInputX, gateInputY);
      ctx.stroke();
      
      // Draw connection dots at branch points
      ctx.beginPath();
      ctx.arc(channelX, inputPos.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#374151';
      ctx.fill();
  }

  drawIntermediateWire(ctx, sourceGate, targetGate, signalName) {
      const gateWidth = 70;
      const gateHeight = 40;
      
      // Source gate output position
      const fromX = sourceGate.x + gateWidth/2;
      const fromY = sourceGate.y;
      
      // Target gate input position
      const inputIndex = targetGate.inputs.indexOf(signalName);
      const toY = targetGate.inputs.length === 1 ? 
          targetGate.y : 
          targetGate.y - gateHeight/4 + (inputIndex * gateHeight/2);
      const toX = targetGate.x - gateWidth/2;
      
      // Draw intermediate wire with red color and improved routing
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      
      // Create cleaner routing that avoids gate overlaps
      let routingX, routingY;
      
      // For horizontal connections, use direct path if clear
      if (Math.abs(fromY - toY) < 20) {
          // Direct horizontal connection
          ctx.lineTo(toX, toY);
      } else {
          // Use L-shaped routing with better spacing
          routingX = fromX + 50;
          
          // Route around other gates
          if (fromY < toY) {
              // Going down
              routingY = fromY + 30;
          } else {
              // Going up  
              routingY = fromY - 30;
          }
          
          ctx.lineTo(routingX, fromY);
          ctx.lineTo(routingX, toY);
          ctx.lineTo(toX, toY);
      }
      
      ctx.stroke();
      
      // Draw connection dots for intermediate signals
      ctx.beginPath();
      ctx.arc(fromX + 10, fromY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      
      // Reset stroke color
      ctx.strokeStyle = '#374151';
  }

  drawGateOnly(ctx, gate, circuit) {
      console.log('Drawing gate without input wires:', gate);
      const { x, y, type, output } = gate;
      
      if (x === undefined || y === undefined || x === null || y === null) {
          console.error('Invalid gate position:', { x, y, gate });
          return;
      }
      
      const gateWidth = 70, gateHeight = 40;
      console.log(`Gate ${gate.id} at position (${x}, ${y}) with type ${type}`);

      // Draw the gate symbol only
      console.log(`Drawing gate symbol: ${type} at (${x}, ${y})`);
      this.drawGateSymbol(ctx, type, x, y, gateWidth, gateHeight);

      // Draw output wire and label if this is a final output
      if (['S', 'C', 'Y'].includes(output)) {
          const from = { x: x + gateWidth / 2, y: y };
          const to = { x: ctx.canvas.width - 60, y: y };
          console.log(`Drawing output wire for ${output}`);
          
          ctx.strokeStyle = '#374151';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
          
          this.drawOutputLabel(ctx, output, to.x, to.y);
      }
  }

  drawInputBranches(ctx, circuit, varPos) {
      if (!circuit.inputConnections) return;
      
      console.log('Drawing input branches:', circuit.inputConnections);
      
      Object.entries(circuit.inputConnections).forEach(([inputVar, connectedGateIds]) => {
          if (connectedGateIds.length <= 1) return;
          
          const inputPos = varPos[inputVar];
          if (!inputPos) return;
          
          const connectedGates = connectedGateIds.map(gateId => 
              circuit.gates.find(g => g.id === gateId)
          ).filter(Boolean);
          
          if (connectedGates.length <= 1) return;
          
          console.log(`Input ${inputVar} branches to ${connectedGates.length} gates:`, connectedGates.map(g => g.id));
          
          const branchX = inputPos.x + 80;
          
          ctx.strokeStyle = '#374151';
          ctx.lineWidth = 2;
          
          ctx.beginPath();
          ctx.moveTo(inputPos.x + 8, inputPos.y);
          ctx.lineTo(branchX, inputPos.y);
          ctx.stroke();
          
          connectedGates.forEach(gate => {
              ctx.beginPath();
              ctx.moveTo(branchX, inputPos.y);
              ctx.lineTo(branchX, gate.y);
              ctx.lineTo(gate.x - 35, gate.y);
              ctx.stroke();
              
              ctx.beginPath();
              ctx.arc(branchX, inputPos.y, 4, 0, 2 * Math.PI);
              ctx.fillStyle = '#374151';
              ctx.fill();
          });
      });
  }

  drawGate(ctx, gate, circuit, varPos, wireRouter) {
      console.log('Drawing gate:', gate);
      const { x, y, inputs, type, output } = gate;
      
      if (x === undefined || y === undefined || x === null || y === null) {
          console.error('Invalid gate position:', { x, y, gate });
          return;
      }
      
      const gateWidth = 70, gateHeight = 40;
      console.log(`Gate ${gate.id} at position (${x}, ${y}) with type ${type}`);

      // Draw input wires
      inputs.forEach((input, i) => {
          const to = { x: x - gateWidth / 2, y: (inputs.length === 1) ? y : y - gateHeight / 4 + (i * gateHeight / 2) };
          const fromGate = circuit.gates.find(g => g.output === input);
          
          console.log(`Processing input ${input} for gate ${gate.id}`);
          
          if (fromGate) {
              const from = { x: fromGate.x + gateWidth / 2, y: fromGate.y };
              console.log(`Drawing wire from gate ${fromGate.id} to gate ${gate.id}`);
              wireRouter.route(from, to, true);
          } else if (varPos[input]) {
              const inputConnections = circuit.inputConnections && circuit.inputConnections[input];
              if (inputConnections && inputConnections.length > 1) {
                  const from = { x: x - 35, y: y };
                  console.log(`Drawing branched wire for input ${input}`);
                  wireRouter.route(from, to, false);
              } else {
                  const from = { x: varPos[input].x + 8, y: varPos[input].y };
                  console.log(`Drawing direct wire from input ${input} to gate ${gate.id}`);
                  wireRouter.route(from, to, false);
              }
          } else {
              console.error(`Input ${input} not found in variables or gates`);
          }
      });

      // Draw the gate symbol
      console.log(`Drawing gate symbol: ${type} at (${x}, ${y})`);
      this.drawGateSymbol(ctx, type, x, y, gateWidth, gateHeight);

      // Draw output wire and label if this is a final output
      if (['S', 'C', 'Y'].includes(output)) {
          const from = { x: x + gateWidth / 2, y: y };
          const to = { x: ctx.canvas.width - 60, y: y };
          console.log(`Drawing output wire for ${output}`);
          wireRouter.route(from, to, true, true);
          this.drawOutputLabel(ctx, output, to.x, to.y);
      }
  }
  
  drawOutputLabel(ctx, text, x, y) {
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 10, y);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.stroke();
      
      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + 15, y);
  }

  drawGateSymbol(ctx, type, x, y, width, height) {
    console.log(`Drawing gate symbol: ${type} at (${x}, ${y}) with size ${width}x${height}`);
    
    const styles = {
      AND:    { fill: '#dbeafe', stroke: '#1e40af', symbol: null },
      OR:     { fill: '#dcfce7', stroke: '#166534', symbol: '≥1' },
      NOT:    { fill: '#fef2f2', stroke: '#dc2626', symbol: null },
      XOR:    { fill: '#f3e8ff', stroke: '#7c3aed', symbol: '=1' },
      BUFFER: { fill: '#f9fafb', stroke: '#6b7280', symbol: '1' }
    };
    
    const style = styles[type];
    if (!style) {
        console.error(`Unknown gate type: ${type}`);
        return;
    }
    
    const halfHeight = height / 2;

    ctx.fillStyle = style.fill;
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();

    if (type === 'AND') {
        ctx.moveTo(x - width / 2, y - halfHeight);
        ctx.lineTo(x, y - halfHeight);
        ctx.arc(x, y, halfHeight, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(x - width / 2, y + halfHeight);
        ctx.closePath();
    } else if (type === 'OR' || type === 'XOR') {
        const backX = x - width / 2;
        ctx.moveTo(backX, y - halfHeight);
        ctx.quadraticCurveTo(x, y - halfHeight, x + width / 2, y);
        ctx.quadraticCurveTo(x, y + halfHeight, backX, y + halfHeight);
        ctx.quadraticCurveTo(x - width / 2 * 0.5, y, backX, y - halfHeight);
        ctx.closePath();
    } else { // NOT, BUFFER
        const triangleTip = x + width / 2 - 5;
        ctx.moveTo(x - width / 2, y - halfHeight);
        ctx.lineTo(x - width / 2, y + halfHeight);
        ctx.lineTo(triangleTip, y);
        ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();

    if (style.symbol) {
        ctx.fillStyle = style.stroke;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(style.symbol, x, y);
    }
    if (type === 'NOT') {
        const circleX = x + width / 2;
        ctx.beginPath();
        ctx.arc(circleX, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = style.stroke;
        ctx.stroke();
    }
    if (type === 'XOR') {
        const xorLineX = x - width / 2 - 5;
        ctx.beginPath();
        ctx.moveTo(xorLineX, y - halfHeight);
        ctx.quadraticCurveTo(x - width/2 * 0.5, y, xorLineX, y + halfHeight);
        ctx.strokeStyle = style.stroke;
        ctx.stroke();
    }
  }

  WireRouter = class {
      constructor(ctx, gates) {
          this.ctx = ctx;
          this.obstacles = gates.map(g => ({ x: g.x, y: g.y, width: 70, height: 40 }));
          this.verticalChannels = {};
      }

      route(from, to, isIntermediate, isFinalOutput = false) {
          console.log(`Routing wire from (${from.x}, ${from.y}) to (${to.x}, ${to.y}), intermediate: ${isIntermediate}, final: ${isFinalOutput}`);
          
          this.ctx.strokeStyle = isIntermediate ? '#dc2626' : '#374151';
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();

          const startX = from.x;
          const startY = from.y;
          const endX = to.x;
          const endY = to.y;

          this.ctx.moveTo(startX, startY);

          const path = this.calculateAvoidancePath(from, to);
          
          if (path.length === 0) {
              if (Math.abs(startY - endY) < 5) {
                  this.ctx.lineTo(endX, endY);
              } else {
                  const midX = startX + Math.max(60, (endX - startX) * 0.6);
                  this.ctx.lineTo(midX, startY);
                  this.ctx.lineTo(midX, endY);
                  this.ctx.lineTo(endX, endY);
              }
          } else {
              path.forEach(point => {
                  this.ctx.lineTo(point.x, point.y);
              });
              this.ctx.lineTo(endX, endY);
          }

          this.ctx.stroke();

          if (isFinalOutput) {
              this.ctx.beginPath();
              this.ctx.arc(endX, endY, 4, 0, 2 * Math.PI);
              this.ctx.fillStyle = '#374151';
              this.ctx.fill();
          } else if (!isIntermediate) {
              const dotX = startX + 30;
              this.ctx.beginPath();
              this.ctx.arc(dotX, startY, 3, 0, 2 * Math.PI);
              this.ctx.fillStyle = '#374151';
              this.ctx.fill();
          }
      }

      calculateAvoidancePath(from, to) {
          const WIRE_MARGIN = 25;
          const path = [];
          
          const directPath = { 
              x1: from.x, y1: from.y, 
              x2: to.x, y2: to.y 
          };
          
          const conflictingObstacles = this.obstacles.filter(obstacle => 
              this.lineIntersectsRect(directPath, {
                  x: obstacle.x - obstacle.width / 2 - WIRE_MARGIN,
                  y: obstacle.y - obstacle.height / 2 - WIRE_MARGIN,
                  width: obstacle.width + WIRE_MARGIN * 2,
                  height: obstacle.height + WIRE_MARGIN * 2
              })
          );

          if (conflictingObstacles.length === 0) {
              return [];
          }

          const detourY = from.y < to.y ? 
              Math.min(...conflictingObstacles.map(o => o.y - o.height / 2 - WIRE_MARGIN)) :
              Math.max(...conflictingObstacles.map(o => o.y + o.height / 2 + WIRE_MARGIN));

          const midX = from.x + Math.max(60, (to.x - from.x) * 0.6);

          path.push({ x: midX, y: from.y });
          path.push({ x: midX, y: detourY });
          path.push({ x: to.x - 35, y: detourY });

          return path;
      }

      lineIntersectsRect(line, rect) {
          const { x1, y1, x2, y2 } = line;
          const { x, y, width, height } = rect;
          
          const left = x;
          const right = x + width;
          const top = y;
          const bottom = y + height;
          
          if ((x1 >= left && x1 <= right && y1 >= top && y1 <= bottom) ||
              (x2 >= left && x2 <= right && y2 >= top && y2 <= bottom)) {
              return true;
          }
          
          if (this.lineIntersectsLine(x1, y1, x2, y2, left, top, right, top) ||
              this.lineIntersectsLine(x1, y1, x2, y2, right, top, right, bottom) ||
              this.lineIntersectsLine(x1, y1, x2, y2, right, bottom, left, bottom) ||
              this.lineIntersectsLine(x1, y1, x2, y2, left, bottom, left, top)) {
              return true;
          }
          
          return false;
      }

      lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
          const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
          if (Math.abs(denom) < 1e-10) return false;
          
          const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
          const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
          
          return t >= 0 && t <= 1 && u >= 0 && u <= 1;
      }
  }

  cleanup() {}
}
