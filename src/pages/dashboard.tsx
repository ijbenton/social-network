import { GetServerSideProps, NextPage } from "next";
import React from "react";

import { getServerAuthSession } from "../server/common/get-server-auth-session";

const Dashboard: NextPage = () => {
  return <div>Dashboard</div>;
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
