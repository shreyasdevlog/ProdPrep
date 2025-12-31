import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cv_text, interview_type, user_id } = body;

    if (!cv_text || !interview_type) {
      return NextResponse.json(
        { error: 'Missing required fields: cv_text and interview_type' },
        { status: 400 }
      );
    }

    // Get Supabase credentials from request headers (set by client from session storage)
    const supabaseUrl = request.headers.get('x-supabase-url') || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = request.headers.get('x-supabase-key') || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Check if Supabase is configured
    if (!supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseKey || supabaseKey.includes('placeholder-key')) {
      console.warn('Supabase not configured. Using mock mode.');
      // Return a mock response for development
      const mockData = {
        id: `mock-${Date.now()}`,
        user_id: '00000000-0000-0000-0000-000000000000',
        cv_text: cv_text,
        interview_type: interview_type,
        status: 'pending',
        transcript: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return NextResponse.json({ data: mockData }, { status: 201 });
    }

    // Dynamically import and create client with provided credentials
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // For now, we'll use a dummy user_id if authentication is not set up
    // This should be replaced with actual user authentication
    const userId = user_id || '00000000-0000-0000-0000-000000000000';

    const { data, error } = await supabase
      .from('interviews')
      .insert([
        {
          user_id: userId,
          cv_text,
          interview_type,
          status: 'pending',
          transcript: null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create interview' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
