import tailwindConfig from "./tailwind.config.cjs";
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer";

module.exports = {
  plugins: [tailwindcss(tailwindConfig), autoprefixer],
};
