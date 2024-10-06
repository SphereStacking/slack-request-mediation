import path from "node:path";
import alias from "@rollup/plugin-alias";
import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const __dirname = path.resolve();

const extensions = [".ts", ".js"];

const preventThreeShakingPlugin = () => {
  return {
    name: "no-threeshaking",
    resolveId(id, importer) {
      if (!importer) {
        // let's not theeshake entry points, as we're not exporting anything in Apps Script files
        return { id, moduleSideEffects: "no-treeshake" };
      }
      return null;
    },
  };
};

export default {
  input: "./src/index.ts",
  output: {
    dir: "build",
    format: "esm",
  },
  plugins: [
    alias({
      entries: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    }),
    preventThreeShakingPlugin(),
    nodeResolve({
      extensions,
      mainFields: ["jsnext:main", "module", "main"],
    }),
    babel({ extensions, babelHelpers: "runtime" }),
    typescript(),
  ],
  treeshake: {
    moduleSideEffects: (id) => {
      // 特定のディレクトリやファイルを指定
      return id.includes("addTaskNotification");
    },
  },
};
