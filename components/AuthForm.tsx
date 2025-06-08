"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import Image from "next/image"
import FormField from "@/components/FormField" 
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { SignIn, SignUp } from "@/lib/actions/auth.action"


const AuthFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3, "Name is required") : z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const Router = useRouter()
  const formSchema = AuthFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const isSignIn = type === "sign-in"

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const result = await SignUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        })

        if(!result?.success) {
          toast.error(result?.message || "An error occurred while creating your account.")
          return;
        }
        toast.success("Account created successfully!,Please Sign In")
        Router.push("/sign-in")
      } else {
        const { email, password } = values
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredentials.user.getIdToken();
        if(!idToken)
          {
          toast.error("Failed to retrieve ID token. Please try again.")
          return;
          }
          await SignIn({
            email, idToken
          })
        toast.success("Signed in successfully!")
        Router.push("/")
      }
    } catch (error) {
      console.error(error)
      toast.error(`there was an error `)
    }
  }

  return (
    
    <div className="card-border lg:min-w-[566px] w-full max-w-sm mx-auto">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="Logo" width={30} height={34} />
          <h2 className="text-primary-100">Prep2Crack</h2>
        </div>

        <h3 className = "text-center">Master Interviews Before the Real One</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full mt-4 form">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? 'Sign in' : 'Create an Account'}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? 'No account yet?' : 'Have an account already?'}
          <Link href={isSignIn ? '/sign-up' : '/sign-in'} className="font-bold text-user-primary ml-1">
            {isSignIn ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
