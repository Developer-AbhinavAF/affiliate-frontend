import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

const roles = ['', 'CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN']
const settableRoles = ['CUSTOMER', 'SELLER', 'ADMIN']

export function SuperAdminUsersPage() {
  const qc = useQueryClient()
  const { push } = useToast()

  const [role, setRole] = useState('')
  const [q, setQ] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['superadmin', 'users', role, q],
    queryFn: async () => {
      const res = await api.get('/api/superadmin/users', { params: { role: role || undefined, q: q || undefined, limit: 100 } })
      return res.data.items || []
    },
  })

  const toggleUser = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/api/superadmin/users/${id}/toggle`)
      return res.data
    },
    onSuccess: async () => {
      push('Updated')
      await qc.invalidateQueries({ queryKey: ['superadmin', 'users'] })
    },
    onError: () => push('Failed to update user'),
  })

  const changeRole = useMutation({
    mutationFn: async ({ id, nextRole }) => {
      const res = await api.patch(`/api/superadmin/users/${id}/role`, { role: nextRole })
      return res.data
    },
    onSuccess: async () => {
      push('Role updated')
      await qc.invalidateQueries({ queryKey: ['superadmin', 'users'] })
    },
    onError: () => push('Failed to change role'),
  })

  const rows = useMemo(() => data || [], [data])

  if (isLoading) return <div className="text-sm text-white/70">Loading…</div>
  if (isError) return <div className="text-sm text-white/70">Failed to load users</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name / username / email"
          className="w-72 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/90 outline-none placeholder:text-white/40"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 outline-none"
        >
          {roles.map((r) => (
            <option key={r || 'ALL'} value={r}>
              {r || 'ALL ROLES'}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="text-sm font-medium text-white">All Users</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Username</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Seller Status</th>
                <th className="py-2">Disabled</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u._id} className="border-t border-white/10">
                  <td className="py-2 text-white/80">{u.name}</td>
                  <td className="py-2 text-white/70">{u.username || ''}</td>
                  <td className="py-2 text-white/70">{u.email}</td>
                  <td className="py-2 text-white/80">{u.role}</td>
                  <td className="py-2 text-white/70">{u.sellerStatus || ''}</td>
                  <td className="py-2 text-white/80">{u.disabled ? 'Yes' : 'No'}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={toggleUser.isPending || u.role === 'SUPER_ADMIN'}
                        onClick={() => toggleUser.mutate(u._id)}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10 disabled:opacity-60"
                      >
                        {u.disabled ? 'Enable' : 'Disable'}
                      </button>

                      {settableRoles.map((r) => (
                        <button
                          key={r}
                          disabled={changeRole.isPending || u.role === 'SUPER_ADMIN' || u.role === r}
                          onClick={() => changeRole.mutate({ id: u._id, nextRole: r })}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10 disabled:opacity-60"
                        >
                          Set {r}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-white/60">
                    No users
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
