"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { FileUpload } from "@/components/ui/FileUpload";
import { useSession, InterviewType, Domain } from "@/contexts/SessionContext";
import { Mic, ArrowLeft, ArrowRight, Upload, Settings, FileText, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "upload" | "review" | "config";

export default function SetupWizard() {
  const router = useRouter();
  const { sessionData, updateSessionData } = useSession();
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [interviewType, setInterviewType] = useState<InterviewType | "">(
    sessionData.interviewType || ""
  );
  const [domain, setDomain] = useState<Domain | "">(sessionData.domain || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cvText, setCvText] = useState("");
  const [uploadError, setUploadError] = useState("");

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setUploadError("");
    updateSessionData({
      cvFileName: file.name,
      cvText: "",
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-cv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse PDF");
      }

      const data = await response.json();
      setCvText(data.text);
      updateSessionData({
        cvFileName: file.name,
        cvText: data.text,
      });

      // Move to review step after successful parsing
      setCurrentStep("review");
    } catch (error) {
      console.error("Error parsing PDF:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to parse PDF. Please try again.");
      updateSessionData({
        cvFileName: "",
        cvText: "",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmCV = () => {
    setCurrentStep("config");
  };

  const handleStartInterview = async () => {
    if (!interviewType || !domain || !sessionData.cvText) {
      alert("Please complete all steps before starting the interview");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cv_text: sessionData.cvText,
          interview_type: interviewType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save interview");
      }

      const data = await response.json();
      
      updateSessionData({
        interviewType: interviewType as InterviewType,
        domain: domain as Domain,
        interviewId: data.data.id,
      });

      router.push("/interview");
    } catch (error) {
      console.error("Error saving interview:", error);
      alert(error instanceof Error ? error.message : "Failed to save interview. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const transitions = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Mic className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                AI PM Interview Prep
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
            Setup Your Interview
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Let&apos;s get everything ready for your mock interview session
          </p>
        </div>

        <div className="mb-8 flex items-center justify-center gap-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              currentStep === "upload"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-green-600 text-white"
            }`}
          >
            {currentStep === "upload" ? (
              <Upload className="h-5 w-5" />
            ) : (
              <Check className="h-5 w-5" />
            )}
          </div>
          <div
            className={`h-1 w-20 transition-all ${
              currentStep === "review" || currentStep === "config"
                ? "bg-zinc-900 dark:bg-zinc-50"
                : "bg-zinc-200 dark:bg-zinc-800"
            }`}
          />
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              currentStep === "review"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : currentStep === "config"
                ? "bg-green-600 text-white"
                : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {currentStep === "review" ? (
              <FileText className="h-5 w-5" />
            ) : currentStep === "config" ? (
              <Check className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
          </div>
          <div
            className={`h-1 w-20 transition-all ${
              currentStep === "config"
                ? "bg-zinc-900 dark:bg-zinc-50"
                : "bg-zinc-200 dark:bg-zinc-800"
            }`}
          />
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              currentStep === "config"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            <Settings className="h-5 w-5" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === "upload" && (
            <motion.div
              key="upload"
              initial={transitions.enter}
              animate={transitions.center}
              exit={transitions.exit}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your CV</CardTitle>
                  <CardDescription>
                    Upload your CV so the AI can tailor questions to your experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileSelect={handleFileSelect} accept=".pdf" />

                  {isProcessing && (
                    <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                      <Loader2 className="h-5 w-5 animate-spin text-zinc-900 dark:text-zinc-50" />
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Processing your CV...
                      </p>
                    </div>
                  )}

                  {uploadError && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        {uploadError}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === "review" && (
            <motion.div
              key="review"
              initial={transitions.enter}
              animate={transitions.center}
              exit={transitions.exit}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Background</CardTitle>
                  <CardDescription>
                    Please verify that the AI correctly parsed your CV text. You can edit if needed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cv-text">Summary of Your Background</Label>
                    <textarea
                      id="cv-text"
                      value={cvText}
                      onChange={(e) => {
                        setCvText(e.target.value);
                        updateSessionData({ cvText: e.target.value });
                      }}
                      className="w-full min-h-[300px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/20"
                      placeholder="Your CV text will appear here..."
                    />
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Feel free to edit or add any additional information you want the AI to know about you.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("upload")}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Upload Different CV
                    </Button>
                    <Button
                      onClick={handleConfirmCV}
                      disabled={!cvText.trim()}
                      size="lg"
                      className="gap-2"
                    >
                      Confirm & Continue
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === "config" && (
            <motion.div
              key="config"
              initial={transitions.enter}
              animate={transitions.center}
              exit={transitions.exit}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Configure Interview</CardTitle>
                  <CardDescription>
                    Choose the interview type and target company/domain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="interview-type">Interview Type</Label>
                    <Select
                      id="interview-type"
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                    >
                      <option value="">Select interview type...</option>
                      <option value="Product Design">Product Design</option>
                      <option value="RCA">RCA (Root Cause Analysis)</option>
                      <option value="Strategy">Strategy</option>
                    </Select>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Choose the type of PM interview you want to practice
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain / Company</Label>
                    <Select
                      id="domain"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value as Domain)}
                    >
                      <option value="">Select domain...</option>
                      <option value="Fintech">Fintech</option>
                      <option value="Google">Google</option>
                      <option value="Cred">Cred</option>
                      <option value="Meta">Meta</option>
                      <option value="Amazon">Amazon</option>
                      <option value="Other">Other</option>
                    </Select>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Select the company or domain you&apos;re preparing for
                    </p>
                  </div>

                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <h4 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">
                      Session Summary
                    </h4>
                    <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      <p>
                        <strong>CV:</strong> {sessionData.cvFileName || "Not uploaded"}
                      </p>
                      <p>
                        <strong>Interview Type:</strong> {interviewType || "Not selected"}
                      </p>
                      <p>
                        <strong>Domain:</strong> {domain || "Not selected"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("review")}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleStartInterview}
                      disabled={!interviewType || !domain || isSaving}
                      size="lg"
                      className="gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Mic className="h-5 w-5" />
                          Confirm & Start Interview
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
