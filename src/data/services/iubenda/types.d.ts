import { DUser } from "@/data/types/domain/user";

export type LegalNotice = {
   identifier: string;
};

export type Proof = {
   content: string;
   form: string;
};

export type IubendaConsentPayload = {
   subject: {
      id: string;
      email: string;
      full_name: string;
      ip_address?: string;
   };
   legal_notices: LegalNotice[];
   proofs: Proof[];
   timestamp: string;
};

export type LegalNoticesAcceptedParams = {
   user: DUser;
   acceptedAt: Date;
   ipAddress?: string;
};
