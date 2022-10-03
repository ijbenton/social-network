import * as trpc from "@trpc/server";

import { getSingleUserSchema } from "../schema/user.schema";
import { createRouter } from "./context";

export const userRouter = createRouter().query("single-user", {
  input: getSingleUserSchema,
  resolve({ input, ctx }) {
    return ctx.prisma.user.findUnique({
      where: { id: input.userId },
      include: { posts: true },
    });
  },
});
