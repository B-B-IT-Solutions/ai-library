// Mock for rehype-raw plugin
const rehypeRaw = () => {
   // Return a no-op transformer
   return (tree: any) => tree;
};

export default rehypeRaw;
