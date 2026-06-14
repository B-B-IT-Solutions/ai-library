export {
   preloadPromptTemplateCategoriesOptions,
   infiniteLoadPromptsPageOptions,
   useInfiniteLoadPromptsPage,
   useLoadPromptTemplateCategories,
   useToggleFavorite,
} from "./prompt";

export {
   infiniteLoadPublicTemplateDescriptorsOptions,
   useInfiniteLoadPublicTemplateDescriptors,
} from "./prompt.public";

export type {
   LoadPromptsPageParams as LoadTemplateDescriptorsParams,
   UpdateIsFavoriteParams,
} from "./types";
