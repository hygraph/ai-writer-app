// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const apiUrl = process.env.REPLICATE_API_URL!;
const apiToken = process.env.REPLICATE_API_TOKEN!;
const apiVersion = process.env.REPLICATE_API_VERSION!;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const imageUrl = req.body.imageUrl;
        const apiKey = req.body.apiKey;
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${apiToken}`,
            },
            body: JSON.stringify({
                version: apiVersion,
                input: {
                    image: imageUrl,
                    caption: true,
                    temperature: 1,
                },
            }),
        });

        if (response.status !== 201) {
            let error = await response.json();
            res.status(500).json({ detail: error.detail });
            return;
        }

        const prediction = await response.json();
        res.status(201).json(prediction);
    }
}
