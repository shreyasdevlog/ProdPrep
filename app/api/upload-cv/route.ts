import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // For now, return a mock text extraction
    // TODO: Integrate a proper PDF parsing library that works with Next.js
    // Note: pdf-parse has ESM issues with Next.js, and pdfjs-dist requires DOM APIs not available in Node
    // Consider using:
    // - pdf2json with proper ESM configuration
    // - pdf-lib for text extraction
    // - A server-side PDF service or edge function

    const mockText = `CV extracted from: ${file.name}\n\nThis is a placeholder for the actual PDF text extraction.\n\nTo implement real PDF parsing, you have several options:\n\n1. Use pdf2json package with proper ESM configuration\n2. Set up a separate API service for PDF processing\n3. Use Supabase Edge Functions for server-side PDF parsing\n4. Use a cloud-based PDF parsing service (like AWS Textract)\n\nFor now, users can edit this text directly in the review step to provide their background information.`;

    return NextResponse.json({
      text: mockText,
      info: {
        pages: 1,
        title: file.name,
      },
    });
  } catch (error) {
    console.error('PDF parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse PDF file' },
      { status: 500 }
    );
  }
}
