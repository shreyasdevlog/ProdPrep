"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { useKeys } from "@/hooks/useKeys";
import { Settings, ArrowLeft, Save, Trash2, Check, X, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { keys, saveKeys, clearKeys, areKeysConfigured, isLoaded } = useKeys();
  const [localKeys, setLocalKeys] = useState(keys);
  const [showStatus, setShowStatus] = useState<"success" | "error" | null>(null);

  const handleSave = () => {
    saveKeys(localKeys);
    setShowStatus("success");
    setTimeout(() => setShowStatus(null), 3000);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all API keys? This will require you to re-enter them.")) {
      clearKeys();
      setLocalKeys({
        geminiKey: '',
        supabaseUrl: '',
        supabaseAnonKey: '',
      });
      setShowStatus("error");
      setTimeout(() => setShowStatus(null), 3000);
    }
  };

  const handleChange = (field: keyof typeof localKeys, value: string) => {
    setLocalKeys({ ...localKeys, [field]: value });
  };

  const isKeySet = (value: string) => !!value && value.trim() !== "";
  const isGeminiKeySet = isKeySet(localKeys.geminiKey);
  const isSupabaseUrlSet = isKeySet(localKeys.supabaseUrl);
  const isSupabaseKeySet = isKeySet(localKeys.supabaseAnonKey);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Settings
              </span>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            API Configuration
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Configure your API keys to enable full functionality. Keys are stored in browser session storage and will be cleared when you close the browser.
          </p>
        </div>

        {!isLoaded ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-50"></div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* API Keys Configuration Card */}
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Enter your API keys below to enable application features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Gemini API Key */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gemini-key">Gemini API Key</Label>
                    <div className="flex items-center gap-1">
                      {isGeminiKeySet ? (
                        <>
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">Configured</span>
                        </>
                      ) : (
                        <>
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-xs text-red-600 dark:text-red-400">Not Set</span>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    id="gemini-key"
                    type="password"
                    value={localKeys.geminiKey}
                    onChange={(e) => handleChange("geminiKey", e.target.value)}
                    placeholder="Enter your Gemini API key"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/20"
                  />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Used for AI-powered interview generation. Get your key from{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-900 underline hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>

                {/* Supabase URL */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supabase-url">Supabase URL</Label>
                    <div className="flex items-center gap-1">
                      {isSupabaseUrlSet ? (
                        <>
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">Configured</span>
                        </>
                      ) : (
                        <>
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-xs text-red-600 dark:text-red-400">Not Set</span>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    id="supabase-url"
                    type="text"
                    value={localKeys.supabaseUrl}
                    onChange={(e) => handleChange("supabaseUrl", e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/20"
                  />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Your Supabase project URL. Found in Settings → API in your Supabase dashboard.
                  </p>
                </div>

                {/* Supabase Anon Key */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="supabase-anon-key">Supabase Anon Key</Label>
                    <div className="flex items-center gap-1">
                      {isSupabaseKeySet ? (
                        <>
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">Configured</span>
                        </>
                      ) : (
                        <>
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-xs text-red-600 dark:text-red-400">Not Set</span>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    id="supabase-anon-key"
                    type="password"
                    value={localKeys.supabaseAnonKey}
                    onChange={(e) => handleChange("supabaseAnonKey", e.target.value)}
                    placeholder="Enter your Supabase anon key"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/20"
                  />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Your Supabase anonymous/public key. Found in Settings → API in your Supabase dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Overall Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration Status</CardTitle>
              </CardHeader>
              <CardContent>
                {areKeysConfigured() ? (
                  <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        All API keys configured
                      </p>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Your application is ready to use all features.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900 dark:text-amber-100">
                        Configuration incomplete
                      </p>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        Please configure all API keys to enable full functionality. The app will work in limited mode without them.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleClear}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Keys
              </Button>
              <div className="flex items-center gap-2">
                {showStatus === "success" && (
                  <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <Check className="h-4 w-4" />
                    Keys saved successfully
                  </span>
                )}
                {showStatus === "error" && (
                  <span className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <X className="h-4 w-4" />
                    Keys cleared
                  </span>
                )}
                <Button
                  onClick={handleSave}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Keys
                </Button>
              </div>
            </div>

            {/* Security Notice */}
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                      Security Notice
                    </p>
                    <p>
                      Your API keys are stored in browser session storage only. They will be automatically cleared when you close the browser or clear your browser data. Never share your API keys with anyone.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
