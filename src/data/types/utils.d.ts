/**
 * Standard result type for server actions
 * @template T - The type of data returned on success
 */
export type ActionResult<T = void> = {
   success: boolean;
   message: string;
   data?: T;
   /** When true, the client should display an upgrade CTA */
   upgradeRequired?: boolean;
};
