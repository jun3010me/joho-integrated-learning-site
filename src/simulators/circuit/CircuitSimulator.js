export class CircuitSimulator {
  render(container) {
    container.innerHTML = `
      <div class="simulator-container">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">🔧 回路シミュレータ</h1>
          <p class="text-gray-600">ドラッグ&ドロップで自由に論理回路を設計・テスト</p>
        </div>

        <div class="card">
          <div class="text-center py-16">
            <div class="text-6xl mb-4">🚧</div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">開発中</h3>
            <p class="text-gray-500">回路シミュレータは現在開発中です。</p>
            <div class="mt-8">
              <p class="text-gray-600">SimcirJSベースの本格的な回路設計ツールを統合予定</p>
            </div>
          </div>
        </div>
      </div>
    `
  }

  cleanup() {}
}