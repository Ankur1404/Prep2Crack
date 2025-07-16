import Loader from '@/components/Loader';
import { Suspense } from 'react';
import { getCurrentUser } from "@/lib/actions/auth.action"
import { getInterviewById } from "@/lib/actions/general.action"
import { getFeedbackByInterviewId } from "@/lib/actions/general.action"
import { redirect } from "next/navigation"
import Image from "next/image"
import { getRandomInterviewCover } from "@/lib/utils"
import dayjs from "dayjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
interface RouteParams {
  params: {
    id: string
  }
}

const page = async ({ params }: RouteParams) => {
  const { id } = await params
  const user = await getCurrentUser()

  const interview = await getInterviewById(id)
  if (!interview) redirect("/")

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  })

  console.log("feedback", feedback)

  return (
    <div className="min-h-screen p-6 space-y-8">
      
      <div className="text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Feedback
        </h1>
        <div className="h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full max-w-md mx-auto"></div>
      </div>

    
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-3xl p-8 border border-slate-600/30">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={getRandomInterviewCover() || "/placeholder.svg"}
              alt="cover-image"
              width={80}
              height={80}
              className=" object-cover size-[80px] drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-4">{interview.role} Interview</h2>

            <div className="flex flex-wrap gap-4">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full px-6 py-3 flex items-center gap-3">
                <Image src="/star.svg" alt="score" width={20} height={20} />
                <span className="text-white font-semibold">Overall Score: {feedback?.totalScore}/100</span>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-6 py-3 flex items-center gap-3">
                <Image src="/calendar.svg" alt="calendar" height={20} width={20} />
                <span className="text-white font-medium">
                  {dayjs(feedback?.updatedAt || feedback?.createdAt).format("DD MMMM YYYY, hh:mm A")}
                  {feedback?.updatedAt && feedback?.updatedAt !== feedback?.createdAt && (
                    <span className="ml-2 text-xs opacity-75">(Updated)</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Assessment Card */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-3xl p-8 border border-slate-600/30">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-teal-500 rounded-full"></div>
          <h3 className="text-2xl font-bold text-white">Final Assessment</h3>
        </div>
        <p className="text-slate-200 text-lg leading-relaxed">
          {feedback?.finalAssessment || "You haven't received feedback yet."}
        </p>
      </div>

      {/* Evaluation Breakdown */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-3xl p-8 border border-slate-600/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-teal-500 rounded-full"></div>
          <h3 className="text-2xl font-bold text-white">Evaluation Breakdown</h3>
        </div>

        <div className="space-y-6">
          {feedback?.categoryScores.map((category, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-white">
                  {index + 1}. {category.name}
                </h4>
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full px-4 py-2">
                  <span className="text-white font-bold text-lg">{category.score}/100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${category.score}%` }}
                ></div>
              </div>

              <p className="text-slate-300 leading-relaxed pl-4 border-l-2 border-cyan-500/50">{category.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-3xl p-8 border border-slate-600/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">✓</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Strengths</h3>
          </div>

          <div className="space-y-4">
            {feedback?.strengths?.map((strength, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-200 leading-relaxed">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-3xl p-8 border border-slate-600/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">↗</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Areas for Improvement</h3>
          </div>

          <div className="space-y-4">
            {feedback?.areasForImprovement?.map((area, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-200 leading-relaxed">{area}</p>
              </div>
            ))}
          </div>
          
        </div>
        
      </div>
        <div className="buttons flex flex-row gap-4">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </div>
    
  )
}

export default function FeedbackPageWrapper(props: RouteParams) {
  return (
    <Suspense fallback={<Loader />}>
      {/* @ts-expect-error Async Server Component */}
      {page(props)}
    </Suspense>
  );
}
