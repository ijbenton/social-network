import type { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { getSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";

const Home: NextPage<{ session: Session }> = (props) => {
  // const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);
  // const hello = trpc.useQuery(["posts.get-all-posts"]);
  console.log("PROPS.session", props);
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

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        {/* TODO: Show posts */}
        {props.user ? (
          <button onClick={() => signOut()}>Sign out</button>
        ) : (
          <button onClick={() => signIn("auth0")}>Sign in</button>
        )}
        {/* {session && (
          <div>
            <p>Signed in as {session.user?.email}</p>
            <p>Name {session.user?.name}</p>
            <Image
              width={200}
              height={200}
              src={session.user?.image ?? ""}
              alt={session.user?.name ?? ""}
            />
          </div>
        )} */}
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    console.log("NO SSR SESSION");
    return { props: { hello: "idk" } };
  } else {
    console.log("ssr session", {
      props: {
        session,
      },
    });
    return {
      props: {
        ...session,
      },
    };
  }
};
