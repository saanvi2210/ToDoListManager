"use client";
import React from "react";
import TodoApp from "../components/TodoApp.jsx";
import { useRouter } from 'next/navigation';
import {useAuth} from '@/hooks/useAuth.js'

function Tasks() {
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
    <div>
      <TodoApp user={user}/>
    </div>
  );
}

export default Tasks;
