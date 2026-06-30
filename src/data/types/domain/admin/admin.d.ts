import { Page, PageQuery } from "../../common";

export type DAdminUsersPageQuery = PageQuery<DAdminUsersFilter>;
export type DAdminUsersPage = Page<DAdminUserListItem>;

export type DAdminUsersFilter = {
   search?: string;
};

export type DAdminUserListItem = {
   id: string;
   name: string;
   email: string;
   role: string;
   emailVerified: string | null;
   subscriptionTier: string | null;
   subscriptionStatus: string | null;
   createdAt: string;
};

export type DAdminUserDetail = DAdminUserListItem & {
   stripeCustomerId: string | null;
   trialEndsAt: string | null;
   updatedAt: string;
};

export type DAdminSubscriptionHistoryItem = {
   id: string;
   eventType: string;
   fromTier: string | null;
   toTier: string | null;
   fromStatus: string | null;
   toStatus: string | null;
   stripeEventId: string | null;
   createdAt: string;
};

export type DAdminSubscriptionListItem = {
   id: string;
   userId: string;
   userEmail: string;
   userName: string;
   planTier: string;
   planName: string;
   billingInterval: string;
   status: string;
   currentPeriodEnd: string | null;
   cancelAtPeriodEnd: boolean;
   createdAt: string;
};

export type DAdminSubscriptionsPage = {
   content: DAdminSubscriptionListItem[];
   pageNumber: number;
   pageSize: number;
   totalElements: number;
   totalPages: number;
   numberOfElements: number;
};

export type DAdminSubscriptionsPageQuery = {
   pagination?: { pageNumber: number; pageSize: number };
   tier?: string;
   status?: string;
};

export type DSubscriptionPlanUpdate = {
   name: string;
   description: string;
   monthlyPrice: number;
   yearlyPrice: number;
   isActive: boolean;
};
