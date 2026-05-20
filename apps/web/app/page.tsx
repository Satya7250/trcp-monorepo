"use client";

import { useEffect } from "react";
import router, {useRouter} from 'next/navigation'
import { useUser } from "~/hooks/api/auth";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if(user && user.id) {
      router.replace("/dashboard")
    }
  }, [user, router]);

  return (
    <main className="min-h-screen min-w-screen flex items-center justify-center">
      <div>{JSON.stringify(user)}</div>
    </main>
  );
}