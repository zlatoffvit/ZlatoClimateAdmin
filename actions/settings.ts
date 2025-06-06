"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import prismadb from "@/lib/prismadb";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";


export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email as string);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" }
    }

    const verificationToken = await generateVerificationToken(values.email as string, user.id);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent"}
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password as string,
      dbUser.password
    );

    if (!passwordMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(
      values.newPassword as string,
      10,
    );
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await prismadb.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    }
  });

  return { success: "Settings Updated!" }
}