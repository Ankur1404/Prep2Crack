"use server"

import { db,auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const one_week = 60 * 60 * 24 * 7; 
export async function SignUp(params:SignUpParams)
{
  const{uid,name,email} = params;

  try{
    const userRecord = await db.collection("users").doc(uid).get();
    if(userRecord.exists) {
      return {
        success: false,
        message: "User already exists.Please SignIn instead."
      }
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    return{
      success: true,
      message: "Account created successfully. Please Sign In."
    }

  }catch(e:any)
  {
    console.error("Error creating a user:", e);
    if(e.code === 'auth/email-already-exists') 
    {
      return {
        success: false,
        message: "Email already exists. Please use a different email address."
      }
    }
      
    
  }
}

export async function SignIn(params:SignInParams)
{
  const{email,idToken} = params;
  try{
    const userRecord = await auth.getUserByEmail(email);
    if(!userRecord) {
      return {
        success: false,
        message: "User does not exist.Please SignUp instead."
      }
    }
    await setSesssionCookie(idToken);
  }catch(e:any)
  {
    console.error("Error signing in user:", e);
    if(e.code === 'auth/user-not-found') 
    {
      return {
        success: false,
        message: "User does not exist. Please SignUp instead."
      }
    }
    return {
      success: false,
      message: "An error occurred while signing in."
    }
  }
}

export async function setSesssionCookie(idtoken:string)
{
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idtoken,{expiresIn: one_week * 1000}); 
  
  cookieStore.set({
    name: "session",
    value: sessionCookie,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: one_week,
    path: "/",
    sameSite: "lax",
  })
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db.collection("users").doc(decodedClaims.uid).get();

    if (!userRecord.exists) return null;

    return {
      id: userRecord.id, // this is your Firebase Auth UID
      ...(userRecord.data() || {}), // spread other fields (name, email, etc.)
    } as User;
  } catch (error) {
    console.log(error);
    return null;
  }
}


export async function SignOut()
{
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return {
    success: true,
    message: "Signed out successfully."
  }
}

export async function isAuthenticated()
{
  const user = await getCurrentUser();
  return !!user;
}


