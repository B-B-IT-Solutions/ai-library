import { Page, PageQuery } from "../../common";

export type DAdminUsersPageQuery = PageQuery<DAdminUsersFilter>;
export type DAdminUsersPage = Page<DAdminUser>;

export type DAdminUsersFilter = {
   search?: string;
};

export type DAdminUser = {
   id: string;
   name: string;
   email: string;
   role: string;
   emailVerified?: string;
   subscriptionTier?: string;
   subscriptionStatus?: string;
   stripeCustomerId: string | null;
   trialEndsAt?: string;
   updatedAt: string;
   createdAt: string;
};
