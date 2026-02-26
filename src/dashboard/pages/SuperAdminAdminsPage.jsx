import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

export function SuperAdminAdminsPage() {
  const qc = useQueryClient()
  const { push } = useToast()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['superadmin', 'admins'],
    queryFn: async () => {
      const res = await api.get('/api/superadmin/admins')
      return res.data.items || []
    },
  })

  const createAdmin = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/superadmin/admins', { name, username, email, password })
      return res.data
    },
    onSuccess: async () => {
      push('Admin created')
      setName('')
      setUsername('')
      setEmail('')
      setPassword('')
      await qc.invalidateQueries({ queryKey: ['superadmin', 'admins'] })
    },
    onError: () => push('Failed to create admin'),
  })

  const toggleAdmin = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/api/superadmin/admins/${id}/toggle`)
      return res.data
    },
    onSuccess: async () => {
      push('Updated')
      await qc.invalidateQueries({ queryKey: ['superadmin', 'admins'] })
    },
    onError: () => push('Failed to update'),
  })

  const rows = useMemo(() => data || [], [data])

  if (isLoading) return <div className="text-sm text-white/70">Loading…</div>
  if (isError) return <div className="text-sm text-white/70">Failed to load admins</div>

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="text-sm font-medium text-white">Create Admin</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/40" />
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/40" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/40" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/40" />
        </div>
        <button
          disabled={createAdmin.isPending}
          onClick={() => createAdmin.mutate()}
          className="mt-4 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {createAdmin.isPending ? 'Creating…' : 'Create'}
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="text-sm font-medium text-white">Admins</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Username</th>
                <th className="py-2">Email</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a._id || a.id} className="border-t border-white/10">
                  <td className="py-2 text-white/80">{a.name}</td>
                  <td className="py-2 text-white/80">{a.username || ''}</td>
                  <td className="py-2 text-white/80">{a.email}</td>
                  <td className="py-2 text-white/80">{a.disabled ? 'Disabled' : 'Active'}</td>
                  <td className="py-2">
                    <button
                      disabled={toggleAdmin.isPending}
                      onClick={() => toggleAdmin.mutate(a._id || a.id)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10 disabled:opacity-60"
                    >
                      {a.disabled ? 'Enable' : 'Disable'}
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-white/60">
                    No admins
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
