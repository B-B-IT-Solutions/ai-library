import { ListViewToggle } from "@/components/shared/buttons";
import { DListViewMode } from "@/data/types/domain/common";
import { DPromptDescriptorsFilter } from "@/data/types/domain/prompt";

type Props = {
   viewMode: DListViewMode;
   filters: DPromptDescriptorsFilter;
   categories: string[];
   models: string[];
};

export const PromptsToolbar = ({
   viewMode,
   filters,
   categories,
   models,
}: Props) => {
   // const { data } = useInfiniteLoadLibraryEntries({
   //    filters,
   // });

   // const totalEntries = useMemo(() => {
   //    if (!data?.pages) return 0;
   //    const firstPage = data.pages[0];
   //    return firstPage?.totalEntries || 0;
   // }, [data]);

   const totalEntries = 1;

   return (
      <div
         className="flex items-center justify-between border-b bg-white px-6 py-3"
         data-testid="prompts-toolbar"
      >
         <div className="flex items-center gap-4">
            <ListViewToggle currentView={viewMode} />
         </div>

         <span className="text-sm text-slate-600">
            {totalEntries} {totalEntries === 1 ? "Prompt" : "Prompts"}
         </span>
      </div>
   );
};
