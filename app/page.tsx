export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            🖥️ PC Builder
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 text-slate-300 hover:text-white transition">
              About
            </button>
            <button className="px-4 py-2 text-slate-300 hover:text-white transition">
              Guides
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Build Your{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Dream PC
                </span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Create the perfect computer configuration tailored to your needs. From gaming rigs to workstations, we&apos;ll help you pick the best components.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold transition transform hover:scale-105">
                  Start Building
                </button>
                <button className="px-8 py-3 border-2 border-slate-400 hover:border-white text-white rounded-lg font-semibold transition hover:bg-slate-800">
                  View Presets
                </button>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative h-80 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-3xl"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-8xl">⚙️</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-blue-400 transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">Smart Selection</h3>
              <p className="text-slate-300">
                Get component recommendations based on your budget and use case.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-400 transition">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold mb-2">Compatibility Check</h3>
              <p className="text-slate-300">
                Ensure all your selected parts work together perfectly.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-blue-400 transition">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-semibold mb-2">Price Tracking</h3>
              <p className="text-slate-300">
                Monitor prices and find the best deals on each component.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/50 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
            <p className="text-slate-300 mb-6 text-lg">
              Join thousands of PC enthusiasts creating their perfect setups.
            </p>
            <button className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold text-lg transition transform hover:scale-105">
              Launch Builder
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400">
          <p>&copy; 2026 PC Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
