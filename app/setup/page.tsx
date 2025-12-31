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
import { Mic, ArrowLeft, ArrowRight, Upload, Settings } from "lucide-react";

type Step = "upload" | "config";

export default function SetupWizard() {
  const router = useRouter();
  const { sessionData, updateSessionData } = useSession();
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [interviewType, setInterviewType] = useState<InterviewType | "">(
    sessionData.interviewType || ""
  );
  const [domain, setDomain] = useState<Domain | "">(sessionData.domain || "");

  const handleFileSelect = (file: File) => {
    updateSessionData({
      cvFileName: file.name,
      cvText: `Mock CV text from ${file.name}`,
    });
  };

  const handleNextFromUpload = () => {
    if (!sessionData.cvFileName) {
      alert("Please upload your CV first");
      return;
    }
    setCurrentStep("config");
  };

  const handleStartInterview = () => {
    if (!interviewType || !domain) {
      alert("Please select both interview type and domain");
      return;
    }

    updateSessionData({
      interviewType: interviewType as InterviewType,
      domain: domain as Domain,
    });

    router.push("/interview");
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
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              currentStep === "upload"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            <Upload className="h-5 w-5" />
          </div>
          <div
            className={`h-1 w-20 ${
              currentStep === "config"
                ? "bg-zinc-900 dark:bg-zinc-50"
                : "bg-zinc-200 dark:bg-zinc-800"
            }`}
          />
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              currentStep === "config"
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            <Settings className="h-5 w-5" />
          </div>
        </div>

        {currentStep === "upload" ? (
          <Card>
            <CardHeader>
              <CardTitle>Upload Your CV</CardTitle>
              <CardDescription>
                Upload your CV so the AI can tailor questions to your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onFileSelect={handleFileSelect} accept=".pdf" />

              {sessionData.cvFileName && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ CV uploaded successfully: {sessionData.cvFileName}
                  </p>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={handleNextFromUpload}
                  disabled={!sessionData.cvFileName}
                  size="lg"
                  className="gap-2"
                >
                  Next: Configure Interview
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
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
                  onClick={() => setCurrentStep("upload")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleStartInterview}
                  disabled={!interviewType || !domain}
                  size="lg"
                  className="gap-2"
                >
                  <Mic className="h-5 w-5" />
                  Start Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
