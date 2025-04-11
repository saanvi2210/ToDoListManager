"use client";
import React from "react";
import TodoApp from "../components/TodoApp.jsx";
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {useAuth} from '@/hooks/useAuth.js'

function App() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // While Firebase is checking auth
  if (loading) return <div className="text-center p-10">Loading...</div>;

  // If no user is signed in, redirect to login
  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <TodoApp user={user}/>
    </div>
  );
}

export default App;
