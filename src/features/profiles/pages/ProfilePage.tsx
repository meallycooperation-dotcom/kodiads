import { useEffect, useState } from 'react'
import { formatDate } from '../../../utils/formatDate'
import { fetchProfiles } from '../services/profileService'
import type { Profile } from '../types'

const ProfilePage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadProfiles = async () => {
      try {
        const data = await fetchProfiles()
        if (mounted) {
          setProfiles(data)
        }
      } catch (err) {
        console.error(err)
        if (mounted) {
          setError('Unable to load profiles')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProfiles()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Profiles</p>
        <h1 className="text-3xl font-semibold text-slate-900">Team</h1>
        <p className="text-sm text-slate-500">
          Admin profiles .
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
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Loading profiles…
                  </td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No profiles found
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {profile.full_name ?? 'Unknown'}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{profile.email ?? '—'}</td>
                    <td className="px-4 py-4 text-slate-600">
                      {profile.phone_number ?? '—'}
                    </td>
                    <td className="px-4 py-4 text-xs uppercase tracking-[0.3em] text-slate-500">
                      {profile.role}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {formatDate(profile.created_at)}
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

export default ProfilePage
