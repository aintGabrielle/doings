import { NextApiRequest, NextApiResponse } from "next";

import { getXataClient } from "@/lib/xata";

type LeaveProjectInputProps = {
    id: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = getXataClient();
    const inputData = await JSON.parse(req.body) as LeaveProjectInputProps;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    try {
        const projects = await client.db.joined_projects.delete(inputData.id)
        return res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default handler;