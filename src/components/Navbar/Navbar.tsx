import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const session = useSession();
  const user = session?.data?.user;

  return (
    <nav className="container mx-auto flex items-center py-4">
      <Link href="/">
        <a className="flex text-xl font-medium text-white">Social Network</a>
      </Link>
      <ul className="flex items-center text-base ml-auto gap-6 text-slate-200">
        {user ? (
          <>
            <li>
              <Link href="/posts/new">
                <div className="cursor-pointer text-3xl font-medium text-gray-50 hover:text-gray-200">
                  +
                </div>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                data-testid="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <Image
                  className="h-8 w-8 rounded-full"
                  src={user.image ?? ""}
                  alt=""
                  height={32}
                  width={32}
                />
              </button>
            </li>
            <li
              onClick={() => signOut()}
              className="cursor-pointer font-medium text-gray-50 hover:text-gray-200"
            >
              Logout
            </li>
          </>
        ) : (
          <li onClick={() => signIn("auth0")} className="cursor-pointer">
            Login
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
