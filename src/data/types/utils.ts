/**
 * Standard result type for server actions
 * @template T - The type of data returned on success
 */
export type ActionResult<T = void> = {
   /** Whether the action completed successfully */
   success: boolean;
   /** Human-readable message describing the result */
   message: string;
   /** Optional data payload (only present on success) */
   data?: T;
};
