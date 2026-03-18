// import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// // Initialize the Google Generative AI client
// const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY_2);

// const schema = {
//   description: "SuperNote schema",
//   type: SchemaType.OBJECT,
//   properties: {
//     title: {
//       type: SchemaType.STRING,
//       description: "The title of the AI generated note",
//       nullable: false,
//     },
//     content: {
//       type: SchemaType.STRING,
//       description: "The content of the Ai generated note",
//       nullable: false,
//     },
//   },
//   required: ["title", "content"],
// };

// // Specify the model you want to use
// const model = genAI.getGenerativeModel({
//   model: "gemini-2.5-pro",

//   generationConfig: {
//     responseMimeType: "application/json",
//     responseSchema: schema,

//     // Added: Thinking config to verify facts before generating the card [ONLY FOR GEMINI # PRO]
//     // thinkingConfig: {
//     //   thinkingLevel: "HIGH",
//     //   includeThoughts: false,
//     // },
//   },
// });
// export { genAI, model };
