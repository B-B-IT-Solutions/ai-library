import z from "zod";

import { checkoutSchema } from "@/data/types/validators/checkout.schema";

export type DCheckoutForm = z.infer<typeof checkoutSchema>;
