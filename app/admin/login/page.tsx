"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { setAdminToken } from "@/lib/admin-client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const credential = btoa(`${email}:${password}`);
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { Authorization: `Bearer ${credential}` },
      });
      if (res.ok) {
        setAdminToken(credential);
        router.push("/admin/dashboard");
      } else {
        setError("Incorrect email or password.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.kicker}>Cycle Wala</p>
        <h1 className={styles.h1}>Admin Access</h1>
        <p className={styles.sub}>Manage cycles, prices and photos.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@cyclewala.example"
              className={styles.input}
              autoFocus
              required
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={styles.input}
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={loading || !email || !password}>
            {loading ? "Checking…" : "Sign In"}
          </button>
        </form>

        <a href="/" className={styles.back}>
          ← Back to the site
        </a>
      </div>
    </main>
  );
}
