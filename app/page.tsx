"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mic, Target, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <nav className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                AI PM Interview Prep
              </span>
            </div>
            <Link href="/dashboard">
              <Button variant="default">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-zinc-600 dark:text-zinc-400">
              AI-Powered Voice Mock Interviews
            </span>
          </div>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl md:text-7xl">
            Master PM Interviews with{" "}
            <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-50 dark:to-zinc-400">
              AI Coaching
            </span>
          </h1>

          <p className="mb-12 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Practice product design, RCA, and strategy interviews with our
            AI-powered voice interviewer. Get real-time feedback and improve
            your skills.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                <Mic className="h-5 w-5" />
                Start Your First Interview
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <Target className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Targeted Practice
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Choose from Product Design, RCA, or Strategy interview types
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <Mic className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Voice-First Experience
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Natural conversation with AI that feels like a real interview
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <TrendingUp className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Track Progress
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Review your interview history and see your improvement
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 py-20 dark:border-zinc-800">
          <h2 className="mb-12 text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            How It Works
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                1
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Upload Your CV
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Share your background so the AI can tailor questions to your
                experience
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                2
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Choose Interview Type
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Select Product Design, RCA, or Strategy, and pick your target
                company
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                3
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Start Practicing
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Have a natural conversation with AI and get instant feedback
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>© 2024 AI PM Interview Prep. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
