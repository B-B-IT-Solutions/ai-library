const remarkInstance = {
   use: () => remarkInstance,
   processSync: (text: string) => ({ toString: () => text }),
};

export const remark = () => remarkInstance;
