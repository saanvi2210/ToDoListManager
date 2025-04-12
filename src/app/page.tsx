"use client"

import Image from "next/image"
import Link from "next/link"
import landingImage from "../../public/landingAsset.jpg"
import { Rocket } from "lucide-react"
import { motion } from "framer-motion"
import '../app/globals.css'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex flex-col md:flex-row items-center justify-between px-8  relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/2 flex-col items-center justify-center text-center md:text-left mb-12 md:mb-0 z-10"
      >
        <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
          <h1 className="text-4xl font-bold text-blue-900">
            Daily<span className="text-blue-600">Drive</span>
          </h1>
          <motion.div
            animate={{ rotate: [0, 10, 0], y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Rocket className="text-blue-500 h-8 w-8" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-6xl text-left my-6 mt-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-600 font-serif">
              <div>TASK</div>
            
            <div className="text-6xl">MANAGEMENT</div>
            <div className="text-6xl">SOFTWARE</div>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-blue-700 mb-8 max-w-md mx-auto md:mx-0 font-serif"
        >
          Organize and manage your workflow like a pro with DailyDrive, your personal productivity partner to keep tasks
          on track and goals within reach.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full items-center jusitify-center"
        >
          <Link href="/signup">
            <button className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 font-medium flex items-center gap-2 group">
              Get Started
              <svg
                className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="md:w-1/2 flex justify-center p-6 z-10"
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-2 border border-blue-100">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-sky-500/5 z-0"></div>
          <Image
            src={landingImage || "/placeholder.svg"}
            alt="Task Management Screenshot"
            width={700}
            height={500}
            className="rounded-xl w-full h-auto relative z-10"
            priority
          />
         
        </div>
      </motion.div>
    </div>
  )
}
