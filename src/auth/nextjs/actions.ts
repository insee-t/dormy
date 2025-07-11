"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createUserSession, removeUserFromSession } from "../core/session"
import { signInSchema, signUpSchema } from "./schemas"
import { db } from "@/drizzle/db"
import { eq } from "drizzle-orm"
import { OAuthProvider, UserTable } from "@/drizzle/schema"
import { comparePassword, hashPassword } from "../core/passwordHasher"
import { getOAuthClient } from "../core/oauth/base"

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
    const { success, data } = signInSchema.safeParse(unsafeData)

    if (!success) return "Unable to log you in"

    const user = await db.query.UserTable.findFirst({
        columns: { password: true, id: true, email: true, role:true },
        where: eq(UserTable.email, data.email),
    })

    if (user == null || user.password == null) {
        return "Unable to log you in"
    }

    console.log(data.password, user.password)
    const isPasswordCorrect = await comparePassword(data.password, user.password)

    console.log(isPasswordCorrect)

    if (!isPasswordCorrect) return "Incorrect user or password"

    await createUserSession(user, await cookies())

    if (user.role === "user") {
        redirect("/tenant/dashboard")
    } else {
        redirect("/")
    }
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
    const { success, data } = signUpSchema.safeParse(unsafeData)

    if (!success) return "Unable to create account"

    let redirectPath: string | null = null

    try {
        const existingUser = await db.query.UserTable.findFirst({
            where: eq(UserTable.email, data.email),
        })

        if (existingUser != null) return "Account already exists for this email"

        const hashedPassword = await hashPassword(data.password)

        console.log(hashedPassword)
        const [user] = await db
            .insert(UserTable)
            .values({
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: "admin",
            })
            .returning({ id: UserTable.id, role: UserTable.role })

        if (user == null) return  "Unable to create account"
        await createUserSession(user, await cookies())
        
        if (user.role === "user") {
            redirectPath = `/tenant/dashboard`
        } else {
            redirectPath = `/dashboard`
        }
    } catch (err) {
        redirectPath = `/`
        console.error('Err:', err)
        return  "Unable to create account"
    } finally {
        if (redirectPath)
            redirect(redirectPath)
    }
}

export async function logOut() {
    await removeUserFromSession(await cookies());
    redirect("/")
}

export async function oAuthSignIn(provider: OAuthProvider) {
    // Get OAUTH url
    const oAuthClient = getOAuthClient(provider)

    redirect(oAuthClient.createAuthUrl(await cookies()))
}
