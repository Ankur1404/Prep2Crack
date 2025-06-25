import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { isAuthenticated, getCurrentUser, SignOut } from "@/lib/actions/auth.action"
import { redirect } from "next/navigation"

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated()
  if (!isUserAuthenticated) redirect("/sign-in")

  const user = await getCurrentUser()

  return (
    <div className="root-layout min-h-screen">
      <nav className="shadow-sm border-b border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="Logo" width={70} height={70} className="rounded-full shadow-sm" />
            <h2 className="text-primary-100 text-xl font-semibold">Prep2Crack</h2>
          </Link>

          <div className="flex items-center gap-6">
            <p className="text-gray-300 font-medium">Hello, {user?.name?.split(" ")[0] || "User"}</p>
            <form
              action={async () => {
                "use server"
                await SignOut()
                redirect("/sign-in")
              }}
            >
              <button
                type="submit"
                className="text-red-400 bg-red-500/10 backdrop-blur-md rounded px-4 py-2 border border-red-800/30 hover:bg-red-500/20 cursor-pointer"
              >
                Logout
              </button>


            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}

export default RootLayout
