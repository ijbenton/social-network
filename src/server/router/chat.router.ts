import * as trpc from "@trpc/server";

import { Events } from "../../constants/events";
import { sendMessageSchema } from "../schema/chat.schema";
import { createRouter } from "./context";

export const chatRouter = createRouter()
  .mutation("send-message", {
    input: sendMessageSchema,
    async resolve({ ctx, input }) {
      if (!ctx.session || !ctx.session.user) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a post while logged out",
        });
      }

      const message = await ctx.prisma.message.create({
        data: {
          body: input.body,
          sender: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          recipient: {
            connect: {
              id: input.recipientId,
            },
          },
        },
      });

      // const message: Message = {
      //   ...input,
      //   id: randomUUID(),
      //   sentAt: new Date(),
      //   sender: {
      //     name: ctx.session?.user?.name ?? "unknown",
      //   },
      // };

      ctx.ee.emit(Events.SEND_MESSAGE, message);
      return true;
    },
  })
  .subscription("onSendMessage", {
    // input: {},
    resolve({ ctx, input }) {
      return new trpc.Subscription((emit) => {
        function onMessage(data) {
          // if (input.roomId === data.roomId) {
          emit.data(data);
          // }
        }

        ctx.ee.on(Events.SEND_MESSAGE, onMessage);

        return () => {
          ctx.ee.off(Events.SEND_MESSAGE, onMessage);
        };
      });
    },
  });
