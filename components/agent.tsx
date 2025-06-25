"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { vapi } from '@/lib/vapi.sdk';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';

enum CallStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED"
}



interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}
const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {

  const router = useRouter();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setIsSpeaking(true);
    }

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      setIsSpeaking(false);
    }

    const onMessage = (message: Message) => {
      if (message.type === 'transcript') {
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript,
          createdAt: new Date()
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }

    }

    const onSpeechStart = () => {
      setIsSpeaking(true);
    }
    const onSpeechEnd = () => {
      setIsSpeaking(false);
    }

    const onError = (error: Error) => {
      console.error("Error during call:", error);
    }

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError)

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage)
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError)
    }

  }, []);

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log('generate feedback here');

    const { success, feedbackId:id } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages
    })
    console.log('feedback created', success, id);
    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.log('Error receiving feedback');
      router.push('/')
    }
  }



  useEffect(() => {

    if (callStatus === CallStatus.FINISHED) {
      if (type === 'generate') {
        router.push('/')
      }
      else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    if (type === 'generate') {
      await vapi.start(
        process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!,
        {
          variableValues: {
            username: userName,
            userid: userId,
          }
        },
        undefined,
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
        {
          variableValues: {
            username: userName,
            userid: userId,
          }
        }
      );
    } else {
      let formattedQuestions = '';
      if (questions) {
        formattedQuestions = questions.map((question) => `-${question}`).join('\n')
      }
      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        }
      })
    }

  };



  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED)
    vapi.stop();
  }

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;


  return (
    <>
      <div className='call-view'>
        <div className='card-interviewer'>
          <div className='avatar'>
            <Image
              src="/ai-avatar.png"
              alt="Agent"
              width={65}
              height={54}
              className='object-cover'
            />
            {isSpeaking && (
              <span
                className='absolute inline-flex size-5/6 animate-ping rounded-full bg-primary-200 opacity-75'
                style={{ animationDuration: "2s" }}
              />
            )}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className='card-border'>
          <div className='card-content'>
            <Image
              src="/avatar.jpeg"
              alt="user avatar"
              width={200}
              height={200}
              className='object-cover rounded-full'
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className='transcript-border'>
          <div className='transcript'>
            <p key={latestMessage} className={cn('transition-opacity duration-300 opacity-0', 'animate-fadeIn opacity-100')}>
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className='w-full flex justify-center'>
        {callStatus !== CallStatus.ACTIVE ? (
          <button className='relative btn-call' onClick={handleCall}>
            <span className={cn(
              'absolute animate-ping rounded-full opacity-75',
              callStatus !== CallStatus.CONNECTING && 'hidden'
            )} />
            <span>
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
                ? 'Call'
                : callStatus === CallStatus.CONNECTING
                  ? 'Connecting...'
                  : '...'}
            </span>
          </button>
        ) : (
          <button className='btn-disconnect' onClick={handleDisconnect}>
            <span>End Call</span>
          </button>
        )}
      </div>
    </>
  )
}

export default Agent