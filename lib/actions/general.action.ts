"use server"
import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
export async function getInterviewByUserId(
  userId: string
): Promise<Interview[] | null> {
  const snapshot = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  if (snapshot.empty) return null;

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Interview, "id">),
  }));
}

export async function getLatestInterviewByUserId(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const snapshot = await db
    .collection("interviews")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  if (snapshot.empty) return null;

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Interview, "id">),
  }));
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const snapshot = await db.collection("interviews").doc(id).get();

  if (!snapshot.exists) return null;

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Interview, "id">),
  };
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `-${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const {object:{totalScore,categoryScores,strengths,areasForImprovement,finalAssessment}} = await generateObject({
      model: google("gemini-2.0-flash-001", { 
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    // Check if feedback already exists for this interview
    const existingFeedback = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    let feedbackId: string;

    if (!existingFeedback.empty) {
      // Update existing feedback
      const feedbackDoc = existingFeedback.docs[0];
      await feedbackDoc.ref.update({
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
        updatedAt: new Date().toISOString(),
      });
      feedbackId = feedbackDoc.id;
    } else {
      // Create new feedback
      const feedback = await db.collection("feedback").add({
        interviewId,
        userId,
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
        createdAt: new Date().toISOString(),
      });
      feedbackId = feedback.id;
    }

    return {
      success: true,
      message: existingFeedback.empty ? "Feedback created successfully" : "Feedback updated successfully",
      feedbackId,
    };
  } catch (error) {
    console.error("Error creating/updating feedback:", error);
    return {
      success: false,
      message: "Error creating/updating feedback",
    };
  }
}


export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { userId,interviewId } = params;

  const feedback = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (feedback.empty) return null;

  const feedbackDoc = feedback.docs[0];
  return {
    id: feedbackDoc.id,
    ...(feedbackDoc.data() as Omit<Feedback, "id">),
  }as Feedback;

 
}
