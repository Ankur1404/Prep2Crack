import React from 'react'
import { Button } from '@/components/ui/button';
import  Link  from 'next/link';
import Image  from 'next/image';
import InterviewCard from '@/components/InterviewCard';
import { getInterviewByUserId, getLatestInterviewByUserId } from '@/lib/actions/general.action';
import { getCurrentUser } from '@/lib/actions/auth.action';



const page = async() => {

  const user = await getCurrentUser();
  const [userInterviews,latestInterviews] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterviewByUserId({userId:user?.id!})
  ])

  const hasPastInteriews = (userInterviews ?? []).length > 0;
  const hasUpcomingInterviews = (latestInterviews ?? []).length > 0;


  return (
    <>
    <div>
      <h1 className='text-3xl font-bold text-center mt-10'>Welcome to Prep2Crack!</h1>
      <p className='text-center mt-4'>An AI-powered platform for interview preparation</p>
      <div className='flex justify-center mt-10'>
        <Image src="/logo.png" alt="Logo" width={200} height={200} />
      </div> 
    </div>
    <section className='card-cta'>
      <div className='flex flex-col gap-6 max-w-lg'>
        <h2>
          Get interview ready with AI-powered mock interviews and personalized feedback.
        </h2>
        <p>
          Whether you're a student, a professional, or someone looking to switch careers, Prep2Crack is here to help you succeed.
        </p>
        <Button asChild className='btn-primary max-sm:w-full'>  
          <Link href="/interview/new">Get Started with the interview</Link>
        </Button>
      </div>

      <Image src= "/robot.png" alt ="P2C" width ={400} height = {400} className='max-sm:hidden'></Image>
    </section>                                                                                    <section className='flex flex-col gap-6 mt-8'>
      <h2>
        Your Interviews:
      </h2>
      <div className='interviews-section'>
        {hasPastInteriews ?(
          userInterviews?.map((interview)=>(
          <InterviewCard{...interview} key = {interview.id}/>
        ))):(
          <p>You haven&apos;t taken any interviews yet</p>
        )
        }
        
      
      
      </div>
    </section>

    <section className='flex flex-col gap-6 mt-8'>
      <h2>Take an Interview</h2>
      <div className='interviews-section'>
        {hasUpcomingInterviews ?(
          latestInterviews?.map((interview)=>(
          <InterviewCard{...interview} key = {interview.id}/>
        ))):(
          <p>No Interviews available yet!</p>
        )
        }
      </div>
    </section>
    </>
  )
}

export default page
