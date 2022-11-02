import { ErrorMessage, Field, Form, Formik } from "formik";
import { GetServerSideProps } from "next";
import { Session, User } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import * as Yup from "yup";

import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { Message } from "../../server/schema/chat.schema";
import { trpc } from "../../utils/trpc";

const MessageItem = ({ message, user }: { message: Message; user: User }) => {
  const baseStyles =
    "mb-4 text-md w-7/12 p-4 text-gray-700 border border-gray-700 rounded-md bg-slate-200";

  const liStyles =
    message.sender.name === user?.name
      ? baseStyles.concat(" self-end bg-slate-700 text-slate-100")
      : baseStyles;
  return (
    <li className={liStyles}>
      <div className="flex">
        <time>
          {message.sentAt.toLocaleTimeString("en-US", {
            timeStyle: "short",
          })}{" "}
          - {message.sender.name}
        </time>
      </div>
      {message.message}
    </li>
  );
};

const RoomPage = ({ user }: { user: User }) => {
  const { query } = useRouter();
  const roomId = query.roomId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const { mutateAsync: sendMessageMutation } = trpc.useMutation([
    "chat.send-message",
  ]);
  trpc.useSubscription(["chat.onSendMessage", { roomId }], {
    onNext: (message) => {
      setMessages((prevState) => [...prevState, message]);
    },
  });
  return (
    <div className="container mx-auto mt-6 flex flex-auto flex-col gap-4">
      <div className="flex-1">
        <ul className="flex flex-col">
          {messages.map((m) => {
            return <MessageItem key={m.id} message={m} user={user} />;
          })}
        </ul>
      </div>
      <Formik
        initialValues={{ message: "" }}
        isInitialValid={false}
        validationSchema={Yup.object().shape({
          message: Yup.string().required("Please enter a body"),
        })}
        onSubmit={(values, helpers) => {
          sendMessageMutation({
            roomId,
            message: values.message,
          });

          helpers.resetForm();
        }}
      >
        {({ isValid }) => (
          <Form className="flex gap-2 mb-4">
            <Field
              as="textarea"
              name="message"
              placeholder="What do you want to say?"
              className="black p-2.5 w-10/12 text-gray-700 bg-gray-50 rounded-md border border-gray-700"
            />
            <button
              type="submit"
              disabled={!isValid}
              className={`flex-1 text-slate-100 bg-cyan-900 p-2.5 w-2/12 rounded-md ${
                !isValid ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Send Message
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RoomPage;

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
