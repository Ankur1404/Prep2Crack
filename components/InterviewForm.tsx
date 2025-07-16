"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const LEVELS = ["Junior", "Mid", "Senior"]
const TYPES = ["Technical", "HR", "Managerial"]
const DEFAULT_AMOUNT = 5

interface FormData {
  role: string
  level: string
  techstack: string[]
  type: string
  amount: number
}

interface ValidationErrors {
  role?: string
  level?: string
  techstack?: string
  type?: string
  amount?: string
}

const InterviewForm = ({ userId }: { userId: string }) => {
  const router = useRouter()
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<FormData>({
    role: "",
    level: "",
    techstack: [],
    type: "",
    amount: DEFAULT_AMOUNT,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [techSuggestions, setTechSuggestions] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "error" | null>(null)

  // Auto-save functionality
  useEffect(() => {
    const saveFormData = () => {
      try {
        setAutoSaveStatus("saving")
        localStorage.setItem("interview-form-draft", JSON.stringify(form))
        setTimeout(() => {
          setAutoSaveStatus("saved")
          setTimeout(() => setAutoSaveStatus(null), 2000)
        }, 500)
      } catch (error) {
        setAutoSaveStatus("error")
        setTimeout(() => setAutoSaveStatus(null), 2000)
      }
    }

    const timeoutId = setTimeout(saveFormData, 1000)
    return () => clearTimeout(timeoutId)
  }, [form])

  // Load saved form data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("interview-form-draft")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setForm(parsedData)
      }
    } catch (error) {
      console.error("Error loading saved form data:", error)
    }
  }, [])

  // Form validation
  const validateForm = () => {
    const errors: ValidationErrors = {}

    if (!form.role.trim()) {
      errors.role = "Role is required"
    } else if (form.role.length < 2) {
      errors.role = "Role must be at least 2 characters"
    }

    if (!form.level) {
      errors.level = "Level is required"
    }

    if (form.techstack.length === 0) {
      errors.techstack = "At least one technology is required"
    }

    if (!form.type) {
      errors.type = "Interview type is required"
    }

    if (form.amount < 1 || form.amount > 20) {
      errors.amount = "Number of questions must be between 1 and 20"
    }

    setValidationErrors(errors)
    const isValid = Object.keys(errors).length === 0
    setIsFormValid(isValid)
    return isValid
  }

  // Calculate form progress
  useEffect(() => {
    const fields = [
      form.role.trim() !== "",
      form.level !== "",
      form.techstack.length > 0,
      form.type !== "",
      form.amount >= 1 && form.amount <= 20,
    ]
    const completedFields = fields.filter(Boolean).length
    setFormProgress((completedFields / fields.length) * 100)
  }, [form])

  // Validate form on changes
  useEffect(() => {
    validateForm()
  }, [form])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch tech stack suggestions
  const fetchTechSuggestions = async (role: string, level: string, search?: string) => {
    if (!role || !level) return

    setLoadingSuggestions(true)
    try {
      const params = new URLSearchParams({
        role,
        level,
        ...(search && { search }),
      })

      const response = await fetch(`/api/techstack/suggestions?${params}`)
      const data = await response.json()

      if (data.success) {
        setTechSuggestions(data.data)
      }
    } catch (error) {
      console.error("Error fetching tech suggestions:", error)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (form.role && form.level) {
        fetchTechSuggestions(form.role, form.level, searchTerm)
      }
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [form.role, form.level, searchTerm])

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, role: value }))

    if (form.techstack.length > 0) {
      setForm((prev) => ({ ...prev, techstack: [] }))
    }
  }

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, level: value }))

    if (form.techstack.length > 0) {
      setForm((prev) => ({ ...prev, techstack: [] }))
    }
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, type: value }))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setForm((prev) => ({ ...prev, amount: value }))
  }

  const addTechStack = (tech: string) => {
    if (!form.techstack.includes(tech)) {
      setForm((prev) => ({ ...prev, techstack: [...prev.techstack, tech] }))
    }
    setSearchTerm("")
    setShowSuggestions(false)
  }

  const removeTechStack = (tech: string) => {
    setForm((prev) => ({ ...prev, techstack: prev.techstack.filter((t) => t !== tech) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, techstack: form.techstack.join(","), userid: userId }),
      })
      const data = await res.json()

      if (!res.ok || !data.data || !data.data.role) {
        throw new Error(data.message || "Failed to create interview")
      }

      // Clear saved draft on successful submission
      localStorage.removeItem("interview-form-draft")
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Auto-save status */}
        <div className="mb-4 h-6 flex justify-center">
          {autoSaveStatus && (
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs transition-all duration-300 ${
                autoSaveStatus === "saved"
                  ? "bg-green-500/20 text-green-400"
                  : autoSaveStatus === "saving"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {autoSaveStatus === "saved" && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {autoSaveStatus === "saving" && (
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              )}
              {autoSaveStatus === "error" && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {autoSaveStatus === "saved" && "Draft saved"}
              {autoSaveStatus === "saving" && "Saving..."}
              {autoSaveStatus === "error" && "Save failed"}
            </div>
          )}
        </div>

        {/* Form Container */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 ease-out"
              style={{ width: `${formProgress}%` }}
            />
          </div>

          {/* Header */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2 animate-fade-in">
              Start a New Interview
            </h1>
            <p className="text-gray-400 text-sm">Configure your interview parameters</p>
            <div className="mt-3 text-xs text-gray-500">Progress: {Math.round(formProgress)}% complete</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6">
            {/* Role Field */}
            <div className="space-y-2 transform transition-all duration-300">
              <Label htmlFor="role" className="text-white font-medium text-sm flex items-center gap-2">
                Role
                {form.role && (
                  <svg
                    className="w-4 h-4 text-green-400 animate-scale-in"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </Label>
              <Input
                id="role"
                name="role"
                value={form.role}
                onChange={handleRoleChange}
                placeholder="e.g., Frontend Developer, Full Stack"
                required
                className={`bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-lg h-10 sm:h-12 transition-all duration-300 ${
                  validationErrors.role
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : form.role
                      ? "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      : "focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                }`}
              />
              {validationErrors.role && (
                <p className="text-red-400 text-xs animate-slide-down">{validationErrors.role}</p>
              )}
            </div>

            {/* Level Field */}
            <div className="space-y-2 transform transition-all duration-300">
              <Label htmlFor="level" className="text-white font-medium text-sm flex items-center gap-2">
                Level
                {form.level && (
                  <svg
                    className="w-4 h-4 text-green-400 animate-scale-in"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </Label>
              <div className="relative">
                <select
                  id="level"
                  name="level"
                  value={form.level}
                  onChange={handleLevelChange}
                  required
                  className={`w-full h-10 sm:h-12 bg-gray-800 border text-white rounded-lg px-4 appearance-none transition-all duration-300 cursor-pointer ${
                    validationErrors.level
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : form.level
                        ? "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        : "border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  }`}
                >
                  <option value="" className="bg-gray-800">
                    Select level
                  </option>
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl} className="bg-gray-800">
                      {lvl}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {validationErrors.level && (
                <p className="text-red-400 text-xs animate-slide-down">{validationErrors.level}</p>
              )}
            </div>

            {/* Tech Stack Field */}
            <div className="space-y-2 transform transition-all duration-300">
              <Label className="text-white font-medium text-sm flex items-center gap-2">
                Tech Stack
                {form.techstack.length > 0 && (
                  <svg
                    className="w-4 h-4 text-green-400 animate-scale-in"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </Label>
              <div className="relative" ref={suggestionsRef}>
                <Input
                  placeholder="Search for technologies..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className={`bg-gray-800 border text-white placeholder-gray-400 rounded-lg h-10 sm:h-12 transition-all duration-300 ${
                    validationErrors.techstack
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : form.techstack.length > 0
                        ? "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        : "border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  }`}
                />

                {/* Selected Tech Stack Tags */}
                {form.techstack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.techstack.map((tech, index) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30 animate-scale-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechStack(tech)}
                          className="text-orange-400 hover:text-orange-200 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggestions Dropdown */}
                {showSuggestions && form.role && form.level && (
                  <div className="absolute z-20 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto mt-1 animate-slide-down">
                    {loadingSuggestions ? (
                      <div className="p-4 text-gray-400 text-center flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        Loading suggestions...
                      </div>
                    ) : techSuggestions.length > 0 ? (
                      techSuggestions.map((tech, index) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => addTechStack(tech)}
                          className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-all duration-200 border-b border-gray-700 last:border-b-0 animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                          disabled={form.techstack.includes(tech)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{tech}</span>
                            {form.techstack.includes(tech) && (
                              <svg
                                className="w-4 h-4 text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-gray-400 text-center">
                        {searchTerm ? "No technologies found" : "Enter a role and level to see suggestions"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Add Popular Tech Stacks */}
              {form.role && form.level && techSuggestions.length > 0 && (
                <div className="mt-3 animate-fade-in">
                  <p className="text-gray-400 text-xs mb-2">Popular technologies:</p>
                  <div className="flex flex-wrap gap-2">
                    {techSuggestions.slice(0, 6).map((tech, index) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => addTechStack(tech)}
                        disabled={form.techstack.includes(tech)}
                        className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 animate-scale-in ${
                          form.techstack.includes(tech)
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-orange-500/20 hover:text-orange-300 hover:border-orange-500/30 hover:scale-105"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {validationErrors.techstack && (
                <p className="text-red-400 text-xs animate-slide-down">{validationErrors.techstack}</p>
              )}
            </div>

            {/* Type Field */}
            <div className="space-y-2 transform transition-all duration-300">
              <Label htmlFor="type" className="text-white font-medium text-sm flex items-center gap-2">
                Interview Type
                {form.type && (
                  <svg
                    className="w-4 h-4 text-green-400 animate-scale-in"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </Label>
              <div className="relative">
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleTypeChange}
                  required
                  className={`w-full h-10 sm:h-12 bg-gray-800 border text-white rounded-lg px-4 appearance-none transition-all duration-300 cursor-pointer ${
                    validationErrors.type
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : form.type
                        ? "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        : "border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  }`}
                >
                  <option value="" className="bg-gray-800">
                    Select type
                  </option>
                  {TYPES.map((t) => (
                    <option key={t} value={t} className="bg-gray-800">
                      {t}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {validationErrors.type && (
                <p className="text-red-400 text-xs animate-slide-down">{validationErrors.type}</p>
              )}
            </div>

            {/* Amount Field */}
            <div className="space-y-2 transform transition-all duration-300">
              <Label htmlFor="amount" className="text-white font-medium text-sm flex items-center gap-2">
                Number of Questions
                {form.amount >= 1 && form.amount <= 20 && (
                  <svg
                    className="w-4 h-4 text-green-400 animate-scale-in"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min={1}
                max={20}
                value={form.amount}
                onChange={handleAmountChange}
                required
                className={`bg-gray-800 border text-white placeholder-gray-400 rounded-lg h-10 sm:h-12 transition-all duration-300 ${
                  validationErrors.amount
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : form.amount >= 1 && form.amount <= 20
                      ? "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      : "border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                }`}
              />
              {validationErrors.amount && (
                <p className="text-red-400 text-xs animate-slide-down">{validationErrors.amount}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-slide-down">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full h-10 sm:h-12 font-semibold rounded-lg transition-all duration-300 transform ${
                isFormValid
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-500/25 hover:scale-105"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Interview...
                </div>
              ) : (
                "Start Interview"
              )}
            </Button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default InterviewForm
