"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, AlertCircle } from "lucide-react"

export default function SearchChildPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearched(true)

    // TODO: Integrate with backend API
    if (searchQuery.trim()) {
      // Simulate search results
      setSearchResults([
        {
          id: "C001",
          name: "Arjun",
          age: 3,
          caretaker: "Rajesh Kumar",
          riskLevel: "High",
          lastAssessment: "2025-10-15",
        },
        {
          id: "C002",
          name: "Arjun Kumar",
          age: 5,
          caretaker: "Priya Singh",
          riskLevel: "Medium",
          lastAssessment: "2025-10-10",
        },
      ])
    } else {
      setSearchResults([])
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
      {searched && (
        <>
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result) => (
                <Card key={result.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{result.name}</h3>
                      <p className="text-sm text-slate-600">
                        Age {result.age} • Caretaker: {result.caretaker}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel} Risk
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">Last Assessment: {result.lastAssessment}</p>
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
