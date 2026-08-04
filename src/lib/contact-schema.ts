import { z } from "zod";

export const contactTopics = [
  "General enquiry",
  "Order enquiry",
  "Stockist or wholesale",
  "Something else",
] as const;

/** Shared by the client form and the server action — validation never lives only on the client. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email address").max(254),
  topic: z.enum(contactTopics),
  message: z
    .string()
    .trim()
    .min(10, "Please give us a little more detail")
    .max(2000, "Please keep this under 2000 characters"),
  /** Hidden field. Real people leave it empty; bots fill it in. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
