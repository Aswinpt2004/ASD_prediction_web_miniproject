"use client"

export default function ChildViewLoading() {
  return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Loading child information...</p>
      </div>
    </div>
  )
}
