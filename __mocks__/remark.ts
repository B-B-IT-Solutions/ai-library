const remarkInstance = {
   use: jest.fn().mockImplementation(() => remarkInstance),
   processSync: jest.fn().mockImplementation((text: string) => ({
      toString: jest.fn().mockImplementation(() => text),
   })),
};

export const remark = jest.fn(() => remarkInstance);
