// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as p from "promptable";
import { OpenAI, PromptTemplate } from "langchain";

const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY!,
    temperature: 0.9,
    maxTokens: 750,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const title = req.body.title;
    const template =
        "Outline a blog post using the title '{title}'. Make sure to not include the title in the response. Make sure to return the content in markdown format.";
    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["title"],
    });
    const content = await prompt.format({ title });
    const response = await model.call(content);
    res.status(200).json({ response });
}
