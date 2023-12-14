import { NextApiRequest, NextApiResponse } from "next";

import { getXataClient } from "@/lib/xata";

type RemoveProjectInputProps = {
    project_id: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = getXataClient();
    const inputData = await JSON.parse(req.body) as RemoveProjectInputProps;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    try {
        const projects = await client.db.projects.delete(inputData.project_id)
        return res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default handler;