# AI PM Interview Prep Platform

A Next.js 14 web application for AI-powered Product Manager interview preparation with voice mock interviews.

## Features

### Core Pages

1. **Landing Page** (`/`)
   - Clean, professional hero section
   - Value proposition for AI Voice Mock Interviews
   - Feature highlights and call-to-action buttons
   - Linear-style aesthetic with dark mode support

2. **Dashboard** (`/dashboard`)
   - Central hub for managing interview sessions
   - Interview history with statistics
   - Quick access to start new sessions
   - Session metrics (total sessions, monthly count, total time)

3. **Setup Wizard** (`/setup`)
   - Multi-step form for interview configuration
   - **Step 1: CV Upload**
     - Drag-and-drop file uploader supporting PDF files
     - File validation (type and size)
     - Visual feedback on successful upload
   - **Step 2: Interview Configuration**
     - Interview Type selector (Product Design, RCA, Strategy)
     - Domain/Company selector (Fintech, Google, Cred, Meta, Amazon, Other)
     - Session summary before starting

4. **Interview Room** (`/interview`)
   - Clean interface with pulse animation representing AI listening
   - Live interview indicator
   - Duration timer
   - Mute/Unmute toggle
   - End Call button with confirmation
   - Interview tips panel
   - Real-time visual feedback

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **State Management**: React Context API

## UI Components

Built with a custom component library following Shadcn UI patterns:

- `Button` - Multiple variants (default, outline, ghost, danger)
- `Card` - Container component with Header, Title, Description, and Content subcomponents
- `Input` - Form input with consistent styling
- `Select` - Dropdown selector
- `Label` - Form labels
- `FileUpload` - Drag-and-drop file uploader with validation

## State Management

Session data is managed through React Context (`SessionContext`):

```typescript
interface SessionData {
  interviewType: InterviewType | null; // "Product Design" | "RCA" | "Strategy"
  domain: Domain | null; // "Fintech" | "Google" | "Cred" | "Meta" | "Amazon" | "Other"
  cvText: string;
  cvFileName: string;
}
```

## Project Structure

```
/app
  /dashboard      - Dashboard page
  /setup          - Setup wizard page
  /interview      - Interview room page
  page.tsx        - Landing page
  layout.tsx      - Root layout with SessionProvider
  globals.css     - Global styles and animations
/components
  /ui             - Reusable UI components
/contexts
  SessionContext.tsx - Session state management
/lib
  utils.ts        - Utility functions
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Design System

### Colors

The application uses a zinc-based color palette with dark mode support:

- Background: White / Black
- Foreground: Zinc-900 / Zinc-50
- Borders: Zinc-200 / Zinc-800
- Muted: Zinc-600 / Zinc-400

### Typography

- Font Family: Geist Sans (primary), Geist Mono (monospace)
- Headings: Bold, tracking-tight
- Body: Regular weight, comfortable line height

### Components

All components follow a Linear-style aesthetic:

- Subtle borders and shadows
- Rounded corners (8px base)
- Smooth transitions
- Clear visual hierarchy
- High contrast for accessibility

## Current Placeholder Logic

- **File Upload**: Currently logs the file name to console. File content is mocked with a placeholder string.
- **Interview Audio**: The Interview Room UI is built with visual feedback (pulse animation, mute/unmute), but actual audio processing will be added in future iterations.

## Future Enhancements

- Real CV text extraction from PDF files
- Backend API integration for AI interview logic
- Voice-to-text and text-to-voice functionality
- Interview recording and playback
- Detailed feedback and scoring system
- User authentication and profile management
- Interview analytics and progress tracking

## License

Private project. All rights reserved.
