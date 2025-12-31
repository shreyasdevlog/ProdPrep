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

    // Dynamic import to avoid build-time validation issues
    const { supabase } = await import('@/lib/supabaseClient');

    // Check if Supabase is configured
    if (!supabase) {
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
