import { useRouter } from "next/router";
import React from "react";

import Spinner from "../../components/Spinner";
import { trpc } from "../../utils/trpc";

const SinglePost = () => {
  const router = useRouter();

  const postId = router.query.postId as string;

  const { data, isLoading } = trpc.useQuery(["post.single-post", { postId }], {
    staleTime: Infinity,
  });

  if (isLoading) return <Spinner />;

  return <div>SinglePost</div>;
};

export default SinglePost;
