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
   };
   legal_notices: LegalNotice[];
   proofs: Proof[];
   ip_address?: string;
   timestamp: string;
};

export type LegalNoticesAcceptedParams = {
   user: DUser;
   acceptedAt: Date;
   ipAddress?: string;
};
