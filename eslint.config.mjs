import js from "@eslint/js";
import peggylint from "@peggyjs/eslint-plugin/lib/flat/recommended.js"
import tseslint from "typescript-eslint";

export default tseslint.config(
	js.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		files: ["**/*.ts"],
		extends: [
			...tseslint.configs.recommendedTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
		],
	},
	{
		files: ["**/*.pegjs"],
		extends: [
			peggylint
		]
	}
);
