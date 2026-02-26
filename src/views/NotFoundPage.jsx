import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/60 p-8 text-center backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Page not found</div>
      <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">The page you’re looking for doesn’t exist.</div>
      <div className="mt-6">
        <Link
          to="/"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
