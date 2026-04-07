import { useEffect, useState } from 'react'
import { formatDate } from '../../../utils/formatDate'
import { fetchApartments } from '../services/apartmentService'
import type { Apartment } from '../types'

const ApartmentsPage = () => {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadApartments = async () => {
      try {
        const data = await fetchApartments()
        if (mounted) {
          setApartments(data)
        }
      } catch (err) {
        console.error(err)
        if (mounted) {
          setError('Unable to load apartments')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadApartments()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Properties</p>
        <h1 className="text-3xl font-semibold text-slate-900">Apartments</h1>
        <p className="text-sm text-slate-500">
          All apartment records stored in Supabase (most recent first).
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                    Loading apartments…
                  </td>
                </tr>
              ) : apartments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                    No apartments found
                  </td>
                </tr>
              ) : (
                apartments.map((apartment) => (
                  <tr key={apartment.id}>
                    <td className="px-4 py-4 font-semibold text-slate-900">{apartment.name}</td>
                    <td className="px-4 py-4 text-slate-600">
                      {apartment.location ?? 'Unspecified'}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {formatDate(apartment.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ApartmentsPage
