"use client";
import { Input } from "@/components/ui/input";

import React, { FormEvent, ReactNode, useEffect, useState } from "react";

function AdminLayout({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [isWindoWActive, setIsWindoActive] = useState(false);
  const [key, setKey] = useState("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (key === "") return;
    const secretKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY!;
    if (secretKey !== key.trim()) {
      return alert("Wrong Secret Key ! ");
    }

    setKey("");
    sessionStorage.setItem("authenticated", "ok");
    window.location.reload();
  };
  useEffect(() => {
    if (window !== undefined) {
      setIsWindoActive(true);
      const isAuthenticated = sessionStorage.getItem("authenticated");
      if (isAuthenticated) {
        setAuthenticated(true);
      }
    }
  }, []);
  return (
    <div className="bg-black min-h-dvh dark text-white">
      <div className="text-center font-black text-blue-600 text-xl py-6">
        Admin Settings
      </div>
      {isWindoWActive && (
        <div>
          {authenticated ? (
            <div className="max-w-7xl m-auto">{children}</div>
          ) : (
            <form onSubmit={onSubmit}>
              <Input
                placeholder="Enter Secret Key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="p-6 m-auto max-w-xl"
              />
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
