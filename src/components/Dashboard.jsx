import { useState, useEffect } from 'react'

export function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/contracts/summary')
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8 text-center">Carregando...</div>
  if (error) return <div className="p-8 text-red-600">Erro: {error}</div>
  if (!data) return null

  return (
    <div className="space-y-8">
      {/* Resumo de status */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestão de Contratos</h2>
        <div className="grid grid-cols-4 gap-4">
          {data.summary?.map(s => (
            <div key={s.mg_status} className="bg-white p-4 rounded-lg border shadow">
              <div className="text-sm font-medium text-gray-500">{s.mg_status}</div>
              <div className="text-3xl font-bold text-gray-900">{s.count}</div>
              <div className="text-xs text-gray-400 mt-1">
                Produto: {s.produto_count} | Conteúdo: {s.conteudo_count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Receita por tipo de licenciado */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Receita de Royalties 2026</h2>
        <div className="bg-white rounded-lg border shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Tipo de Licenciado</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-900">Royalties Bruto</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-900">Royalties Líquido</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-900">Qtd Licenciados</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.royalties?.map(r => (
                <tr key={r.type} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{r.type}</td>
                  <td className="px-6 py-3 text-right text-gray-600">
                    R$ {(r.royalties_gross || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-600">
                    R$ {(r.royalties_net || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-600">{r.licensee_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vencimentos próximos 90 dias */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vencimentos Próximos (90 dias)</h2>
        <div className="bg-white rounded-lg border shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Contrato</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Licenciado</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Marca</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Data de Vencimento</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-900">Dias até Vencimento</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.upcoming?.slice(0, 10).map(u => (
                <tr key={u.id} className={u.dias_até_vencimento < 30 ? 'bg-red-50' : ''}>
                  <td className="px-6 py-3 font-mono text-gray-900">{u.contract_number}</td>
                  <td className="px-6 py-3 text-gray-900">{u.licensee_name}</td>
                  <td className="px-6 py-3 text-gray-600">{u.brand}</td>
                  <td className="px-6 py-3 text-gray-600">{new Date(u.end_date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900">{u.dias_até_vencimento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shortfall */}
      {data.shortfall?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Shortfall (MG não superado)</h2>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-yellow-100 border-b border-yellow-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Contrato</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Licenciado</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-900">MG Pago</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-900">Royalties Acumulados</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-900">Shortfall</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.shortfall?.map(s => (
                  <tr key={s.contract_number} className="hover:bg-yellow-100">
                    <td className="px-6 py-3 font-mono">{s.contract_number}</td>
                    <td className="px-6 py-3">{s.licensee_name}</td>
                    <td className="px-6 py-3 text-right">R$ {(s.mg_paid_total || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-3 text-right">R$ {(s.royalties_accumulated || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-3 text-right font-bold text-red-600">R$ {(s.shortfall || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
