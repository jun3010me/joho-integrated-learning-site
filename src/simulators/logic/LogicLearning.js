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

    if (expressionsToProcess.every(e => !e.formula)) {
      alert('論理式を入力または選択してください');
      return;
    }

    try {
      const allFormulas = expressionsToProcess.map(e => e.formula).join(' ');
      const variables = this.extractVariables(allFormulas);
      const table = this.createTruthTable(expressionsToProcess, variables);
      this.displayTruthTable(table);
      const mergedCircuit = this.createMergedCircuit(expressionsToProcess, variables);
      this.displayCircuitDiagram(mergedCircuit);
    } catch (error) {
      console.error('❌ Error:', error);
      const msg = error.message || 'An unknown error occurred.';
      document.getElementById('truth-table-display').innerHTML = `<div class="text-red-600 text-center">⚠️ ${msg}</div>`;
      document.getElementById('circuit-display').innerHTML = `<div class="text-red-600 text-center">⚠️ ${msg}</div>`;
    }
  }

  extractVariables(expression) {
    const matches = expression.toUpperCase().match(/\b[A-D]\b/g);
    return [...new Set(matches || [])].sort();
  }

  createTruthTable(expressions, variables) {
    const rows = Math.pow(2, variables.length);
    const table = [];
    for (let i = 0; i < rows; i++) {
      const row = { inputs: {}, results: {} };
      for (let j = 0; j < variables.length; j++) {
        row.inputs[variables[j]] = (i >> (variables.length - 1 - j)) & 1;
      }
      expressions.forEach(expr => {
        row.results[expr.name] = this.evaluateExpression(expr.formula, row.inputs);
      });
      table.push(row);
    }
    return { expressions, variables, table };
  }

  evaluateExpression(expression, values) {
    const upperExpr = expression.toUpperCase();
    const tokens = this.tokenize(upperExpr);

    const jsTokens = tokens.map(token => {
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
    const inputConnections = {};
    const allGates = [];
    const outputToGateMap = {};
    const intermediateSignals = {};
    let gateCounter = 0;

    console.log('=== Circuit Generation Debug ===');
    console.log('Input expressions:', expressions);

    expressions.forEach((expr, exprIndex) => {
        console.log(`\nProcessing expression ${exprIndex + 1}: ${expr.name} = ${expr.formula}`);
        
        const { gates: parsedGates } = this.parseLogicExpression(expr.formula);
        console.log('Parsed gates:', parsedGates);

        parsedGates.forEach((gate, gateIndex) => {
            const gateId = `gate_${gateCounter++}`;
            let outputName;
            
            if (gateIndex === parsedGates.length - 1) {
                outputName = expr.name;
            } else {
                outputName = `intermediate_${gateId}`;
                intermediateSignals[outputName] = gateId;
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

    const { layout, canvasSize } = this.calculateLayout(allGates, variables);
    allGates.forEach(gate => {
        const pos = layout[gate.id];
        gate.x = pos?.x || 250;
        gate.y = pos?.y || 150;
    });

    return { 
        variables, 
        gates: allGates, 
        canvasSize,
        inputConnections,
        intermediateSignals
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
    return expression.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').split(/\s+/).filter(Boolean);
  }

  calculateLayout(gates, variables) {
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

    const ySpacing = 100;
    const xSpacing = 180;
    const startX = 150;
    let maxY = 0;

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
            layout[g.id] = { x: startX + level * xSpacing, y: yPos };
            maxY = Math.max(maxY, yPos);
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

    const canvasWidth = startX + (maxLevel + 2) * xSpacing;
    const canvasHeight = maxY + ySpacing;

    return { layout, canvasSize: { width: canvasWidth, height: canvasHeight } };
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
    const tokens = [];
    let i = 0;
    const expr = expression.toUpperCase().trim();
    
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
    if (pos >= tokens.length) {
        throw new Error('Unexpected end of expression');
    }
    
    if (tokens[pos] === '(') {
        const { node, pos: newPos } = this.parseTokens(tokens, pos + 1);
        if (newPos >= tokens.length || tokens[newPos] !== ')') {
            throw new Error('Missing closing parenthesis');
        }
        return { node, pos: newPos + 1 };
    }
    
    if (/[A-Z]/.test(tokens[pos])) {
        return { node: { type: 'VARIABLE', name: tokens[pos] }, pos: pos + 1 };
    }
    
    throw new Error(`Unexpected token: ${tokens[pos]}`);
  }

  convertTreeToGates(tree) {
    const gates = [];
    let gateId = 0;
    
    const processNode = (node) => {
        if (node.type === 'VARIABLE') {
            return node.name;
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
    
    processNode(tree);
    
    if (gates.length > 0) {
        gates[gates.length - 1].output = 'FINAL';
    }
    
    return gates;
  }

  drawLogicCircuit(circuit) {
    const canvas = document.getElementById('circuit-canvas');
    if (!canvas) return;
    canvas.width = circuit.canvasSize.width;
    canvas.height = circuit.canvasSize.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fdfdfd'; ctx.fillRect(0, 0, canvas.width, canvas.height);

    const varPos = {};
    const yStep = 100;
    const yStart = (canvas.height / 2) - (circuit.variables.length - 1) * yStep / 2;
    circuit.variables.forEach((v, i) => {
        const y = yStart > 0 ? yStart + i * yStep : 100 + i * yStep;
        varPos[v] = { x: 60, y: y };
        this.drawVariable(ctx, v, varPos[v].x, varPos[v].y);
    });

    this.drawInputBranches(ctx, circuit, varPos);
    const wireRouter = new this.WireRouter(ctx, circuit.gates);
    circuit.gates.forEach(g => this.drawGate(ctx, g, circuit, varPos, wireRouter));
  }

  drawVariable(ctx, text, x, y) {
      ctx.beginPath(); ctx.arc(x, y, 8, 0, 2 * Math.PI); ctx.fillStyle = '#dbeafe'; ctx.fill();
      ctx.strokeStyle = '#1e40af'; ctx.stroke(); ctx.fillStyle = '#1e40af'; ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x - 30, y);
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
      const { x, y, inputs, type, output } = gate;
      const gateWidth = 70, gateHeight = 40;

      inputs.forEach((input, i) => {
          const to = { x: x - gateWidth / 2, y: (inputs.length === 1) ? y : y - gateHeight / 4 + (i * gateHeight / 2) };
          const fromGate = circuit.gates.find(g => g.output === input);
          
          if (fromGate) {
              const from = { x: fromGate.x + gateWidth / 2, y: fromGate.y };
              wireRouter.route(from, to, true);
          } else if (varPos[input]) {
              const inputConnections = circuit.inputConnections && circuit.inputConnections[input];
              if (inputConnections && inputConnections.length > 1) {
                  const from = { x: x - 35, y: y };
                  wireRouter.route(from, to, false);
              } else {
                  const from = { x: varPos[input].x + 8, y: varPos[input].y };
                  wireRouter.route(from, to, false);
              }
          }
      });

      this.drawGateSymbol(ctx, type, x, y, gateWidth, gateHeight);

      if (['S', 'C', 'Y'].includes(output)) {
          const from = { x: x + gateWidth / 2, y: y };
          const to = { x: ctx.canvas.width - 60, y: y };
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
    const styles = {
      AND:    { fill: '#dbeafe', stroke: '#1e40af', symbol: null },
      OR:     { fill: '#dcfce7', stroke: '#166534', symbol: '≥1' },
      NOT:    { fill: '#fef2f2', stroke: '#dc2626', symbol: null },
      XOR:    { fill: '#f3e8ff', stroke: '#7c3aed', symbol: '=1' },
      BUFFER: { fill: '#f9fafb', stroke: '#6b7280', symbol: '1' }
    };
    const style = styles[type];
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
          this.ctx.strokeStyle = isIntermediate ? '#dc2626' : '#374151';
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();

          const startX = from.x;
          const startY = from.y;
          const endX = to.x;
          const endY = to.y;

          this.ctx.moveTo(startX, startY);

          if (Math.abs(startY - endY) < 5) {
              this.ctx.lineTo(endX, endY);
          } else {
              const midX = startX + Math.max(60, (endX - startX) * 0.6);
              this.ctx.lineTo(midX, startY);
              this.ctx.lineTo(midX, endY);
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
  }

  cleanup() {}
}
