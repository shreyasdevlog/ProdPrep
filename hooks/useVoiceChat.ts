'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { useKeys } from './useKeys';

interface VoiceChatConfig {
  cvText?: string;
  interviewType?: string;
  domain?: string;
}

export interface VoiceChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface VoiceChatState {
  isConnected: boolean;
  isListening: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  transcript: VoiceChatMessage[];
  error: string | null;
}

export function useVoiceChat(config: VoiceChatConfig) {
  const { keys } = useKeys();  
  const [state, setState] = useState<VoiceChatState>({
    isConnected: false,
    isListening: false,
    isThinking: false,
    isSpeaking: false,
    transcript: [],
    error: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const microphoneRef = useRef<MediaStream | null>(null);

  // Setup system instruction with user context
  const getSystemInstruction = useCallback(() => {
    const parts: string[] = [];
    
    if (config.cvText) {
      parts.push(`Candidate's CV/Background: ${config.cvText}`);
    }
    
    if (config.interviewType) {
      parts.push(`Interview Type: ${config.interviewType}`);
    }
    
    if (config.domain) {
      parts.push(`Target Company/Domain: ${config.domain}`);
    }
    
    const context = parts.length > 0 ? `Context: ${parts.join('. ')}` : '';
    
    return `You are a Senior Product Manager conducting a mock interview. ${context} 
Ask relevant, challenging questions based on their experience. Wait for them to finish speaking before asking the next question. 
Be conversational, professional, and provide constructive feedback. 
Keep responses concise (1-2 minutes spoken) and focused on PM interview best practices.`;
  }, [config.cvText, config.interviewType, config.domain]);

  // Setup microphone
  const setupMicrophone = useCallback(async () => {
    try {
      if (!keys.geminiKey) {
        setState(prev => ({ ...prev, error: 'Gemini API key not configured' }));
        return null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000, // Gemini requires 16kHz
          channelCount: 1,
        },
      });

      microphoneRef.current = stream;

      setState(prev => ({ ...prev, isListening: true }));
      return { stream };
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to access microphone' 
      }));
      return null;
    }
  }, [keys.geminiKey]);

  // Setup WebSocket connection
  const connect = useCallback(async () => {
    if (!keys.geminiKey) {
      setState(prev => ({ ...prev, error: 'Gemini API key not configured' }));
      return;
    }

    try {
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativeLanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${keys.geminiKey}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({ ...prev, isConnected: true }));
        
        // Send initial setup message with system instruction
        const setupMessage = {
          setup: {
            system_instruction: getSystemInstruction(),
          },
        };
        ws.send(JSON.stringify(setupMessage));
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          
          // Handle server content (audio from Gemini)
          if (response.serverContent) {
            for (const content of response.serverContent) {
              if (content.realtime_output?.text_delta?.text) {
                // Add assistant's text to transcript
                setState(prev => ({
                  ...prev,
                  isSpeaking: true,
                  isThinking: false,
                  transcript: [
                    ...prev.transcript,
                    {
                      role: 'assistant',
                      text: content.realtime_output.text_delta.text,
                      timestamp: new Date(),
                    }
                  ]
                }));
              }
            }
          }
          
          // Handle tool calls or setup complete
          if (response.setupComplete) {
            console.log('Setup complete');
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({ 
          ...prev, 
          error: 'Connection to Gemini API failed' 
        }));
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setState(prev => ({ 
          ...prev, 
          isConnected: false,
          isListening: false 
        }));
        wsRef.current = null;
      };

    } catch (error) {
      console.error('Error connecting to voice chat:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to start voice chat' 
      }));
    }
  }, [keys.geminiKey, getSystemInstruction]);

  // Send text message to Gemini
  const sendTextMessage = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = {
        client_content: [
          {
            parts: [
              {
                text: text,
              }
            ]
          }
        ],
      };
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.getTracks().forEach(track => track.stop());
      microphoneRef.current = null;
    }
    
    setState({
      isConnected: false,
      isListening: false,
      isThinking: false,
      isSpeaking: false,
      transcript: [],
      error: null,
    });
  }, []);

  // Add user message to transcript
  const addUserMessage = useCallback((text: string) => {
    setState(prev => ({
      ...prev,
      transcript: [
        ...prev.transcript,
        {
          role: 'user',
          text,
          timestamp: new Date(),
        }
      ]
    }));
    
    // Also send to Gemini
    sendTextMessage(text);
  }, [sendTextMessage]);

  return {
    state,
    connect,
    disconnect,
    addUserMessage,
  };
}
