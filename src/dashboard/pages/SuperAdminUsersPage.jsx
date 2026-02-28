import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { useToast } from '../../components/Toaster/Toaster'

const roles = ['', 'CUSTOMER', 'ADMIN', 'SUPER_ADMIN']
const settableRoles = ['CUSTOMER', 'ADMIN']

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

  if (isLoading) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</div>
  if (isError) return <div className="text-sm text-zinc-600 dark:text-zinc-400">Failed to load users</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name / username / email"
          className="w-72 rounded-sm border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-sm border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:focus:border-zinc-700"
        >
          {roles.map((r) => (
            <option key={r || 'ALL'} value={r}>
              {r || 'ALL ROLES'}
            </option>
          ))}
        </select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="rounded-sm border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">All Users</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Username</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Disabled</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u._id} className="border-t border-zinc-200/70 dark:border-zinc-800">
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{u.name}</td>
                  <td className="py-2 text-zinc-600 dark:text-zinc-400">{u.username || ''}</td>
                  <td className="py-2 text-zinc-600 dark:text-zinc-400">{u.email}</td>
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{u.role}</td>
                  <td className="py-2 text-zinc-900 dark:text-zinc-100">{u.disabled ? 'Yes' : 'No'}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={toggleUser.isPending || u.role === 'SUPER_ADMIN'}
                        onClick={() => toggleUser.mutate(u._id)}
                        className="rounded-sm border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
                      >
                        {u.disabled ? 'Enable' : 'Disable'}
                      </button>

                      {settableRoles.map((r) => (
                        <button
                          key={r}
                          disabled={changeRole.isPending || u.role === 'SUPER_ADMIN' || u.role === r}
                          onClick={() => changeRole.mutate({ id: u._id, nextRole: r })}
                          className="rounded-sm border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
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
                  <td colSpan={7} className="py-6 text-center text-zinc-600 dark:text-zinc-400">
                    No users
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
