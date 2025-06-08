import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { isAuthenticated, getCurrentUser, SignOut } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser(); 

  return (
    <div className="root-layout">
      <nav className="flex justify-between items-center px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">Prep2Crack</h2>
        </Link>

        <div className="flex items-center gap-4">
          <p className="text-gray-700">Hello, {user?.name?.split(" ")[0] || "User"}</p>
          <form
            action={async () => {
              "use server";
              await SignOut();
              redirect("/sign-in");
            }}
          >
            <button type="submit" className="text-red-500 hover:underline">
              Logout
            </button>
          </form>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default RootLayout;
