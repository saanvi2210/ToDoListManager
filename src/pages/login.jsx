"use client";
import { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import {Rocket} from "lucide-react"
import '../app/globals.css'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in!");
      router.push("/tasks");
    } catch (error) {
      alert(error.message);
    }
  };

  const redirectSignUp = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-20 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white z-10 p-8 rounded-2xl shadow-xl border border-blue-100 w-full max-w-md"
      >
        <div className="flex gap-2 justify-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center font-serif">Login to</h2>
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
        </div>
       

        <div className="flex flex-col gap-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <button
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            Login
          </button>
          <button
            onClick={redirectSignUp}
            className="text-blue-600 hover:text-blue-800 transition-all text-sm underline text-center mt-2"
          >
            New user? Create an account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
