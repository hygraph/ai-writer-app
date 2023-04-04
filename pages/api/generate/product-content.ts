// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as p from "promptable";
import { OpenAI, PromptTemplate } from "langchain";

const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY!,
    temperature: 0.9,
    maxTokens: 750,
    cache: false,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let content =
        "Write a product title and content for a bike shop. Return the response in JSON format.";
    const response = await model.call(content);
    const data = JSON.parse(response.trim());
    res.status(200).json(data);
}
