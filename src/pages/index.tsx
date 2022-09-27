import type { GetServerSideProps, NextPage } from "next";
import { User } from "next-auth";
import Head from "next/head";
import Link from "next/link";

import { getServerAuthSession } from "../server/common/get-server-auth-session";

// import { trpc } from "../utils/trpc";

const Home: NextPage<{ user: User }> = ({ user }) => {
  // const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);
  // const hello = trpc.useQuery(["posts.get-all-posts"]);
  return (
    <>
      <Head>
        <title>Social Network</title>
        <meta
          name="description"
          content="modern full-stack social network app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-auto flex-col items-center justify-center">
        <div className="text-3xl text-white font-semibold mb-4">
          Welcome to the Social Network.
        </div>
        <div className="text-base text-gray-100 font-medium">
          {user ? (
            <Link href="/dashboard">
              <button className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            "Please sign in to continue."
          )}
        </div>
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  const user = session?.user;

  if (!user)
    return {
      props: {},
    };

  return {
    props: {
      user,
    },
  };
};
