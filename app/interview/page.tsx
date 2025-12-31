"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/contexts/SessionContext";
import { Mic, MicOff, PhoneOff, Settings, Volume2, AlertCircle } from "lucide-react";
import { useVoiceChat } from "@/hooks/useVoiceChat";

export default function InterviewRoom() {
  const router = useRouter();
  const { sessionData, resetSession } = useSession();
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    state: voiceChat,
    connect,
    disconnect,
    addUserMessage,
  } = useVoiceChat({
    cvText: sessionData.cvText,
    interviewType: sessionData.interviewType || undefined,
    domain: sessionData.domain || undefined,
  });

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
      disconnect();
      resetSession();
      router.push("/dashboard");
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    console.log(isMuted ? "Unmuted" : "Muted");
  };

  const handleConnect = async () => {
    await connect();
  };

  // Auto-scroll to bottom of transcript
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [voiceChat.transcript]);

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
              <Button variant="ghost" size="sm" className="text-zinc-50 hover:text-zinc-100">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {/* Interview Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm">
              {voiceChat.isConnected ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-zinc-300">Connected</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-zinc-300">Not Connected</span>
                </>
              )}
            </div>

            <h1 className="mb-2 text-3xl font-bold text-zinc-50">
              {sessionData.interviewType}
            </h1>
            <p className="text-zinc-400">
              {sessionData.domain} • {sessionData.cvFileName || "No CV"}
            </p>
          </div>

          {/* Error Display */}
          {voiceChat.error && (
            <div className="mb-6 rounded-lg border border-red-900 bg-red-950/50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-100">Error</p>
                  <p className="text-sm text-red-200">{voiceChat.error}</p>
                  <p className="mt-2 text-xs text-red-300">
                    Check your settings and try connecting again.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Voice Interface */}
            <div className="flex flex-col items-center">
              {/* Pulse Animation - Listening */}
              {voiceChat.isListening && (
                <div className="mb-8 flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-24 w-24 rounded-full bg-zinc-800">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Mic className="h-12 w-12 text-zinc-50" />
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                    </div>
                  </div>
                  <p className="mt-4 text-lg font-medium text-zinc-50">Listening...</p>
                  <p className="text-sm text-zinc-400">
                    {isMuted ? "Unmute your microphone" : "Speak when ready"}
                  </p>
                </div>
              )}

              {/* AI Thinking */}
              {voiceChat.isThinking && (
                <div className="mb-8 flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full border-4 border-zinc-700">
                    <div className="h-16 w-16 rounded-full bg-zinc-800 animate-pulse" />
                  </div>
                  <p className="mt-4 text-lg font-medium text-zinc-50">Thinking...</p>
                  <p className="text-sm text-zinc-400">
                    Please wait for the interviewer
                  </p>
                </div>
              )}

              {/* AI Speaking */}
              {voiceChat.isSpeaking && (
                <div className="mb-8 flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-zinc-800">
                    <div className="h-16 w-16 rounded-full border-2 border-green-500 flex items-center justify-center">
                      <Volume2 className="h-12 w-12 text-green-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="mt-4 text-lg font-medium text-zinc-50">Interviewer Speaking...</p>
                  <p className="text-sm text-zinc-400">
                    Please wait until finished
                  </p>
                </div>
              )}

              {/* Idle State */}
              {!voiceChat.isListening && !voiceChat.isThinking && !voiceChat.isSpeaking && voiceChat.isConnected && (
                <div className="mb-8 flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full border-2 border-zinc-700 bg-zinc-800">
                    <Mic className="h-12 w-12 text-zinc-500" />
                  </div>
                  <p className="mt-4 text-lg font-medium text-zinc-50">Ready</p>
                  <p className="text-sm text-zinc-400">
                    Interview in progress
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Transcript */}
            <div className="flex flex-col h-[600px]">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 flex flex-col h-full">
                <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-3">
                  <h3 className="font-semibold text-zinc-50">Interview Transcript</h3>
                  <p className="text-xs text-zinc-400">
                    {voiceChat.transcript.length} messages
                  </p>
                </div>
                
                {/* Transcript Messages */}
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {voiceChat.transcript.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                      <p className="text-center">Transcript will appear here...</p>
                    </div>
                  )}
                  
                  {voiceChat.transcript.map((msg, index) => (
                    <div
                      key={`${msg.role}-${index}`}
                      className={`flex gap-3 ${
                        msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <>
                          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <Mic className="h-4 w-4 text-white" />
                          </div>
                          <div className="max-w-[70%] rounded-2xl rounded-2xl bg-blue-600 px-4 py-3 text-white">
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                            <p className="mt-1 text-xs text-blue-200">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="max-w-[70%] rounded-2xl rounded-2xl bg-zinc-800 px-4 py-3">
                            <p className="text-sm whitespace-pre-wrap break-words text-zinc-100">{msg.text}</p>
                            <p className="mt-1 text-xs text-zinc-400">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                            <Mic className="h-4 w-4 text-white" />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {!voiceChat.isConnected ? (
                <>
                  {!voiceChat.isConnected ? (
                    <Button
                      onClick={handleConnect}
                      disabled={voiceChat.isConnected || voiceChat.error !== null}
                      size="lg"
                      className="gap-2"
                    >
                      <Mic className="h-5 w-5" />
                      Connect to Interviewer
                    </Button>
                  ) : (
                    <Button
                      onClick={toggleMute}
                      size="lg"
                      variant={isMuted ? "default" : "outline"}
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
                  )}
                  
                  <Button
                    onClick={handleEndCall}
                    variant="danger"
                    size="lg"
                    className="gap-2"
                  >
                    <PhoneOff className="h-5 w-5" />
                    End Interview
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleConnect}
                  size="lg"
                  className="gap-2"
                >
                  <Mic className="h-5 w-5" />
                  Connect to Interviewer
                </Button>
              )}
            </div>

            {/* Interview Info */}
            {voiceChat.isConnected && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <h4 className="mb-2 text-sm font-medium text-zinc-50">Interview Details</h4>
                <div className="space-y-1 text-xs text-zinc-400">
                  <p><strong>Type:</strong> {sessionData.interviewType}</p>
                  <p><strong>Domain:</strong> {sessionData.domain}</p>
                  <p><strong>Duration:</strong> {formatDuration(duration)}</p>
                  <p><strong>Messages:</strong> {voiceChat.transcript.length}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
