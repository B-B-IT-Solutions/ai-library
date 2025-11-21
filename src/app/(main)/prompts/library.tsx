"use client";

import { useState, FC } from "react";
import {
   Search,
   Plus,
   Edit2,
   Clock,
   Tag,
   Filter,
   ChevronDown,
   ChevronRight,
   Save,
   X,
   Copy,
   Check,
   Star,
} from "lucide-react";
import { TemplateSelector } from "./template/template-selector";
import { DPrompt, DPromptCreate, DPromptTemplate } from "@/data/domain/prompt";
import { createPrompt } from "@/lib/actions/prompt/prompt.actions";

const AI_MODELS = [
   "Claude Sonnet 4.5",
   "Claude Opus 4",
   "GPT-4",
   "GPT-4 Turbo",
   "GPT-3.5",
   "Gemini Pro",
   "Gemini Ultra",
   "Llama 3",
   "Mistral Large",
   "Other",
];

type PromptManagerProps = {
   prompts: DPrompt[];
};

const PromptManager: FC<PromptManagerProps> = ({ prompts }) => {
   const [categories, setCategories] = useState([]);
   const [selectedPrompt, setSelectedPrompt] = useState<DPrompt | null>(null);
   const [isEditing, setIsEditing] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("all");
   const [expandedVersions, setExpandedVersions] = useState({});

   const [conentExpanded, setContentExpanded] = useState(false);
   const [followUpsExpanded, setFollowupsExpaned] = useState(false);
   const [copiedItem, setCopiedItem] = useState<string | null>(null);

   const [formData, setFormData] = useState<DPromptCreate>({
      title: "",
      content: "",
      categories: [],
      recommendedModel: "",
      followUpPrompts: [],
   });

   const addNewPrompt = () => {
      if (!formData.title || !formData.content) {
         return;
      }
      const newPrompt: DPromptCreate = {
         title: formData.title,
         content: formData.content,
         categories: formData.categories,
         recommendedModel: formData.recommendedModel,
         followUpPrompts: formData.followUpPrompts,
      };

      createPrompt(newPrompt);

      resetForm();
   };

   const updatePrompt = () => {
      if (!selectedPrompt || !formData.content) {
         return;
      }

      const updatedPrompts = prompts.map((p) => {
         if (p.id === selectedPrompt.id) {
            const newVersion = {
               version: p.currentVersion + 1,
               content: formData.content,
               createdAt: new Date().toISOString(),
            };

            return {
               ...p,
               title: formData.title,
               categories: formData.categories,
               recommendedModel: formData.recommendedModel,
               followUpPrompts: formData.followUpPrompts,
               updatedAt: new Date().toISOString(),
               currentVersion: p.currentVersion + 1,
               versions: [...p.versions, newVersion],
            };
         }
         return p;
      });

      const newCats = [...new Set([...categories, ...formData.categories])];
      setCategories(newCats);

      const updated = updatedPrompts.find((p) => p.id === selectedPrompt.id);
      setSelectedPrompt(updated);
      setIsEditing(false);
   };

   const selectPrompt = (prompt) => {
      setSelectedPrompt(prompt);
      setIsEditing(false);
   };

   const startEdit = () => {
      if (!selectedPrompt) {
         return;
      }
      setFormData({
         title: selectedPrompt.title,
         content: selectedPrompt.content,
         categories: selectedPrompt.categories,
         recommendedModel: selectedPrompt.recommendedModel || "",
         followUpPrompts: selectedPrompt.followUpPrompts || [],
      });
      setIsEditing(true);
   };

   const resetForm = () => {
      setFormData({
         title: "",
         content: "",
         categories: [],
         recommendedModel: "",
         followUpPrompts: [],
      });
      setIsEditing(false);
      setSelectedPrompt(null);
   };

   const loadTemplate = (template: DPromptTemplate) => {
      setFormData({
         title: template.title,
         content: template.content,
         categories: [...template.categories],
         recommendedModel: template.recommendedModel || "",
         followUpPrompts: template.followUpPrompts || [],
      });
   };

   const addFollowUpPrompt = () => {
      const input = document.getElementById("newFollowUp");
      if (input && input.value.trim()) {
         setFormData((prev) => ({
            ...prev,
            followUpPrompts: [...prev.followUpPrompts, input.value.trim()],
         }));
         input.value = "";
      }
   };

   const removeFollowUpPrompt = (index: number) => {
      setFormData((prev) => ({
         ...prev,
         followUpPrompts: prev.followUpPrompts.filter((_, i) => i !== index),
      }));
   };

   const copyToClipboard = async (text: string, itemId: string) => {
      try {
         await navigator.clipboard.writeText(text);
         setCopiedItem(itemId);
         setTimeout(() => setCopiedItem(null), 2000);
      } catch (error) {
         console.error("Failed to copy:", error);
      }
   };

   const toggleVersionExpand = (promptId: string) => {
      setExpandedVersions((prev) => ({
         ...prev,
         [promptId]: !prev[promptId],
      }));
   };

   const addCategory = (cat: string) => {
      if (cat && !formData.categories.includes(cat)) {
         setFormData((prev) => ({
            ...prev,
            categories: [...prev.categories, cat],
         }));
      }
   };

   const removeCategory = (cat: string) => {
      setFormData((prev) => ({
         ...prev,
         categories: prev.categories.filter((c) => c !== cat),
      }));
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   return (
      <div
         className="min-h-screen bg-slate-50 text-slate-900 flex"
         data-testid="prompt-manager"
      >
         {/* Left Sidebar Navigation */}

         {/* Main Content Area */}
         <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
               <header className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                     All Prompts
                  </h2>
                  <p className="text-slate-600">
                     Create, version, and organize your AI prompts
                  </p>
               </header>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-4">
                     {/* Search and Filter */}
                     <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                        <div className="relative mb-4">
                           <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                           <input
                              type="text"
                              placeholder="Search prompts..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="flex items-center text-sm text-slate-600 mb-2 font-medium">
                              <Filter className="w-4 h-4 mr-2" />
                              Filter by Category
                           </label>
                           <select
                              value={selectedCategory}
                              onChange={(e) =>
                                 setSelectedCategory(e.target.value)
                              }
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           >
                              <option value="all">All Categories</option>
                              {categories.map((cat) => (
                                 <option key={cat} value={cat}>
                                    {cat}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>

                     {/* Prompts List */}
                     <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-h-[600px] overflow-y-auto">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                           <h2 className="font-semibold text-slate-900">
                              Prompts ({prompts.length})
                           </h2>
                           <button
                              onClick={() => {
                                 resetForm();
                                 setIsEditing(true);
                              }}
                              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                           >
                              <Plus className="w-4 h-4" />
                           </button>
                        </div>

                        <div className="divide-y divide-slate-200">
                           {prompts.map((prompt) => (
                              <div
                                 key={prompt.id}
                                 onClick={() => selectPrompt(prompt)}
                                 className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                                    selectedPrompt?.id === prompt.id
                                       ? "bg-blue-50 border-l-4 border-l-blue-600"
                                       : ""
                                 }`}
                              >
                                 <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                       <h3 className="font-medium mb-1 text-slate-900">
                                          {prompt.title}
                                       </h3>
                                       <div className="flex flex-wrap gap-1 mb-2">
                                          {prompt.categories.map((cat) => (
                                             <span
                                                key={cat}
                                                className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200"
                                             >
                                                {cat}
                                             </span>
                                          ))}
                                       </div>
                                       <div className="text-xs text-slate-500 flex items-center gap-3">
                                          <span className="font-medium">
                                             v{prompt.currentVersion}
                                          </span>
                                          {prompt.recommendedModel && (
                                             <span className="flex items-center gap-1 text-blue-600 font-medium">
                                                🤖 {prompt.recommendedModel}
                                             </span>
                                          )}
                                          <span className="flex items-center gap-1">
                                             <Clock className="w-3 h-3" />
                                             {formatDate(prompt.updatedAt)}
                                          </span>
                                       </div>
                                    </div>
                                    <button
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          // toggleFavorite(prompt.id);
                                       }}
                                       className="ml-2 p-1 hover:bg-slate-100 rounded transition-colors"
                                       title={
                                          prompt.isFavorite
                                             ? "Remove from favorites"
                                             : "Add to favorites"
                                       }
                                    >
                                       <Star
                                          className={`w-5 h-5 ${
                                             prompt.isFavorite
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-slate-400"
                                          }`}
                                       />
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Main Content */}
                  <div className="lg:col-span-2">
                     {isEditing ? (
                        /* Edit/Create Form */
                        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                           <div className="flex justify-between items-center mb-6">
                              <h2 className="text-2xl font-bold text-slate-900">
                                 {selectedPrompt
                                    ? "Update Prompt"
                                    : "Create New Prompt"}
                              </h2>
                              <button
                                 onClick={resetForm}
                                 className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                 <X className="w-5 h-5 text-slate-600" />
                              </button>
                           </div>

                           {/* Template Selector */}
                           {!selectedPrompt && (
                              <TemplateSelector onSelect={loadTemplate} />
                           )}

                           <div className="space-y-4">
                              <div>
                                 <label className="block text-sm font-medium mb-2 text-slate-700">
                                    Title
                                 </label>
                                 <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                       setFormData((prev) => ({
                                          ...prev,
                                          title: e.target.value,
                                       }))
                                    }
                                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter prompt title..."
                                 />
                              </div>

                              <div>
                                 <label className="block text-sm font-medium mb-2 text-slate-700">
                                    Categories
                                 </label>
                                 <div className="flex gap-2 mb-2 flex-wrap">
                                    {formData.categories.map((cat) => (
                                       <span
                                          key={cat}
                                          className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-200"
                                       >
                                          {cat}
                                          <button
                                             onClick={() => removeCategory(cat)}
                                             className="hover:text-slate-900"
                                          >
                                             <X className="w-3 h-3" />
                                          </button>
                                       </span>
                                    ))}
                                 </div>
                                 <div className="flex gap-2">
                                    <input
                                       type="text"
                                       id="newCategory"
                                       placeholder="Add category..."
                                       className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                       onKeyPress={(e) => {
                                          if (e.key === "Enter") {
                                             addCategory(e.target.value);
                                             e.target.value = "";
                                          }
                                       }}
                                    />
                                    <button
                                       onClick={() => {
                                          const input =
                                             document.getElementById(
                                                "newCategory"
                                             );
                                          addCategory(input.value);
                                          input.value = "";
                                       }}
                                       className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                                    >
                                       Add
                                    </button>
                                 </div>
                              </div>

                              <div>
                                 <label className="block text-sm font-medium mb-2 text-slate-700">
                                    Recommended AI Model
                                 </label>
                                 <select
                                    value={formData.recommendedModel}
                                    onChange={(e) =>
                                       setFormData((prev) => ({
                                          ...prev,
                                          recommendedModel: e.target.value,
                                       }))
                                    }
                                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                 >
                                    <option value="">
                                       Select a model (optional)
                                    </option>
                                    {AI_MODELS.map((model) => (
                                       <option key={model} value={model}>
                                          {model}
                                       </option>
                                    ))}
                                 </select>
                              </div>

                              <div>
                                 <label className="block text-sm font-medium mb-2 text-slate-700">
                                    Prompt Content
                                 </label>
                                 <textarea
                                    value={formData.content}
                                    onChange={(e) =>
                                       setFormData((prev) => ({
                                          ...prev,
                                          content: e.target.value,
                                       }))
                                    }
                                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-64 resize-none"
                                    placeholder="Enter your prompt content..."
                                 />
                              </div>

                              <div>
                                 <label className="block text-sm font-medium mb-2 text-slate-700">
                                    Follow-up Prompts
                                 </label>
                                 <p className="text-xs text-slate-500 mb-2">
                                    Add suggested follow-up questions or prompts
                                    that users might want to ask next.
                                 </p>
                                 {formData.followUpPrompts.length > 0 && (
                                    <div className="mb-2 space-y-2">
                                       {formData.followUpPrompts.map(
                                          (prompt, idx) => (
                                             <div
                                                key={idx}
                                                className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200"
                                             >
                                                <span className="flex-1 text-sm text-slate-700">
                                                   {prompt}
                                                </span>
                                                <button
                                                   onClick={() =>
                                                      removeFollowUpPrompt(idx)
                                                   }
                                                   className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                >
                                                   <X className="w-4 h-4 text-slate-600" />
                                                </button>
                                             </div>
                                          )
                                       )}
                                    </div>
                                 )}
                                 <div className="flex gap-2">
                                    <input
                                       type="text"
                                       id="newFollowUp"
                                       placeholder="Add follow-up prompt..."
                                       className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                       onKeyPress={(e) => {
                                          if (e.key === "Enter") {
                                             addFollowUpPrompt();
                                          }
                                       }}
                                    />
                                    <button
                                       onClick={addFollowUpPrompt}
                                       className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                                    >
                                       Add
                                    </button>
                                 </div>
                              </div>

                              <button
                                 onClick={
                                    selectedPrompt ? updatePrompt : addNewPrompt
                                 }
                                 className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                              >
                                 <Save className="w-4 h-4" />
                                 {selectedPrompt
                                    ? "Save New Version"
                                    : "Create Prompt"}
                              </button>
                           </div>
                        </div>
                     ) : selectedPrompt ? (
                        /* Prompt Detail View */
                        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                 <h2 className="text-2xl font-bold mb-2 text-slate-900">
                                    {selectedPrompt.title}
                                 </h2>
                                 <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedPrompt.categories.map((cat) => (
                                       <span
                                          key={cat}
                                          className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-200"
                                       >
                                          <Tag className="w-3 h-3" />
                                          {cat}
                                       </span>
                                    ))}
                                 </div>
                                 <div className="text-sm text-slate-600 space-y-1">
                                    <div>
                                       <span className="font-medium">
                                          Created:
                                       </span>{" "}
                                       {formatDate(selectedPrompt.createdAt)}
                                    </div>
                                    <div>
                                       <span className="font-medium">
                                          Last Updated:
                                       </span>{" "}
                                       {formatDate(selectedPrompt.updatedAt)}
                                    </div>
                                    <div>
                                       <span className="font-medium">
                                          Current Version:
                                       </span>{" "}
                                       v{selectedPrompt.currentVersion}
                                    </div>
                                    {selectedPrompt.recommendedModel && (
                                       <div className="flex items-center gap-2 mt-2">
                                          <span className="text-blue-700 font-medium">
                                             🤖 Recommended Model:
                                          </span>
                                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium border border-blue-200">
                                             {selectedPrompt.recommendedModel}
                                          </span>
                                       </div>
                                    )}
                                 </div>
                              </div>
                              <button
                                 onClick={startEdit}
                                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                              >
                                 <Edit2 className="w-4 h-4" />
                                 Edit
                              </button>
                           </div>

                           {/* Current Prompt Content - Foldable */}
                           <div className="mb-6">
                              <div
                                 onClick={() =>
                                    setContentExpanded(!conentExpanded)
                                 }
                                 className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                              >
                                 <span className="font-semibold text-slate-900 flex items-center gap-2">
                                    Current Prompt Content
                                 </span>
                                 <div className="flex items-center gap-2">
                                    <button
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          copyToClipboard(
                                             selectedPrompt.content,
                                             "current-prompt"
                                          );
                                       }}
                                       className="p-2 hover:bg-slate-200 rounded transition-colors"
                                       title="Copy to clipboard"
                                    >
                                       {copiedItem === "current-prompt" ? (
                                          <Check className="w-4 h-4 text-green-600" />
                                       ) : (
                                          <Copy className="w-4 h-4 text-slate-600" />
                                       )}
                                    </button>
                                    {conentExpanded ? (
                                       <ChevronDown className="w-5 h-5 text-slate-600" />
                                    ) : (
                                       <ChevronRight className="w-5 h-5 text-slate-600" />
                                    )}
                                 </div>
                              </div>

                              {conentExpanded && (
                                 <div className="mt-2 p-4 bg-white border border-slate-200 rounded-lg">
                                    <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                                       {selectedPrompt.content}
                                    </pre>
                                 </div>
                              )}
                           </div>

                           {/* Follow-up Prompts Section */}
                           {selectedPrompt.followUpPrompts &&
                              selectedPrompt.followUpPrompts.length > 0 && (
                                 <div className="mb-6">
                                    <button
                                       onClick={() =>
                                          setFollowupsExpaned(
                                             !followUpsExpanded
                                          )
                                       }
                                       className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                                    >
                                       <span className="font-semibold text-slate-900 flex items-center gap-2">
                                          Follow-up Prompts (
                                          {
                                             selectedPrompt.followUpPrompts
                                                .length
                                          }
                                          )
                                       </span>
                                       {followUpsExpanded ? (
                                          <ChevronDown className="w-5 h-5 text-slate-600" />
                                       ) : (
                                          <ChevronRight className="w-5 h-5 text-slate-600" />
                                       )}
                                    </button>

                                    {followUpsExpanded && (
                                       <div className="mt-2 space-y-2">
                                          {selectedPrompt.followUpPrompts.map(
                                             (followUp, idx) => (
                                                <div
                                                   key={idx}
                                                   className="p-3 bg-blue-50 border border-blue-200 rounded-lg group"
                                                >
                                                   <div className="flex items-start gap-2">
                                                      <span className="text-blue-600 font-medium text-sm mt-0.5">
                                                         {idx + 1}.
                                                      </span>
                                                      <p className="text-sm text-slate-700 flex-1">
                                                         {followUp}
                                                      </p>
                                                      <button
                                                         onClick={() =>
                                                            copyToClipboard(
                                                               followUp,
                                                               `followup-${idx}`
                                                            )
                                                         }
                                                         className="p-1.5 hover:bg-blue-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                         title="Copy to clipboard"
                                                      >
                                                         {copiedItem ===
                                                         `followup-${idx}` ? (
                                                            <Check className="w-4 h-4 text-green-600" />
                                                         ) : (
                                                            <Copy className="w-4 h-4 text-blue-600" />
                                                         )}
                                                      </button>
                                                   </div>
                                                </div>
                                             )
                                          )}
                                       </div>
                                    )}
                                 </div>
                              )}

                           {/* Version History */}
                           <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                                 Version History (
                                 {selectedPrompt.versions.length})
                              </h3>

                              {[...selectedPrompt.versions]
                                 .reverse()
                                 .map((version, idx) => (
                                    <div
                                       key={version.version}
                                       className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden"
                                    >
                                       <button
                                          onClick={() =>
                                             toggleVersionExpand(
                                                version.version
                                             )
                                          }
                                          className="w-full p-4 flex justify-between items-center hover:bg-slate-100 transition-colors"
                                       >
                                          <div className="flex items-center gap-3">
                                             {expandedVersions[
                                                version.version
                                             ] ? (
                                                <ChevronDown className="w-4 h-4 text-slate-600" />
                                             ) : (
                                                <ChevronRight className="w-4 h-4 text-slate-600" />
                                             )}
                                             <span className="font-medium text-slate-900">
                                                Version {version.version}
                                             </span>
                                             {idx === 0 && (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs border border-green-200">
                                                   Current
                                                </span>
                                             )}
                                          </div>
                                          <span className="text-sm text-slate-600">
                                             {formatDate(version.createdAt)}
                                          </span>
                                       </button>

                                       {expandedVersions[version.version] && (
                                          <div className="p-4 border-t border-slate-200 bg-white">
                                             <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                                                {version.content}
                                             </pre>
                                          </div>
                                       )}
                                    </div>
                                 ))}
                           </div>
                        </div>
                     ) : (
                        /* Empty State */
                        <div className="bg-white rounded-lg p-12 border border-slate-200 shadow-sm text-center">
                           <div className="text-slate-500 mb-4">
                              <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                 No Prompt Selected
                              </h3>
                              <p>
                                 Select a prompt from the list or create a new
                                 one to get started
                              </p>
                           </div>
                           <button
                              onClick={() => {
                                 resetForm();
                                 setIsEditing(true);
                              }}
                              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                           >
                              Create Your First Prompt
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PromptManager;
