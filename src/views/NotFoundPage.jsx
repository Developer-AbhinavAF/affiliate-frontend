import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
      <div className="text-2xl font-semibold text-white">Page not found</div>
      <div className="mt-2 text-sm text-white/70">The page you’re looking for doesn’t exist.</div>
      <div className="mt-6">
        <Link
          to="/"
          className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-95"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
