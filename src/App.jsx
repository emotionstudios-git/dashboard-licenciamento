import { Dashboard } from './components/Dashboard'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Licenciamento</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão de contratos, royalties e performance de licenciados — Oinc Filmes</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-8 py-8">
        <Dashboard />
      </main>
      
      <footer className="bg-gray-100 border-t mt-16">
        <div className="max-w-7xl mx-auto px-8 py-6 text-center text-sm text-gray-500">
          <p>v0.1.0 — Fred + Monique em desenvolvimento. <a href="https://github.com/emotionstudios-git/dashboard-licenciamento" className="text-blue-600 hover:underline">GitHub</a></p>
        </div>
      </footer>
    </div>
  )
}
