// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const apiUrl = process.env.REPLICATE_API_URL!;
const apiToken = process.env.REPLICATE_API_TOKEN!;
const apiVersion = process.env.REPLICATE_API_VERSION!;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("Prediction URL:", `${apiUrl}/${req.query.id}`);
    const response: any = await fetch(`${apiUrl}/${req.query.id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${apiToken}`,
        },
    });

    if (response.status !== 200) {
        let error = await response.json();
        res.status(500).json({ detail: error.detail });
        return;
    }

    const prediction = await response.json();
    res.status(200).json(prediction);
}
