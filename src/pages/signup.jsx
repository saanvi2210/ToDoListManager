"use client"

import { useState } from "react"
import { auth } from "@/firebase/firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Rocket, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react"
import "../app/globals.css"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      // Optionally, store the name in Firestore or user profile
      router.push("/tasks")
    } catch (err) {
      setError(err.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-sky-100 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background blur blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-16 left-10 w-72 h-72 bg-sky-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-16 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 z-10">
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
          Daily<span className="text-blue-600">Drive</span>
        </h1>
        <motion.div
          animate={{ rotate: [0, 10, 0], y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Rocket className="text-blue-500 h-6 w-6" />
        </motion.div>
      </div>

      {/* Signup Box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="bg-white/80 backdrop-blur-md w-full max-w-md rounded-2xl shadow-lg p-8 z-10 border border-blue-100"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800">Create Account</h2>
          <p className="text-blue-600 mt-2 text-sm">Join DailyDrive and boost your productivity</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-5 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name Input */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-blue-50 border border-blue-200 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-blue-50 border border-blue-200 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-blue-50 border border-blue-200 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-3 rounded-lg font-medium shadow-md flex justify-center items-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <>
                Sign Up
                <ArrowRight className="ml-2" size={18} />
              </>
            )}
          </motion.button>
        </form>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-blue-200 absolute w-full"></div>
          <span className="bg-white px-4 text-sm text-blue-500 relative z-10">OR</span>
        </div>

        {/* Link to login */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link href="/login">
            <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition">
              Log In to Existing Account
            </button>
          </Link>
        </motion.div>

        <p className="text-xs text-blue-700 mt-6 text-center">
          By signing up, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-blue-600 text-center z-10"
      >
        <p>
          Need help?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Contact Support
          </a>
        </p>
      </motion.div>
    </div>
  )
}
