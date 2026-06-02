import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createUrlSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL (e.g. https://example.com)"),
  isProtected: z.boolean().default(false),
  authorizedEmails: z.array(z.string().email("Invalid email address")).default([]),
  expiresAt: z.string().nullable().optional(),
  maxClicks: z.number().nullable().optional(),
  selfDestruct: z.boolean().default(false),
  password: z.string().nullable().optional(),
  customCode: z.string().optional(),
  shortCode: z.string().optional(),
});

export const requestAccessSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUrlInput = z.infer<typeof createUrlSchema>;
export type RequestAccessInput = z.infer<typeof requestAccessSchema>;
