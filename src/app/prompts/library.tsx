"use client";

import { useState, useEffect } from "react";
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
   Settings,
   FileText,
} from "lucide-react";
import { TemplateSelector } from "./template/TemplateSelector";

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

const PREDEFINED_PROMPTS = [
   {
      title: "Code Review Assistant",
      content:
         "Please review the following code for:\n- Best practices\n- Performance optimization\n- Security vulnerabilities\n- Code readability\n- Potential bugs\n\nProvide specific suggestions for improvement.\n\nCode:\n[INSERT CODE HERE]",
      categories: ["Development", "Code Review"],
      recommendedModel: "Claude Sonnet 4.5",
   },
   {
      title: "Technical Documentation Writer",
      content:
         "Create comprehensive technical documentation for [FEATURE/API/SYSTEM]. Include:\n\n1. Overview and purpose\n2. Prerequisites\n3. Step-by-step instructions\n4. Code examples\n5. Common issues and troubleshooting\n6. Best practices\n\nTarget audience: [SPECIFY AUDIENCE]",
      categories: ["Documentation", "Technical Writing"],
      recommendedModel: "Claude Sonnet 4.5",
   },
   {
      title: "Blog Post Outliner",
      content:
         "Create a detailed blog post outline about [TOPIC].\n\nInclude:\n- Catchy title (3 options)\n- Meta description\n- Introduction hook\n- 5-7 main sections with subpoints\n- Conclusion with call-to-action\n- SEO keywords\n\nTone: [Professional/Casual/Technical]\nTarget audience: [SPECIFY]",
      categories: ["Content Creation", "Marketing"],
      recommendedModel: "GPT-4",
   },
   {
      title: "Data Analysis Helper",
      content:
         "Analyze the following dataset and provide insights:\n\n[INSERT DATA OR DESCRIBE DATASET]\n\nPlease provide:\n1. Summary statistics\n2. Key trends and patterns\n3. Anomalies or outliers\n4. Correlations between variables\n5. Actionable recommendations\n6. Visualizations suggestions",
      categories: ["Data Science", "Analysis"],
      recommendedModel: "Claude Sonnet 4.5",
   },
   {
      title: "Meeting Notes Summarizer",
      content:
         "Summarize the following meeting notes into a structured format:\n\n[INSERT MEETING NOTES]\n\nProvide:\n- Key decisions made\n- Action items with owners\n- Important discussion points\n- Follow-up required\n- Next meeting agenda items",
      categories: ["Productivity", "Business"],
      recommendedModel: "GPT-4 Turbo",
   },
   {
      title: "Email Response Generator",
      content:
         "Draft a professional email response to:\n\n[INSERT EMAIL CONTENT]\n\nTone: [Professional/Friendly/Formal]\nKey points to address:\n- [POINT 1]\n- [POINT 2]\n- [POINT 3]\n\nKeep it concise and actionable.",
      categories: ["Communication", "Business"],
      recommendedModel: "GPT-3.5",
   },
   {
      title: "Learning Path Creator",
      content:
         "Create a comprehensive learning path for [SKILL/TOPIC].\n\nInclude:\n1. Prerequisites\n2. Week-by-week breakdown\n3. Resources (courses, books, articles)\n4. Practice projects\n5. Milestone assessments\n6. Estimated time commitment\n\nCurrent level: [Beginner/Intermediate/Advanced]",
      categories: ["Education", "Learning"],
      recommendedModel: "Claude Opus 4",
   },
   {
      title: "SQL Query Generator",
      content:
         "Generate an SQL query for the following requirement:\n\n[DESCRIBE REQUIREMENT]\n\nDatabase schema:\n[DESCRIBE TABLES AND COLUMNS]\n\nProvide:\n- Optimized SQL query\n- Explanation of the query\n- Performance considerations\n- Alternative approaches if applicable",
      categories: ["Development", "Database"],
      recommendedModel: "Claude Sonnet 4.5",
   },
   {
      title: "User Story Creator",
      content:
         "Create user stories for [FEATURE NAME].\n\nFormat each as:\n- As a [USER TYPE]\n- I want to [ACTION]\n- So that [BENEFIT]\n\nInclude:\n- Acceptance criteria\n- Edge cases\n- Technical considerations\n- Estimated complexity",
      categories: ["Agile", "Product Management"],
      recommendedModel: "GPT-4",
   },
   {
      title: "Bug Report Template",
      content:
         "Report a bug with the following details:\n\n**Title:** [Clear, concise title]\n\n**Environment:**\n- OS: [e.g., Windows 11, macOS 14]\n- Browser/App Version:\n- Device:\n\n**Steps to Reproduce:**\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\n**Expected Behavior:**\n[What should happen]\n\n**Actual Behavior:**\n[What actually happens]\n\n**Screenshots/Logs:**\n[Attach if available]\n\n**Severity:** [Critical/High/Medium/Low]",
      categories: ["Development", "QA"],
      recommendedModel: "GPT-4 Turbo",
   },
];

const PromptManager = () => {
   const [prompts, setPrompts] = useState([]);
   const [categories, setCategories] = useState([]);
   const [selectedPrompt, setSelectedPrompt] = useState(null);
   const [isEditing, setIsEditing] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("all");
   const [expandedVersions, setExpandedVersions] = useState({});
   const [showTemplates, setShowTemplates] = useState(false);
   const [templateSearch, setTemplateSearch] = useState("");
   const [templateCategory, setTemplateCategory] = useState("all");
   const [expandedPromptContent, setExpandedPromptContent] = useState({});
   const [copiedItem, setCopiedItem] = useState(null);
   const [activeMenu, setActiveMenu] = useState("prompts");
   const [favorites, setFavorites] = useState([]);
   const [formData, setFormData] = useState({
      title: "",
      content: "",
      categories: [],
      recommendedModel: "",
      followUpPrompts: [],
   });

   // Load data from storage on mount
   useEffect(() => {
      loadData();
   }, []);

   const loadData = async () => {
      try {
         const promptsResult = await window.storage.get("prompts-data");
         const categoriesResult = await window.storage.get("categories-data");
         const favoritesResult = await window.storage.get("favorites-data");

         if (promptsResult) {
            setPrompts(JSON.parse(promptsResult.value));
         }
         if (categoriesResult) {
            setCategories(JSON.parse(categoriesResult.value));
         }
         if (favoritesResult) {
            setFavorites(JSON.parse(favoritesResult.value));
         }
      } catch (error) {
         console.log("No existing data found, starting fresh");
      }
   };

   const saveData = async (newPrompts, newCategories, newFavorites) => {
      try {
         await window.storage.set("prompts-data", JSON.stringify(newPrompts));
         await window.storage.set(
            "categories-data",
            JSON.stringify(newCategories || categories)
         );
         if (newFavorites !== undefined) {
            await window.storage.set(
               "favorites-data",
               JSON.stringify(newFavorites)
            );
         }
      } catch (error) {
         console.error("Error saving data:", error);
      }
   };

   const createPrompt = () => {
      if (!formData.title || !formData.content) return;

      const newPrompt = {
         id: `prompt-${Date.now()}`,
         title: formData.title,
         categories: formData.categories,
         recommendedModel: formData.recommendedModel,
         followUpPrompts: formData.followUpPrompts,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
         currentVersion: 1,
         versions: [
            {
               version: 1,
               content: formData.content,
               createdAt: new Date().toISOString(),
            },
         ],
      };

      const newPrompts = [...prompts, newPrompt];
      setPrompts(newPrompts);

      // Update categories
      const newCats = [...new Set([...categories, ...formData.categories])];
      setCategories(newCats);

      saveData(newPrompts, newCats);
      resetForm();
   };

   const updatePrompt = () => {
      if (!selectedPrompt || !formData.content) return;

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

      setPrompts(updatedPrompts);

      const newCats = [...new Set([...categories, ...formData.categories])];
      setCategories(newCats);

      saveData(updatedPrompts, newCats);

      const updated = updatedPrompts.find((p) => p.id === selectedPrompt.id);
      setSelectedPrompt(updated);
      setIsEditing(false);
   };

   const selectPrompt = (prompt) => {
      setSelectedPrompt(prompt);
      setIsEditing(false);
   };

   const startEdit = () => {
      if (!selectedPrompt) return;
      setFormData({
         title: selectedPrompt.title,
         content:
            selectedPrompt.versions[selectedPrompt.versions.length - 1].content,
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
      setShowTemplates(false);
      setTemplateSearch("");
      setTemplateCategory("all");
   };

   const loadTemplate = (template) => {
      setFormData({
         title: template.title,
         content: template.content,
         categories: [...template.categories],
         recommendedModel: template.recommendedModel || "",
         followUpPrompts: template.followUpPrompts || [],
      });
      setShowTemplates(false);
      setTemplateSearch("");
      setTemplateCategory("all");
   };

   const togglePromptContent = (promptId) => {
      setExpandedPromptContent((prev) => ({
         ...prev,
         [promptId]: !prev[promptId],
      }));
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

   const removeFollowUpPrompt = (index) => {
      setFormData((prev) => ({
         ...prev,
         followUpPrompts: prev.followUpPrompts.filter((_, i) => i !== index),
      }));
   };

   const copyToClipboard = async (text, itemId) => {
      try {
         await navigator.clipboard.writeText(text);
         setCopiedItem(itemId);
         setTimeout(() => setCopiedItem(null), 2000);
      } catch (error) {
         console.error("Failed to copy:", error);
      }
   };

   const toggleFavorite = (promptId) => {
      const newFavorites = favorites.includes(promptId)
         ? favorites.filter((id) => id !== promptId)
         : [...favorites, promptId];

      setFavorites(newFavorites);
      saveData(prompts, categories, newFavorites);
   };

   const favoritePrompts = prompts.filter((p) => favorites.includes(p.id));

   const toggleVersionExpand = (promptId) => {
      setExpandedVersions((prev) => ({
         ...prev,
         [promptId]: !prev[promptId],
      }));
   };

   const addCategory = (cat) => {
      if (cat && !formData.categories.includes(cat)) {
         setFormData((prev) => ({
            ...prev,
            categories: [...prev.categories, cat],
         }));
      }
   };

   const removeCategory = (cat) => {
      setFormData((prev) => ({
         ...prev,
         categories: prev.categories.filter((c) => c !== cat),
      }));
   };

   const filteredPrompts = prompts.filter((p) => {
      const matchesSearch =
         p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         p.versions.some((v) =>
            v.content.toLowerCase().includes(searchTerm.toLowerCase())
         );
      const matchesCategory =
         selectedCategory === "all" || p.categories.includes(selectedCategory);
      return matchesSearch && matchesCategory;
   });

   const templateCategories = [
      ...new Set(PREDEFINED_PROMPTS.flatMap((t) => t.categories)),
   ].sort();

   const filteredTemplates = PREDEFINED_PROMPTS.filter((template) => {
      const matchesSearch =
         template.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
         template.content
            .toLowerCase()
            .includes(templateSearch.toLowerCase()) ||
         template.categories.some((cat) =>
            cat.toLowerCase().includes(templateSearch.toLowerCase())
         );
      const matchesCategory =
         templateCategory === "all" ||
         template.categories.includes(templateCategory);
      return matchesSearch && matchesCategory;
   });

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex">
         {/* Left Sidebar Navigation */}
         <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-200">
               <h1 className="text-2xl font-bold text-slate-900">
                  Prompt Manager
               </h1>
            </div>

            <nav className="flex-1 p-4">
               <button
                  onClick={() => setActiveMenu("prompts")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                     activeMenu === "prompts"
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                  }`}
               >
                  <FileText className="w-5 h-5" />
                  Prompts
               </button>

               <button
                  onClick={() => setActiveMenu("favorites")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                     activeMenu === "favorites"
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                  }`}
               >
                  <Star className="w-5 h-5" />
                  Favorites
                  {favorites.length > 0 && (
                     <span className="ml-auto bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full">
                        {favorites.length}
                     </span>
                  )}
               </button>

               <button
                  onClick={() => setActiveMenu("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                     activeMenu === "settings"
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                  }`}
               >
                  <Settings className="w-5 h-5" />
                  Settings
               </button>
            </nav>

            <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
               <p>Version 1.0.0</p>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
               {activeMenu === "prompts" && (
                  <>
                     <header className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                           All Prompts
                        </h2>
                        <p className="text-slate-600">
                           Create, version, and organize your AI prompts
                        </p>
                     </header>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                           {/* Search and Filter */}
                           <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                              <div className="relative mb-4">
                                 <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                 <input
                                    type="text"
                                    placeholder="Search prompts..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                       setSearchTerm(e.target.value)
                                    }
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
                                    Prompts ({filteredPrompts.length})
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
                                 {filteredPrompts.map((prompt) => (
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
                                                {prompt.categories.map(
                                                   (cat) => (
                                                      <span
                                                         key={cat}
                                                         className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200"
                                                      >
                                                         {cat}
                                                      </span>
                                                   )
                                                )}
                                             </div>
                                             <div className="text-xs text-slate-500 flex items-center gap-3">
                                                <span className="font-medium">
                                                   v{prompt.currentVersion}
                                                </span>
                                                {prompt.recommendedModel && (
                                                   <span className="flex items-center gap-1 text-blue-600 font-medium">
                                                      🤖{" "}
                                                      {prompt.recommendedModel}
                                                   </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                   <Clock className="w-3 h-3" />
                                                   {formatDate(
                                                      prompt.updatedAt
                                                   )}
                                                </span>
                                             </div>
                                          </div>
                                          <button
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(prompt.id);
                                             }}
                                             className="ml-2 p-1 hover:bg-slate-100 rounded transition-colors"
                                             title={
                                                favorites.includes(prompt.id)
                                                   ? "Remove from favorites"
                                                   : "Add to favorites"
                                             }
                                          >
                                             <Star
                                                className={`w-5 h-5 ${
                                                   favorites.includes(prompt.id)
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
                                    <TemplateSelector
                                       showTemplates={showTemplates}
                                       setShowTemplates={setShowTemplates}
                                       search={templateSearch}
                                       setSearch={setTemplateSearch}
                                       category={templateCategory}
                                       setCategory={setTemplateCategory}
                                       categories={templateCategories}
                                       templates={filteredTemplates}
                                       onSelect={loadTemplate}
                                    />
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
                                                   onClick={() =>
                                                      removeCategory(cat)
                                                   }
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
                                                recommendedModel:
                                                   e.target.value,
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
                                          Add suggested follow-up questions or
                                          prompts that users might want to ask
                                          next.
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
                                                            removeFollowUpPrompt(
                                                               idx
                                                            )
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
                                          selectedPrompt
                                             ? updatePrompt
                                             : createPrompt
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
                                          {selectedPrompt.categories.map(
                                             (cat) => (
                                                <span
                                                   key={cat}
                                                   className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-200"
                                                >
                                                   <Tag className="w-3 h-3" />
                                                   {cat}
                                                </span>
                                             )
                                          )}
                                       </div>
                                       <div className="text-sm text-slate-600 space-y-1">
                                          <div>
                                             <span className="font-medium">
                                                Created:
                                             </span>{" "}
                                             {formatDate(
                                                selectedPrompt.createdAt
                                             )}
                                          </div>
                                          <div>
                                             <span className="font-medium">
                                                Last Updated:
                                             </span>{" "}
                                             {formatDate(
                                                selectedPrompt.updatedAt
                                             )}
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
                                                   {
                                                      selectedPrompt.recommendedModel
                                                   }
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
                                    <button
                                       onClick={() =>
                                          togglePromptContent("current")
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
                                                   selectedPrompt.versions[
                                                      selectedPrompt.versions
                                                         .length - 1
                                                   ].content,
                                                   "current-prompt"
                                                );
                                             }}
                                             className="p-2 hover:bg-slate-200 rounded transition-colors"
                                             title="Copy to clipboard"
                                          >
                                             {copiedItem ===
                                             "current-prompt" ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                             ) : (
                                                <Copy className="w-4 h-4 text-slate-600" />
                                             )}
                                          </button>
                                          {expandedPromptContent["current"] ? (
                                             <ChevronDown className="w-5 h-5 text-slate-600" />
                                          ) : (
                                             <ChevronRight className="w-5 h-5 text-slate-600" />
                                          )}
                                       </div>
                                    </button>

                                    {expandedPromptContent["current"] && (
                                       <div className="mt-2 p-4 bg-white border border-slate-200 rounded-lg">
                                          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                                             {
                                                selectedPrompt.versions[
                                                   selectedPrompt.versions
                                                      .length - 1
                                                ].content
                                             }
                                          </pre>
                                       </div>
                                    )}
                                 </div>

                                 {/* Follow-up Prompts Section */}
                                 {selectedPrompt.followUpPrompts &&
                                    selectedPrompt.followUpPrompts.length >
                                       0 && (
                                       <div className="mb-6">
                                          <button
                                             onClick={() =>
                                                togglePromptContent("followups")
                                             }
                                             className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                                          >
                                             <span className="font-semibold text-slate-900 flex items-center gap-2">
                                                Follow-up Prompts (
                                                {
                                                   selectedPrompt
                                                      .followUpPrompts.length
                                                }
                                                )
                                             </span>
                                             {expandedPromptContent[
                                                "followups"
                                             ] ? (
                                                <ChevronDown className="w-5 h-5 text-slate-600" />
                                             ) : (
                                                <ChevronRight className="w-5 h-5 text-slate-600" />
                                             )}
                                          </button>

                                          {expandedPromptContent[
                                             "followups"
                                          ] && (
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
                                                   {formatDate(
                                                      version.createdAt
                                                   )}
                                                </span>
                                             </button>

                                             {expandedVersions[
                                                version.version
                                             ] && (
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
                                       Select a prompt from the list or create a
                                       new one to get started
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
                  </>
               )}

               {/* Favorites View */}
               {activeMenu === "favorites" && (
                  <>
                     <header className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                           Favorites
                        </h2>
                        <p className="text-slate-600">
                           Your starred prompts for quick access
                        </p>
                     </header>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Favorites List */}
                        <div className="lg:col-span-1">
                           <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-h-[600px] overflow-y-auto">
                              <div className="p-4 border-b border-slate-200 bg-slate-50">
                                 <h3 className="font-semibold text-slate-900">
                                    Favorite Prompts ({favoritePrompts.length})
                                 </h3>
                              </div>

                              {favoritePrompts.length > 0 ? (
                                 <div className="divide-y divide-slate-200">
                                    {favoritePrompts.map((prompt) => (
                                       <div
                                          key={prompt.id}
                                          onClick={() => {
                                             selectPrompt(prompt);
                                             setActiveMenu("prompts");
                                          }}
                                          className="p-4 cursor-pointer transition-colors hover:bg-slate-50"
                                       >
                                          <div className="flex items-start justify-between">
                                             <div className="flex-1">
                                                <h3 className="font-medium mb-1 text-slate-900">
                                                   {prompt.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                   {prompt.categories.map(
                                                      (cat) => (
                                                         <span
                                                            key={cat}
                                                            className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200"
                                                         >
                                                            {cat}
                                                         </span>
                                                      )
                                                   )}
                                                </div>
                                             </div>
                                             <button
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   toggleFavorite(prompt.id);
                                                }}
                                                className="ml-2 p-1 hover:bg-slate-100 rounded transition-colors"
                                             >
                                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                             </button>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              ) : (
                                 <div className="p-12 text-center text-slate-500">
                                    <Star className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>No favorite prompts yet</p>
                                    <p className="text-sm mt-2">
                                       Star prompts to add them here
                                    </p>
                                 </div>
                              )}
                           </div>
                        </div>

                        <div className="lg:col-span-2">
                           {selectedPrompt && activeMenu === "prompts" ? (
                              <div className="bg-slate-100 rounded-lg p-12 border border-slate-200 text-center">
                                 <p className="text-slate-600">
                                    Select a favorite prompt to view details
                                 </p>
                              </div>
                           ) : (
                              <div className="bg-slate-100 rounded-lg p-12 border border-slate-200 text-center">
                                 <p className="text-slate-600">
                                    Select a favorite prompt to view details
                                 </p>
                              </div>
                           )}
                        </div>
                     </div>
                  </>
               )}

               {/* Settings View */}
               {activeMenu === "settings" && (
                  <>
                     <header className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                           Settings
                        </h2>
                        <p className="text-slate-600">
                           Configure your prompt manager preferences
                        </p>
                     </header>

                     <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm max-w-2xl">
                        <div className="space-y-6">
                           <div>
                              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                 Data Management
                              </h3>
                              <div className="space-y-3">
                                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                       <p className="font-medium text-slate-900">
                                          Total Prompts
                                       </p>
                                       <p className="text-sm text-slate-600">
                                          {prompts.length} prompts stored
                                       </p>
                                    </div>
                                 </div>
                                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                       <p className="font-medium text-slate-900">
                                          Categories
                                       </p>
                                       <p className="text-sm text-slate-600">
                                          {categories.length} categories
                                       </p>
                                    </div>
                                 </div>
                                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                       <p className="font-medium text-slate-900">
                                          Favorites
                                       </p>
                                       <p className="text-sm text-slate-600">
                                          {favorites.length} favorite prompts
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div>
                              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                 About
                              </h3>
                              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                 <p className="text-sm text-slate-600 mb-2">
                                    Prompt Manager helps you organize, version,
                                    and manage your AI prompts efficiently.
                                 </p>
                                 <p className="text-sm text-slate-600">
                                    Version 1.0.0
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

export default PromptManager;
