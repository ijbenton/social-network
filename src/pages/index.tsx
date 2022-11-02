import values from "lodash.values";
import { customAlphabet } from "nanoid";
import type { GetServerSideProps, NextPage } from "next";
import { User } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Post from "../components/Post";
import Spinner from "../components/Spinner";
import { setPosts } from "../redux/slice/postSlice";
import { RootState } from "../redux/store";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 4);

const Home: NextPage<{ user: User }> = ({ user }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const postsArr = useMemo(() => values(posts), [posts]);
  const { isLoading } = trpc.useQuery(["post.posts"], {
    // staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess(data) {
      dispatch(setPosts(data));
    },
  });

  const createRoom = () => {
    const roomId = nanoid();

    router.push(`/rooms/${roomId}`);
  };
  return (
    <>
      <Head>
        <title>Social Network</title>
        <meta name="description" content="modern full-stack social network app" />
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
              postsArr?.map((post) => <Post post={post} user={user} key={post.id} />)
            )}
            <button type="button" onClick={createRoom}>
              Create Chat Room
            </button>
          </>
        ) : (
          <>
            <div className="text-3xl text-white font-semibold">Welcome to the Social Network.</div>
            <div className="text-base text-gray-100 font-medium">Please sign in to continue.</div>
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
