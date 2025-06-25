export class LogicLearning {
  constructor() {
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

        <div class="card mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">論理式入力・真理値表・回路図</h2>
            
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
                    <div id="logic-expressions-container" class="space-y-2">
                        <div id="logic-expression-display" class="w-full p-3 min-h-12 border border-gray-300 rounded-md bg-gray-50 font-mono text-lg">
                          <!-- 論理式がここに表示される -->
                        </div>
                    </div>
                  </div>
                  
                  <div class="flex gap-2">
                    <button id="clear-expression" class="btn-secondary text-sm">クリア</button>
                    <button id="generate-table" class="btn-primary flex-1">真理値表・回路図を生成</button>
                  </div>
                  <div class="flex gap-2 mt-2">
                    <button id="load-half-adder" class="btn-secondary flex-1 text-sm">半加算器をロード</button>
                    <button id="load-full-adder" class="btn-secondary flex-1 text-sm">全加算器をロード</button>
                  </div>
                </div>

                <!-- 右側：ボタン入力パネル -->
                <div id="logic-buttons-panel" class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-800">論理式ボタン入力</h3>
                  
                  <div class="space-y-2">
                    <div class="text-sm font-medium text-gray-700">変数:</div>
                    <div id="variable-buttons" class="flex flex-wrap gap-2">
                      <button class="logic-btn variable-btn" data-value="A">A</button>
                      <button class="logic-btn variable-btn" data-value="B">B</button>
                    </div>
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
            
            <!-- 結果表示エリア -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">真理値表</h3>
                <div id="truth-table-display" class="bg-gray-50 p-4 rounded-lg min-h-48">
                  <div class="text-center text-gray-500">論理式を入力・選択して「生成」をクリックしてください</div>
                </div>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">論理回路図</h3>
                <div id="circuit-display" class="bg-gray-50 p-4 rounded-lg min-h-48">
                  <div class="text-center text-gray-500">論理式を入力・選択すると回路図が表示されます</div>
                </div>
              </div>
            </div>
          </div>
      </div>
    `

    this.setupEventListeners()
  }

  setupEventListeners() {
    const variableCount = document.getElementById('variable-count')
    if (variableCount) {
      variableCount.addEventListener('change', () => {
        this.updateVariableButtons()
      })
    }

    this.setupLogicButtons()

    const generateBtn = document.getElementById('generate-table')
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        this.generateTruthTableAndCircuit()
      })
    }

    const clearBtn = document.getElementById('clear-expression')
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearExpression()
      })
    }

    document.getElementById('load-half-adder').addEventListener('click', () => this.loadHalfAdder());
    document.getElementById('load-full-adder').addEventListener('click', () => this.loadFullAdder());

    this.updateVariableButtons()
    this.updateExpressionDisplay()
  }

  setupLogicButtons() {
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
      
      variableButtonsContainer.querySelectorAll('.logic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const value = btn.dataset.value
          this.addToExpression(value)
        })
      })
    }
  }

  addToExpression(value) {
    this.expressions = [] // Clear any presets
    this.currentExpression += value
    this.updateExpressionDisplay()
  }

  clearExpression() {
    this.currentExpression = ''
    this.expressions = []
    this.updateExpressionDisplay()
  }

  updateExpressionDisplay() {
    const container = document.getElementById('logic-expressions-container');
    const manualDisplay = document.getElementById('logic-expression-display');
    const buttonsPanel = document.getElementById('logic-buttons-panel');
    if (!container || !manualDisplay || !buttonsPanel) return;

    // Clear previous dynamic content
    container.querySelectorAll('.preset-expression').forEach(el => el.remove());

    if (this.expressions.length > 0) {
        // Display loaded expressions (e.g., for adders)
        this.expressions.forEach(expr => {
            const exprEl = document.createElement('div');
            exprEl.className = 'preset-expression w-full p-3 border border-gray-300 rounded-md bg-gray-100 font-mono text-lg flex items-center';
            exprEl.innerHTML = `<span class="font-bold text-blue-600 mr-4">${expr.name} =</span> <span>${expr.formula}</span>`;
            container.appendChild(exprEl);
        });
        manualDisplay.style.display = 'none';
        buttonsPanel.style.display = 'none';
    } else {
        // Display manual input
        manualDisplay.style.display = 'block';
        manualDisplay.textContent = this.currentExpression || '（論理式をボタンで入力してください）';
        buttonsPanel.style.display = 'block';
    }
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

    if (expressionsToProcess.some(e => !e.formula)) {
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
      console.error('❌ Error in generateTruthTableAndCircuit:', error);
      document.getElementById('truth-table-display').innerHTML = `<div class="text-red-600 text-center">⚠️ ${error.message}</div>`;
      document.getElementById('circuit-display').innerHTML = `<div class="text-red-600 text-center">⚠️ ${error.message}</div>`;
    }
  }

  createTruthTable(expressions, variables) {
    const rows = Math.pow(2, variables.length);
    const table = [];

    for (let i = 0; i < rows; i++) {
      const row = { inputs: {}, results: {} };
      
      for (let j = 0; j < variables.length; j++) {
        const variable = variables[j];
        row.inputs[variable] = (i >> (variables.length - 1 - j)) & 1;
      }
      
      expressions.forEach(expr => {
        try {
          row.results[expr.name] = this.evaluateExpression(expr.formula, row.inputs);
        } catch (e) {
            throw new Error(`式「${expr.name}」の評価エラー: ${e.message}`);
        }
      });
      
      table.push(row);
    }

    return { expressions, variables, table };
  }

  evaluateExpression(expression, values) {
    let expr = expression.toUpperCase();
    Object.entries(values).forEach(([variable, value]) => {
      const regex = new RegExp(`\b${variable}\b`, 'g');
      expr = expr.replace(regex, value.toString());
    });
    
    expr = expr.replace(/\bAND\b/g, '&&').replace(/\bOR\b/g, '||').replace(/\bNOT\b/g, '!').replace(/\bXOR\b/g, '^');
    
    if (!/^[0-1\s&|!^()]+$/.test(expr)) {
      throw new Error('無効な文字が含まれています');
    }
    
    try {
      expr = expr.replace(/(\d+)\s*\^\s*(\d+)/g, '(($1) !== ($2) ? 1 : 0)');
      return eval(expr) ? 1 : 0;
    } catch (error) {
      throw new Error('論理式の構文が正しくありません');
    }
  }

  displayTruthTable(data) {
    const { expressions, variables, table } = data;
    let html = `
      <div class="overflow-x-auto">
        <table class="w-full bg-white border border-gray-300 rounded">
          <thead class="bg-gray-100">
            <tr>`;
    
    variables.forEach(variable => {
      html += `<th class="px-3 py-2 border-b font-semibold text-center">${variable}</th>`;
    });
    expressions.forEach(expr => {
        html += `<th class="px-3 py-2 border-b font-semibold text-center bg-blue-100">${expr.name}</th>`;
    });
    html += `</tr></thead><tbody>`;
    
    table.forEach((row, index) => {
      html += `<tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">`;
      variables.forEach(variable => {
        html += `<td class="px-3 py-2 border-b text-center font-mono">${row.inputs[variable]}</td>`;
      });
      expressions.forEach(expr => {
        const result = row.results[expr.name];
        html += `<td class="px-3 py-2 border-b text-center font-mono font-bold ${result ? 'text-green-600' : 'text-red-600'}">${result}</td>`;
      });
      html += `</tr>`;
    });
    
    html += `</tbody></table></div>`;
    document.getElementById('truth-table-display').innerHTML = html;
  }

  displayCircuitDiagram(circuit) {
    const circuitDisplay = document.getElementById('circuit-display');
    let circuitHtml = `
        <div class="text-center">
          <canvas id="circuit-canvas" width="600" height="400" class="border border-gray-300 rounded bg-white max-w-full"></canvas>
        </div>
    `;
    circuitDisplay.innerHTML = circuitHtml;
    this.drawLogicCircuit(circuit);
  }

  createMergedCircuit(expressions, variables) {
    let mergedGates = [];
    const gateHashes = new Map();
    const finalOutputNames = {};

    expressions.forEach(expr => {
        const circuit = this.parseLogicExpression(expr.formula);
        const outputMap = {};

        circuit.gates.forEach(gate => {
            gate.inputs = gate.inputs.map(input => outputMap[input] || input);

            const gateHash = `${gate.type}:${gate.inputs.slice().sort().join(',')}`;

            if (gateHashes.has(gateHash)) {
                const existingGateId = gateHashes.get(gateHash);
                const existingGate = mergedGates.find(g => g.id === existingGateId);
                outputMap[gate.output] = existingGate.output;
            } else {
                const newGateId = `m_gate_${mergedGates.length}`;
                const newGateOutput = `${newGateId}_out`;
                outputMap[gate.output] = newGateOutput;
                
                gate.id = newGateId;
                gate.output = newGateOutput;
                
                mergedGates.push(gate);
                gateHashes.set(gateHash, gate.id);
            }
        });

        const finalOutputInternalName = outputMap[circuit.gates[circuit.gates.length - 1]?.output];
        if (finalOutputInternalName) {
            finalOutputNames[finalOutputInternalName] = expr.name;
        }
    });

    mergedGates.forEach(gate => {
        if (finalOutputNames[gate.output]) {
            gate.output = finalOutputNames[gate.output];
        }
    });

    const mergedConnections = [];
    mergedGates.forEach(gate => {
        gate.inputs.forEach((input, index) => {
            const sourceGate = mergedGates.find(g => g.output === input);
            if (sourceGate) {
                mergedConnections.push({
                    from: sourceGate.id,
                    to: gate.id,
                    fromOutput: sourceGate.output,
                    toInput: index
                });
            }
        });
    });

    const layout = this.calculateLayout(mergedGates, variables);
    mergedGates.forEach(gate => {
        gate.x = layout[gate.id]?.x || 250;
        gate.y = layout[gate.id]?.y || 150;
    });

    return {
        variables,
        gates: mergedGates,
        connections: mergedConnections,
        expression: expressions.map(e => `${e.name}=${e.formula}`).join('; ')
    };
  }

  tokenize(expression) {
    const spacedExpression = expression.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ');
    return spacedExpression.split(/\s+/).filter(token => token.length > 0);
  }

  calculateLayout(gates, variables) {
    const layout = {};
    const levels = {};
    const gateDeps = {};
    gates.forEach(g => { gateDeps[g.id] = new Set() });

    gates.forEach(gate => {
        gate.inputs.forEach(input => {
            const sourceGate = gates.find(g => g.output === input);
            if (sourceGate) gateDeps[gate.id].add(sourceGate.id);
        });
    });

    const calculateLevel = (gateId) => {
        if (levels[gateId] !== undefined) return levels[gateId];
        const deps = gateDeps[gateId];
        if (deps.size === 0) return levels[gateId] = 0;
        
        const maxDepLevel = Math.max(...Array.from(deps).map(calculateLevel));
        return levels[gateId] = maxDepLevel + 1;
    };

    gates.forEach(gate => calculateLevel(gate.id));

    const gatesByLevel = {};
    gates.forEach(gate => {
        const level = levels[gate.id];
        if (!gatesByLevel[level]) gatesByLevel[level] = [];
        gatesByLevel[level].push(gate);
    });

    const xSpacing = 180, ySpacing = 100, startX = 200;
    Object.keys(gatesByLevel).forEach(level => {
        const levelGates = gatesByLevel[level];
        const canvasHeight = 400;
        const levelYStart = (canvasHeight - (levelGates.length - 1) * ySpacing) / 2;
        levelGates.forEach((gate, index) => {
            layout[gate.id] = { x: startX + level * xSpacing, y: levelYStart + index * ySpacing };
        });
    });

    return layout;
  }

  parseLogicExpression(expression) {
    const precedence = { 'NOT': 4, 'XOR': 3, 'AND': 2, 'OR': 1 };
    const operators = new Set(['AND', 'OR', 'XOR', 'NOT']);
    const tokens = this.tokenize(expression.toUpperCase());
    const outputQueue = [], operatorStack = [];

    tokens.forEach(token => {
        if (/[A-D]/.test(token) && token.length === 1) {
            outputQueue.push(token);
        } else if (operators.has(token)) {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(' && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            if (operatorStack.pop() !== '(') throw new Error('Mismatched parentheses');
        }
    });

    while (operatorStack.length > 0) {
        const op = operatorStack.pop();
        if (op === '(') throw new Error('Mismatched parentheses');
        outputQueue.push(op);
    }

    const gates = [], operandStack = [];
    let gateId = 0;

    if (outputQueue.length === 0 && expression.trim() !== '') throw new Error('Invalid expression');

    outputQueue.forEach(token => {
        if (operators.has(token)) {
            const gate = { id: `p_gate_${gateId++}`, type: token, inputs: [], output: `p_g${gateId-1}_out` };
            const opCount = (token === 'NOT') ? 1 : 2;
            if (operandStack.length < opCount) throw new Error(`Invalid syntax for ${token}`);
            for(let i=0; i<opCount; i++) gate.inputs.unshift(operandStack.pop());
            gates.push(gate);
            operandStack.push(gate.output);
        } else {
            operandStack.push(token);
        }
    });
    
    if (operandStack.length > 1) throw new Error('Invalid expression: too many operands');

    if (gates.length > 0) {
        gates[gates.length - 1].output = 'Y';
    } else if (operandStack.length === 1) {
        gates.push({ id: `p_gate_${gateId++}`, type: 'BUFFER', inputs: [operandStack[0]], output: 'Y' });
    }

    return { gates };
  }

  drawLogicCircuit(circuit) {
    const canvas = document.getElementById('circuit-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const numVariables = circuit.variables.length;
    const canvasHeight = canvas.height;
    const availableHeight = canvasHeight - 40;
    const inputSpacing = Math.min(60, availableHeight / Math.max(1, numVariables));
    const startY = (canvasHeight - (numVariables - 1) * inputSpacing) / 2;
    const inputX = 60;
    const variablePositions = {};

    circuit.variables.forEach((variable, index) => {
      const y = startY + index * inputSpacing;
      variablePositions[variable] = { x: inputX, y: y };
      this.drawVariable(ctx, variable, inputX, y);
    });
    
    circuit.gates.forEach(gate => {
      this.drawGate(ctx, gate, circuit, variablePositions);
    });
  }

  drawVariable(ctx, text, x, y) {
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#dbeafe'; ctx.fill();
      ctx.strokeStyle = '#1e40af'; ctx.stroke();
      ctx.fillStyle = '#1e40af'; ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x - 30, y);
      ctx.strokeStyle = '#374151'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x + 8, y); ctx.lineTo(x + 50, y); ctx.stroke();
  }

  drawGate(ctx, gate, circuit, varPos) {
      const gateX = gate.x, gateY = gate.y;
      const finalOutputs = ['S', 'C', 'Y'];

      gate.inputs.forEach((input, index) => {
          let inputY = (gate.inputs.length === 1) ? gateY : gateY - 15 + (index * 30);
          let sourcePos = {x: 0, y: 0};
          let isIntermediate = false;

          if (varPos[input]) {
              sourcePos = {x: varPos[input].x + 50, y: varPos[input].y};
          } else {
              const sourceGate = circuit.gates.find(g => g.output === input);
              if (sourceGate) {
                  sourcePos = {x: sourceGate.x + 30, y: sourceGate.y};
                  isIntermediate = true;
              }
          }
          this.drawWire(ctx, sourcePos, {x: gateX - 30, y: inputY}, isIntermediate);
      });
      
      this.drawGateSymbol(ctx, gate.type, gateX, gateY);
      
      if (finalOutputs.includes(gate.output)) {
          this.drawOutput(ctx, gate.output, gateX, gateY, canvas.width);
      }
  }

  drawWire(ctx, from, to, isIntermediate) {
      ctx.strokeStyle = isIntermediate ? '#dc2626' : '#374151';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      const midX = from.x + (to.x - from.x) / (isIntermediate ? 1.5 : 2);
      ctx.lineTo(midX, from.y);
      ctx.lineTo(midX, to.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      if (!isIntermediate) {
          ctx.beginPath(); ctx.arc(midX, from.y, 3, 0, 2 * Math.PI);
          ctx.fillStyle = '#374151'; ctx.fill();
      }
  }

  drawOutput(ctx, text, x, y, canvasWidth) {
      ctx.strokeStyle = '#374151'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x + 30, y); ctx.lineTo(canvasWidth - 100, y); ctx.stroke();
      ctx.beginPath(); ctx.arc(canvasWidth - 100, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#fbbf24'; ctx.fill();
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#d97706'; ctx.font = 'bold 18px Arial';
      ctx.fillText(text, canvasWidth - 60, y);
  }

  drawGateSymbol(ctx, gateType, x, y) {
    const styles = {
      AND: { fill: '#dbeafe', stroke: '#1e40af', symbol: '&' },
      OR: { fill: '#dcfce7', stroke: '#166534', symbol: '≥1' },
      NOT: { fill: '#fef2f2', stroke: '#dc2626' },
      XOR: { fill: '#f3e8ff', stroke: '#7c3aed', symbol: '⊕' },
      BUFFER: { fill: '#f9fafb', stroke: '#6b7280', symbol: '1' }
    };
    const style = styles[gateType] || styles['AND'];
    ctx.fillStyle = style.fill; ctx.strokeStyle = style.stroke; ctx.lineWidth = 3;

    ctx.beginPath();
    if (gateType === 'AND') {
        ctx.moveTo(x - 30, y - 20); ctx.lineTo(x, y - 20);
        ctx.arc(x, y, 20, -Math.PI/2, Math.PI/2); ctx.lineTo(x - 30, y + 20);
    } else if (gateType === 'OR' || gateType === 'XOR') {
        const orX = (gateType === 'XOR') ? -25 : -30;
        ctx.moveTo(orX, y - 20); ctx.quadraticCurveTo(x - 10, y - 20, x + 20, y);
        ctx.quadraticCurveTo(x - 10, y + 20, orX, y + 20);
        ctx.quadraticCurveTo(x - 20, y, orX, y - 20);
    } else { // NOT, BUFFER
        ctx.moveTo(x - 30, y - 15); ctx.lineTo(x - 30, y + 15); ctx.lineTo(x + 10, y);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();

    if (style.symbol) {
        ctx.fillStyle = style.stroke; ctx.font = `bold ${gateType === 'OR' ? 12 : 16}px Arial`;
        ctx.fillText(style.symbol, x - (gateType === 'OR' || gateType === 'XOR' ? 10 : 15), y);
    }
    if (gateType === 'NOT') {
        ctx.beginPath(); ctx.arc(x + 15, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.stroke();
    }
    if (gateType === 'XOR') {
        ctx.beginPath(); ctx.moveTo(x - 35, y - 15);
        ctx.quadraticCurveTo(x - 25, y, x - 35, y + 15); ctx.stroke();
    }
  }

  cleanup() {}
}
