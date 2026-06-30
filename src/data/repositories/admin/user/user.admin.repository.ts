import { DbClient } from "@/data/types/db/common";
import {
   DAdminUserDetail,
   DAdminUserListItem,
   DAdminUsersPage,
   DAdminUsersPageQuery,
} from "@/data/types/domain/admin/admin";

export class AdminUserRepository {
   constructor(private readonly prisma: DbClient) {}

   async pGetUsersPage(query?: DAdminUsersPageQuery): Promise<DAdminUsersPage> {
      const pageNumber = query?.pagination?.pageNumber ?? 0;
      const pageSize = query?.pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = query?.filter?.search
         ? {
              OR: [
                 {
                    name: {
                       contains: query.filter.search,
                       mode: "insensitive",
                    },
                 },
                 {
                    email: {
                       contains: query.filter.search,
                       mode: "insensitive",
                    },
                 },
              ],
           }
         : {};

      const [users, totalElements] = await Promise.all([
         this.prisma.user.findMany({
            where,
            include: {
               subscription: { include: { plan: true } },
            },
            orderBy: { createdAt: "desc" as const },
            skip,
            take: pageSize,
         }),
         this.prisma.user.count({ where }),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content: DAdminUserListItem[] = (users as any[]).map((u) => ({
         id: u.id,
         name: u.name,
         email: u.email,
         role: u.role,
         emailVerified: u.emailVerified?.toISOString() ?? null,
         subscriptionTier: u.subscription?.plan?.tier ?? null,
         subscriptionStatus: u.subscription?.status ?? null,
         createdAt: u.createdAt.toISOString(),
      }));

      return {
         content,
         pageNumber,
         pageSize,
         numberOfElements: users.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements,
      };
   }

   async pGetUserDetail(userId: string): Promise<DAdminUserDetail | null> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const u: any = await this.prisma.user.findFirst({
         where: { id: userId },
         include: {
            subscription: { include: { plan: true } },
            subscriptionHistory: {
               orderBy: { createdAt: "desc" as const },
               take: 20,
            },
         },
      });

      if (!u) return null;

      // Build subscription domain object
      let subscription = null;
      if (u.subscription) {
         const s = u.subscription;
         subscription = {
            id: s.id,
            userId: s.userId,
            planId: s.planId,
            status: s.status,
            billingInterval: s.billingInterval,
            stripeSubscriptionId: s.stripeSubscriptionId,
            stripeCustomerId: s.stripeCustomerId,
            stripeCheckoutSessionId: s.stripeCheckoutSessionId,
            currentPeriodStart: s.currentPeriodStart?.toISOString() ?? null,
            currentPeriodEnd: s.currentPeriodEnd?.toISOString() ?? null,
            cancelAtPeriodEnd: s.cancelAtPeriodEnd,
            canceledAt: s.canceledAt?.toISOString() ?? null,
            createdAt: s.createdAt.toISOString(),
            updatedAt: s.updatedAt.toISOString(),
            plan: {
               id: s.plan.id,
               tier: s.plan.tier,
               name: s.plan.name,
               description: s.plan.description,
               monthlyPrice: Number(s.plan.monthlyPrice),
               yearlyPrice: Number(s.plan.yearlyPrice),
               stripePriceIdMonthly: s.plan.stripePriceIdMonthly,
               stripePriceIdYearly: s.plan.stripePriceIdYearly,
               stripeProductId: s.plan.stripeProductId,
               features: s.plan.features,
               isActive: s.plan.isActive,
               createdAt: s.plan.createdAt.toISOString(),
               updatedAt: s.plan.updatedAt.toISOString(),
            },
         };
      }

      return {
         id: u.id,
         name: u.name,
         email: u.email,
         role: u.role,
         emailVerified: u.emailVerified?.toISOString() ?? null,
         subscriptionTier: u.subscription?.plan?.tier ?? null,
         subscriptionStatus: u.subscription?.status ?? null,
         stripeCustomerId: u.stripeCustomerId,
         trialEndsAt: u.trialEndsAt?.toISOString() ?? null,
         createdAt: u.createdAt.toISOString(),
         updatedAt: u.updatedAt.toISOString(),
         subscription,
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         subscriptionHistory: u.subscriptionHistory.map((h: any) => ({
            id: h.id,
            eventType: h.eventType,
            fromTier: h.fromTier ?? null,
            toTier: h.toTier ?? null,
            fromStatus: h.fromStatus ?? null,
            toStatus: h.toStatus ?? null,
            stripeEventId: h.stripeEventId ?? null,
            createdAt: h.createdAt.toISOString(),
         })),
      };
   }

   async pUpdateUserRole(userId: string, role: string): Promise<void> {
      await this.prisma.user.update({
         where: { id: userId },
         data: { role },
      });
   }
}
