"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import { toast } from "sonner";
import { CustomFormField } from '@/components/FormField';
import { useRouter } from "next/navigation";


type FormType = 'sign-in' | 'sign-up';
const AuthFormSchema = (type: FormType) => {
  
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(3),
  });
};

const Auth = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = AuthFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        // console.log('SIGN-UP', values);
        toast.success("You're in 🎯 Account created successfully");
        router.push('/sign-in')
      } else {
        // console.log('SIGN-IN', values);
        toast.success("Welcome back, [UserName]!")
        router.push('/');
      }
    } catch (error) {
      console.error(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === 'sign-in';

  return (
    <div className="card-border lg:m-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Prep2Crack</h2>
        </div>
        <h3>Get Interview-Ready with AI!</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4 form space-y-6">
            {!isSignIn && (
              <CustomFormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
              />
            )}

            <CustomFormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <CustomFormField
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

        <div className="text-sm text-center text-muted-foreground flex justify-center gap-1 mt-4">
          <span>{isSignIn ? 'No account yet?' : 'Already have an account?'}</span>
          <Link
            href={isSignIn ? '/sign-up' : '/sign-in'}
            className="text-primary font-semibold hover:underline"
          >
            {isSignIn ? 'Sign up' : 'Sign in'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
