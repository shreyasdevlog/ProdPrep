"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/contexts/SessionContext";
import { Mic, MicOff, PhoneOff } from "lucide-react";

export default function InterviewRoom() {
  const router = useRouter();
  const { sessionData, resetSession } = useSession();
  const [isMuted, setIsMuted] = useState(false);
  const [isListening] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!sessionData.interviewType || !sessionData.domain) {
      router.push("/setup");
      return;
    }
  }, [sessionData, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (confirm("Are you sure you want to end this interview?")) {
      resetSession();
      router.push("/dashboard");
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    console.log(isMuted ? "Unmuted" : "Muted");
  };

  if (!sessionData.interviewType) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <nav className="border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-6 w-6 text-zinc-50" />
              <span className="text-xl font-semibold text-zinc-50">
                AI PM Interview Prep
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-50">
                {formatDuration(duration)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-zinc-300">Live Interview</span>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-zinc-50">
            {sessionData.interviewType}
          </h1>
          <p className="text-zinc-400">
            {sessionData.domain} • {sessionData.cvFileName}
          </p>
        </div>

        <div className="relative mb-12">
          <div
            className={`relative flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 ${
              isListening ? "animate-pulse-slow" : ""
            }`}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 blur-xl" />
            
            <div className="relative">
              {isListening && !isMuted && (
                <>
                  <div className="absolute inset-0 animate-ping rounded-full bg-zinc-600 opacity-20" />
                  <div className="absolute inset-0 animate-pulse rounded-full bg-zinc-600 opacity-30" />
                </>
              )}
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-zinc-900">
                <Mic className="h-16 w-16 text-zinc-50" />
              </div>
            </div>
          </div>

          {isListening && !isMuted && (
            <div className="absolute -inset-8 animate-pulse-ring rounded-full border-2 border-zinc-700 opacity-20" />
          )}
        </div>

        <div className="mb-8 max-w-2xl text-center">
          <p className="text-lg text-zinc-300">
            {isMuted
              ? "You are muted. Click the microphone to unmute and continue."
              : "The AI is listening. Share your thoughts and answer the questions naturally."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant={isMuted ? "default" : "outline"}
            size="lg"
            onClick={toggleMute}
            className="gap-2"
          >
            {isMuted ? (
              <>
                <MicOff className="h-5 w-5" />
                Unmute
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                Mute
              </>
            )}
          </Button>

          <Button
            variant="danger"
            size="lg"
            onClick={handleEndCall}
            className="gap-2"
          >
            <PhoneOff className="h-5 w-5" />
            End Interview
          </Button>
        </div>

        <div className="mt-12 rounded-lg border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="mb-3 font-semibold text-zinc-50">
            Interview Tips
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>• Speak clearly and at a natural pace</li>
            <li>• Structure your answers using frameworks (CIRCLES, STAR, etc.)</li>
            <li>• Ask clarifying questions when needed</li>
            <li>• Think out loud to show your problem-solving process</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
