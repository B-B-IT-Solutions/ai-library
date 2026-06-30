import { Page, PageQuery } from "@/data/types/common";
import { DUserRole } from "@/data/types/domain/user";

export type DAdminUsersPageQuery = PageQuery<DAdminUsersFilter>;
export type DAdminUsersPage = Page<DAdminUser>;

export type DAdminUsersFilter = {
   search?: string;
};

export type DAdminUser = {
   id: string;
   name: string;
   email: string;
   role: DUserRole;
   emailVerified?: string;
   subscriptionTier?: string;
   subscriptionStatus?: string;
   stripeCustomerId: string | null;
   trialEndsAt?: string;
   updatedAt: string;
   createdAt: string;
};
