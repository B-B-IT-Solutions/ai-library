import { DbClient } from "@/data/types/db/common";
import {
   DAdminSubscriptionListItem,
   DAdminSubscriptionsPage,
   DAdminSubscriptionsPageQuery,
} from "@/data/types/domain/admin";

export class AdminSubscriptionRepository {
   constructor(private readonly prisma: DbClient) {}

   async pGetSubscriptionsPage(
      query?: DAdminSubscriptionsPageQuery
   ): Promise<DAdminSubscriptionsPage> {
      const pageNumber = query?.pagination?.pageNumber ?? 0;
      const pageSize = query?.pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {};
      if (query?.status) where.status = query.status;
      if (query?.tier) {
         where.plan = { tier: query.tier };
      }

      const [subscriptions, totalElements] = await Promise.all([
         this.prisma.subscription.findMany({
            where,
            include: {
               user: { select: { email: true, name: true } },
               plan: { select: { tier: true, name: true } },
            },
            orderBy: { createdAt: "desc" as const },
            skip,
            take: pageSize,
         }),
         this.prisma.subscription.count({ where }),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content: DAdminSubscriptionListItem[] = (subscriptions as any[]).map((s) => ({
         id: s.id,
         userId: s.userId,
         userEmail: s.user.email,
         userName: s.user.name,
         planTier: s.plan.tier,
         planName: s.plan.name,
         billingInterval: s.billingInterval,
         status: s.status,
         currentPeriodEnd: s.currentPeriodEnd?.toISOString() ?? null,
         cancelAtPeriodEnd: s.cancelAtPeriodEnd,
         createdAt: s.createdAt.toISOString(),
      }));

      return {
         content,
         pageNumber,
         pageSize,
         numberOfElements: subscriptions.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements,
      };
   }
}
