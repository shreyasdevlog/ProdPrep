"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Mic, Plus, Calendar, Clock, ArrowRight, Settings } from "lucide-react";

interface Interview {
  id: string;
  type: string;
  domain: string;
  date: string;
  duration: string;
  status: "completed" | "in-progress";
}

const mockInterviews: Interview[] = [
  {
    id: "1",
    type: "Product Design",
    domain: "Google",
    date: "2024-01-15",
    duration: "45 min",
    status: "completed",
  },
  {
    id: "2",
    type: "RCA",
    domain: "Meta",
    date: "2024-01-10",
    duration: "30 min",
    status: "completed",
  },
  {
    id: "3",
    type: "Strategy",
    domain: "Amazon",
    date: "2024-01-05",
    duration: "50 min",
    status: "completed",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Mic className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                AI PM Interview Prep
              </span>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Dashboard
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Welcome back! Ready to practice your interview skills?
            </p>
          </div>
          <Link href="/setup">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Start New Session
            </Button>
          </Link>
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Total Sessions
                  </p>
                  <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {mockInterviews.length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  <Mic className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    This Month
                  </p>
                  <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {mockInterviews.length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  <Calendar className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Total Time
                  </p>
                  <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    2.1h
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  <Clock className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Interview History</CardTitle>
            <CardDescription>
              Review your past mock interview sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mockInterviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                  <Mic className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  No interviews yet
                </h3>
                <p className="mb-6 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
                  Start your first mock interview session to begin practicing
                  your PM skills
                </p>
                <Link href="/setup">
                  <Button>Start Your First Interview</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mockInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                        <Mic className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                          {interview.type} - {interview.domain}
                        </p>
                        <div className="mt-1 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(interview.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {interview.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
