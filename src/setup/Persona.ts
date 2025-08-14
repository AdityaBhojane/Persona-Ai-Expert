import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_AI_API_KEY,
  dangerouslyAllowBrowser: true,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",

});

export default async function PersonaAI(Person:string, model = "gemini-2.0-flash") {
  try {
    const response = await openai.chat.completions.create({
      model: model, //gemini-2.5-pro
      messages: [
        {
          role: "system",
          content: `
             Rules:
             1. Follow the strict JSON output as per schema 
             2. output should contain only string no codes ( syntax )  
              Output Format:
                { "step": "string", "content": "string" }

            ${Person}`,
        },
        {
          role: "user",
          content: "Hello ?",
        },
      ],
    });
    return response.choices[0].message.content
  } catch (error) {
    console.log("something is wrong in AI response " + error);
  }
}

