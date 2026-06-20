import { SignIn } from '@clerk/react'
import { Link } from 'react-router-dom'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Link
        to="/"
        className="flex items-center gap-2 mb-8 text-gray-900"
      >
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xl font-bold">ScanPick</span>
      </Link>

      <div className="w-full max-w-sm">
        <SignIn routing="hash" />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Don't have an account?{' '}
        <Link to="/sign-up" className="text-blue-600 hover:text-blue-700 underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
