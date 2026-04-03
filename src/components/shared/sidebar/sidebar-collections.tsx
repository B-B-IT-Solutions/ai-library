"use client";

import { FC, useState } from "react";
import { ChevronDown, ChevronRight, Folder, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/shadcn/sidebar";
import { LibraryCollectionCreateDialog } from "@/components/collections";
import { useLoadLibraryCollections } from "@/data/ts-queries/library";
import { cn } from "@/lib/utils";

export const SidebarCollections: FC = () => {
   const { open } = useSidebar();
   const pathname = usePathname();
   const [showCreate, setShowCreate] = useState(false);
   const [expanded, setExpanded] = useState(true);

   const { data: collections = [] } = useLoadLibraryCollections();

   const isActive = (id: string) => pathname === `/collections/${id}`;

   if (!open) {
      return null;
   }

   return (
      <>
         <SidebarGroup data-testid="group-collections">
            <SidebarGroupLabel asChild>
               <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setExpanded((v) => !v)}
               >
                  <span>Sammlungen</span>
                  <div className="flex items-center gap-1">
                     <span
                        className="flex h-5 w-5 items-center justify-center rounded hover:bg-slate-200"
                        role="button"
                        onClick={(e) => {
                           e.stopPropagation();
                           setShowCreate(true);
                        }}
                        data-testid="create-collection-sidebar-btn"
                        title="Neue Sammlung"
                     >
                        <Plus className="h-3.5 w-3.5" />
                     </span>
                     {expanded ? (
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                     ) : (
                        <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                     )}
                  </div>
               </button>
            </SidebarGroupLabel>

            {expanded && (
               <SidebarGroupContent>
                  <SidebarMenu>
                     {collections.length === 0 ? (
                        <li className="px-3 py-2 text-xs text-slate-400">
                           Keine Sammlungen vorhanden
                        </li>
                     ) : (
                        collections.map((collection) => {
                           const active = isActive(collection.id);
                           const color = collection.color ?? "#64748b";
                           return (
                              <SidebarMenuItem key={collection.id}>
                                 <SidebarMenuButton
                                    asChild
                                    isActive={active}
                                    data-testid={`collection-nav-${collection.id}`}
                                 >
                                    <Link
                                       href={`/collections/${collection.id}`}
                                       className="flex items-center gap-2"
                                    >
                                       <Folder
                                          className="h-4 w-4 shrink-0"
                                          style={{ color }}
                                       />
                                       <span className="flex-1 truncate text-sm">
                                          {collection.name}
                                       </span>
                                       {collection.templateCount > 0 && (
                                          <span className="shrink-0 text-xs text-slate-400">
                                             {collection.templateCount}
                                          </span>
                                       )}
                                    </Link>
                                 </SidebarMenuButton>
                              </SidebarMenuItem>
                           );
                        })
                     )}
                  </SidebarMenu>
               </SidebarGroupContent>
            )}
         </SidebarGroup>

         <LibraryCollectionCreateDialog
            open={showCreate}
            onOpenChange={setShowCreate}
         />
      </>
   );
};
