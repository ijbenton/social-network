import * as trpc from "@trpc/server";

import { createRouter } from "./context";

export const chatRouter = createRouter().query("send-message", {
  resolve({ input, ctx }) {
    return {};
  },
});
