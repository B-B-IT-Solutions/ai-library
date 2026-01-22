// Mock for remark-gfm plugin
const remarkGfm = () => {
   // Return a no-op transformer
   return (tree: any) => tree;
};

export default remarkGfm;
