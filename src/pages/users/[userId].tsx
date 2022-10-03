import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

import Spinner from "../../components/Spinner";
import { trpc } from "../../utils/trpc";

const UserPage = () => {
  const router = useRouter();

  const userId = router.query.userId as string;

  const { data, isLoading } = trpc.useQuery(["user.single-user", { userId }], {
    staleTime: Infinity,
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1>{data?.name}</h1>
      <Image
        className="h-8 w-8 rounded-full"
        src={data?.image ?? ""}
        alt=""
        height={32}
        width={32}
      />
    </div>
  );
};

export default UserPage;
