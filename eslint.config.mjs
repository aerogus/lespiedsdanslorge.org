import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        ignores: [
            "public/library/*"
        ]
    },
    {
        rules: {
            "no-unused-vars": "error",
            "no-undef": "error"
        }
    }
];

