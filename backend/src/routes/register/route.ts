import { NextResponse } from "next/server";

import { hash } from "bcryptjs";

import { Prisma } from "@prisma/client";

import { credentialsSchema } from "@backend/auth";

import { db } from "@backend/lib/db";

import { ApiError, clientRateKey, errorResponse, jsonBody, sameOrigin } from "@backend/lib/http";

import { rateLimit } from "@backend/lib/quota";
import { ROLE_USER } from "@backend/lib/roles";



export async function POST(req: Request) {

  try {

    sameOrigin(req);

    await rateLimit(`register:${clientRateKey(req)}`, 4);

    const parsed = credentialsSchema.safeParse(await jsonBody(req));

    if (!parsed.success)

      throw new ApiError("INVALID_INPUT", "Use a valid email and a password of 12–72 characters.");

    await db.user.create({

      data: {

        email: parsed.data.email.toLowerCase(),

        passwordHash: await hash(parsed.data.password, 12),

        role: ROLE_USER,

      },

    });

    return NextResponse.json({ ok: true }, { status: 201 });

  } catch (error) {

    if (

      error instanceof Prisma.PrismaClientKnownRequestError &&

      error.code === "P2002"

    )

      return errorResponse(

        new ApiError(

          "ACCOUNT_UNAVAILABLE",

          "Could not create this account. Try signing in or use another email.",

          409,

        ),

      );

    return errorResponse(error);

  }

}
