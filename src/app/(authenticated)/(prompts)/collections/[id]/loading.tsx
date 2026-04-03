const CollectionLoading = () => {
   return (
      <div
         className="flex h-full flex-col bg-slate-50"
         data-testid="collection-loading"
      >
         <div className="border-b bg-white px-6 py-4">
            <div className="flex animate-pulse items-center gap-3">
               <div className="h-10 w-10 rounded-lg bg-slate-200" />
               <div className="space-y-2">
                  <div className="h-6 w-48 rounded bg-slate-200" />
                  <div className="h-4 w-32 rounded bg-slate-200" />
               </div>
            </div>
         </div>
         <div className="animate-pulse border-b bg-white px-6 py-3">
            <div className="flex gap-4">
               <div className="h-8 w-20 rounded bg-slate-200" />
               <div className="h-8 w-24 rounded bg-slate-200" />
            </div>
         </div>
         <div className="flex-1 p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
               {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                     key={i}
                     className="h-48 animate-pulse rounded-lg bg-slate-200"
                  />
               ))}
            </div>
         </div>
      </div>
   );
};

export default CollectionLoading;
