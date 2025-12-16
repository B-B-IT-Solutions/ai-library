import { prisma } from "../prisma";

export const pGetUserPurchases = async (userId: string) => {
   return await prisma.purchase.findMany({
      where: { userId },
      include: {
         template: {
            include: {
               categories: true,
            },
         },
         order: true,
      },
      orderBy: {
         createdAt: "desc",
      },
   });
};

export const pCheckUserHasTemplate = async (
   userId: string,
   templateId: string
) => {
   const purchase = await prisma.purchase.findUnique({
      where: {
         userId_templateId: {
            userId,
            templateId,
         },
      },
   });

   return purchase !== null;
};

export const pGetActiveUserSubscription = async (userId: string) => {
   return await prisma.subscription.findFirst({
      where: {
         userId,
         isActive: true,
         endDate: {
            gte: new Date(),
         },
      },
      orderBy: {
         endDate: "desc",
      },
   });
};

export const pCheckSubscriptionAccess = async (userId: string) => {
   const subscription = await pGetActiveUserSubscription(userId);
   return subscription !== null;
};

export const pCreateSubscription = async (
   userId: string,
   startDate: Date,
   endDate: Date
) => {
   return await prisma.subscription.create({
      data: {
         userId,
         startDate,
         endDate,
         isActive: true,
      },
   });
};

export const pCancelSubscription = async (subscriptionId: string) => {
   return await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { isActive: false },
   });
};
