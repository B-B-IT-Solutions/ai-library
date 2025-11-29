import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   useInfiniteQuery,
   UseInfiniteQueryResult,
} from "@tanstack/react-query";

export const infiniteLoadContactNotesOptions =
   (): UndefinedInitialDataInfiniteOptions<
      DNotesPage,
      Error,
      InfiniteData<DNotesPage>,
      QueryKey,
      number
   > => {
      const { contactId, filter, sort } = props;
      return {
         queryKey: notesKeys.contactNotesInfinite(contactId, filter, sort),
         queryFn: ({ pageParam }) => {
            const query: DNotesPageQuery = pageQuery2(
               pageParam,
               7,
               filter,
               sort
            );
            return loadContactNotes(contactId, query);
         },
         initialPageParam: 0,
         getNextPageParam: getNextPageParam,
         staleTime: 5 * 60 * 1000,
      };
   };

export const useInfiniteLoadContactNotes = (): UseInfiniteQueryResult<
   InfiniteData<DNotesPage>,
   Error
> => {
   const options = infiniteLoadContactNotesOptions();
   return useInfiniteQuery(options);
};
