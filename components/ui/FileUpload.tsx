"use client";

import React, { useCallback, useState } from "react";
import { Upload, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = ".pdf",
  maxSize = 5 * 1024 * 1024,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleFile = useCallback(
    (file: File) => {
      setError("");

      if (file.size > maxSize) {
        setError(`File size exceeds ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (accept && !accept.split(",").includes(extension)) {
        setError(`Please upload a ${accept} file`);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
      console.log("File selected:", file.name);
    },
    [accept, maxSize, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div className={cn("w-full", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragging
            ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
            : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950",
          "hover:border-zinc-400 dark:hover:border-zinc-600",
          "cursor-pointer"
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <File className="h-10 w-10 text-zinc-900 dark:text-zinc-100" />
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {selectedFile.name}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Drop your CV here or click to browse
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {accept} up to {maxSize / (1024 * 1024)}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
