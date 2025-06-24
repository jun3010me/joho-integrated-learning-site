export class ImageDigitization {
  render(container) {
    container.innerHTML = `
      <div class="simulator-container">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">🖼️ 画像デジタル化学習ツール</h1>
          <p class="text-gray-600">解像度・色深度・ファイルサイズの関係を視覚的に学習</p>
        </div>

        <div class="card">
          <div class="text-center py-16">
            <div class="text-6xl mb-4">🚧</div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">開発中</h3>
            <p class="text-gray-500">画像デジタル化ツールは現在開発中です。</p>
          </div>
        </div>
      </div>
    `
  }

  cleanup() {}
}