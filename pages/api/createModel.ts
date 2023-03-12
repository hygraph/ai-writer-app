// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
    Client,
    SimpleFieldType,
    VisibilityTypes,
} from "@hygraph/management-sdk";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const appToken = req.body.appToken;
        const endpoint = req.body.endpoint;

        // Create client
        const client = new Client({
            authToken: appToken,
            endpoint: endpoint,
        });

        // client.createModel({
        //     apiId: "AiWriter",
        //     apiIdPlural: "AiWriters",
        //     displayName: "AI Writer",
        // });

        // client.createSimpleField({
        //     parentApiId: "Asset",
        //     type: SimpleFieldType.String,
        //     apiId: "altText",
        //     displayName: "Alt Text",
        //     visibility: VisibilityTypes.ReadWrite,
        // });

        // client.createCustomSidebarElement({
        //     appApiId: "ai-writer",
        //     appElementApiId: "ai-writer-sidebar",
        //     displayName: "AI Writer",
        //     modelApiId: "Asset",
        //     config: {},
        // });

        try {
            client
                .run()
                .then((result) => {
                    console.log("result", result);
                    console.log(`Finished migration at: ${result.finishedAt}`);
                    res.status(200).json(result);
                })
                .catch((error) => {
                    console.error(error);
                    res.status(400).json({ message: error });
                });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(403).send("Method not allowed");
    }
}
