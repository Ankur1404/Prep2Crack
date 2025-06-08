import React from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { getRandomInterviewCover } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import DisplayTechIcons from './DisplayTechIcons'

const InterviewCard = ({ interviewId, userId, role, type, techstack, createdAt }: InterviewCardProps) => {
  const feedback = null as Feedback | null
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY')

  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
      <div className='card-interview'>
        <div className='bg-gradient-to-br from-neutral-900 via-gray-800 to-gray-700 rounded-xl p-2 relative'>
          <div className='absolute top-0 right-0 w-fit p-2 rounded-b-lg bg-light-600'>
            <p className='badge-text'>{normalizedType}</p>
          </div>

          <Image
            src={getRandomInterviewCover()}
            alt="Interview Cover"
            width={90}
            height={90}
            className='rounded-full object-cover w-[90px] h-[90px]'
          />

          <h3 className='mt-5 capitalize'>{role} Interview</h3>

          <div className='flex flex-row gap-5 mt-3'>
            <div className='flex flex-row gap-2'>
              <Image src="/calendar.svg" alt="Calendar Icon" width={20} height={20} />
              <p className='text-sm text-gray-400'>{formattedDate}</p>
            </div>
            <div className='flex flex-row gap-2'>
              <Image src="/star.svg" alt="Star Icon" width={20} height={20} />
              <p>{feedback?.totalScore || '---'}/100</p>
            </div>
          </div>

          <p className='line-clamp-3 text-sm text-gray-400 mt-2'>
            {feedback?.finalAssessment || "You haven't taken this interview yet. Take it now!"}
          </p>
        </div>

        <div className='flex flex-row justify-between mt-4'>
          <DisplayTechIcons techStack={techstack} />

          <Link href={feedback ? `/interview/${interviewId}/feedback` : `/interview/${interviewId}`}>
            <Button className='btn-primary'>
              {feedback ? "View Feedback" : "Take Interview"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default InterviewCard
