import { ErrorMessage, Field, Form, Formik } from "formik";
import { GetServerSideProps, NextPage } from "next";
import { User } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import * as Yup from "yup";

import Spinner from "../../components/Spinner";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";

const NewPost: NextPage<{ user: User }> = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { mutate, error } = trpc.useMutation("post.create-post", {
    onSuccess({ id }) {
      router.push(`/posts/${id}`);
      setLoading(false);
    },
    onError({ message }) {
      alert(message);
      setLoading(false);
    },
  });

  return (
    <main className="container mx-auto flex flex-auto flex-col justify-center">
      <div className="text-white text-2xl font-medium px-12 mb-4">
        Create post
      </div>
      <Formik
        initialValues={{ title: "", body: "" }}
        isInitialValid={false}
        validationSchema={Yup.object().shape({
          title: Yup.string()
            .max(256, "Max title length is 256")
            .required("Please enter a title"),
          body: Yup.string()
            .min(10, "Body must be at least 10 characters")
            .required("Please enter a body"),
        })}
        onSubmit={(values) => {
          setLoading(true);
          mutate(values);
        }}
      >
        {({ isValid }) => (
          <Form className="flex flex-col w-full gap-4 px-12">
            <Field
              type="text"
              name="title"
              placeholder="Title"
              className="px-4 py-2"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-rose-500"
            />
            <Field
              as="textarea"
              name="body"
              placeholder="Body"
              className="px-4 py-2"
            />
            <ErrorMessage
              name="body"
              component="div"
              className="text-rose-500"
            />
            <button
              type="submit"
              disabled={loading || !isValid}
              className={`flex justify-center items-center bg-cyan-800 text-white text-xl rounded px-4 py-2 ${
                loading || !isValid ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loading ? <Spinner /> : "Post"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default NewPost;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  const user = session?.user;

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};
