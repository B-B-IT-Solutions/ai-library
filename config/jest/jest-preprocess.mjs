"use strict";
import babelJest from "babel-jest";

const babelOptions = {
   plugins: ["babel-plugin-transform-import-meta"],
   presets: [
      "@babel/preset-env",
      "@babel/preset-typescript",
      [
         "@babel/preset-react",
         {
            runtime: "automatic",
         },
      ],
   ],
};

const babelConfig = babelJest.createTransformer(babelOptions);

export default babelConfig;
