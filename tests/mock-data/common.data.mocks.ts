type MediaQueryFn = (query: string) => MediaQueryList;

export const createMatchMedia = (matches: boolean): MediaQueryFn => {
   return () => {
      return {
         matches,
         addEventListener: () => {},
         removeEventListener: () => {},
         addListener: () => {},
         removeListener: () => {},
      } as unknown as MediaQueryList;
   };
};
