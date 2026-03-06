import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getWebhookSecret, stripe } from "@/lib/stripe/stripe-server";

import { handleStripeEvent } from "./stripe.event.handler";

export const POST = async (req: NextRequest) => {
   const body = await req.text();
   const headersList = await headers();
   const signature = headersList.get("stripe-signature");

   if (!signature) {
      return NextResponse.json(
         { error: "No signature provided" },
         { status: 400 }
      );
   }

   try {
      const event = stripe.webhooks.constructEvent(
         body,
         signature,
         getWebhookSecret()
      );
      return handleStripeEvent(event);
   } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
   }
};
