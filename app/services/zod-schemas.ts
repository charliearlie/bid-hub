import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5mb

export const FileSchema = z.any().refine((file) => {
  return !file || file?.size <= MAX_FILE_SIZE;
}, `Max file size is 5MB.`);

export const AddressFieldsetSchema = z.object({
  addressLine1: z.string().min(3).max(100),
  addressLine2: z.string().max(100).optional(),
  addressLine3: z.string().max(100).optional(),
  cityOrTown: z.string().max(100),
  name: z.string().max(100),
  postcode: z.string().max(10),
  id: z.string().optional(),
});

export const PersonalDetailsFieldsetSchema = z.object({
  firstName: z.string().min(2).max(24).optional(),
  lastName: z.string().min(2).max(24).optional(),
  phoneNumber: z.string().max(15).optional(),
});

export const UserSchema = z.object({
  email: z.string().email(),
  personalDetails: PersonalDetailsFieldsetSchema,
  addresses: z.array(AddressFieldsetSchema),
});

export const UserUsernameFieldSchema = z.string({
  required_error: "Username is required",
})
.min(3, "Username must be at least 3 characters")
.refine((username) => !/\s/.test(username), {
  message: "Username must not contain spaces",
});
