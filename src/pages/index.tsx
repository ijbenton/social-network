import type { GetServerSideProps, NextPage } from "next";
import { User } from "next-auth";
import Head from "next/head";

import Post from "../components/Post";
import Spinner from "../components/Spinner";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";

const Home: NextPage<{ user: User }> = ({ user }) => {
  const { data, isLoading } = trpc.useQuery(["post.posts"], {
    // staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
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

      <main className="container mx-auto mt-6 flex flex-auto flex-col gap-4">
        {user ? (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center flex-auto">
                <Spinner />
              </div>
            ) : (
              data?.map((post) => (
                <Post post={post} user={user} key={post.id} />
              ))
            )}
          </>
        ) : (
          <>
            <div className="text-3xl text-white font-semibold">
              Welcome to the Social Network.
            </div>
            <div className="text-base text-gray-100 font-medium">
              Please sign in to continue.
            </div>
          </>
        )}
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
