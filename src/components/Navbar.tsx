import { signIn, signOut, useSession } from "next-auth/react";
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
      <ul className="flex items-center text-base ml-auto gap-4 text-slate-200">
        {user ? (
          <>
            <li>{user.email}</li>
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
