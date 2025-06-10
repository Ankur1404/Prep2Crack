import React from 'react'
import Image from 'next/image';
import { cn } from '@/lib/utils';

enum CallStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED"
}

interface AgentProps {
  userName: string;
  userId: string;
  type: "generate-interview" | "take-interview";
}

const Agent = ({ userName }: AgentProps) => {
  const callStatus = CallStatus.FINISHED; // This would typically come from props or state
  const isSpeaking = true;
  const messages  = [
  'What is your name?',
  'My name is John Doe,nice to meet you!',
  ];
  const lastMessage = messages[messages.length - 1];

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
              src="/user-avatar.png"
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
                  <p key = {lastMessage} className={cn('transition-opacity duration-300 opacity-0', 'animate-fadeIn opacity-100')}>
                    {lastMessage}
                  </p>
                  </div>
                </div>
              )}

      <div className='w-full flex justify-center'>
        {callStatus !== CallStatus.ACTIVE ? (
          <button className='relative btn-call'>
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
          <button className='btn-disconnect'>
            <span>End Call</span>
          </button>
        )}
      </div>
    </>
  )
}

export default Agent