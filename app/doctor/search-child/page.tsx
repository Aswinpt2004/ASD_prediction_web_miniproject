"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, AlertCircle, Loader2 } from "lucide-react"

export default function SearchChildPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearched(true)
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search/children?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data = await response.json()
      setSearchResults(data || [])
    } catch (err) {
      console.error("Search error:", err)
      setError("Failed to search. Please try again.")
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Search Child</h1>
        <p className="text-slate-600">Find a child's assessment by ID, name, or caretaker information</p>
      </div>

      {/* Search Form */}
      <Card className="p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            type="text"
            placeholder="Enter child ID, name, or caretaker name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </form>
      </Card>

      {/* Search Results */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <Card className="p-6 bg-red-50 border-red-200 mb-4">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {searched && !loading && (
        <>
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result) => (
                <Card key={result.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{result.name}</h3>
                      <p className="text-sm text-slate-600">
                        {result.gender} • Caretaker: {result.caretaker || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link href={`/doctor/view-child/${result.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No results found for "{searchQuery}"</p>
              <p className="text-sm text-slate-500 mt-2">Try searching with a different query</p>
            </Card>
          )}
        </>
      )}

      {/* Info Box */}
      {!searched && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-slate-900 mb-2">Search Tips</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Search by child ID (e.g., C001)</li>
            <li>• Search by child name (e.g., Arjun)</li>
            <li>• Search by caretaker name (e.g., Rajesh Kumar)</li>
            <li>• Only children assigned to you will appear in results</li>
          </ul>
        </Card>
      )}
    </div>
  )
}
