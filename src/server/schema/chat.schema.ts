import { z } from "zod";

export const createConversationSchema = z.object({
  participantIds: z.string().array(),
});

export const sendMessageSchema = z.object({
  body: z.string(),
  conversationId: z.string(),
});

// export const messageSubSchema = z.object({
//   roomId: z.string(),
// });
