/**
 * Standard result type for server actions
 * @template T - The type of data returned on success
 */
export type ActionResult<T = void> = {
   success: boolean;
   message: string;
   data?: T;
};
