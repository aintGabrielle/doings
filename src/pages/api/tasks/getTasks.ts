import { NextApiRequest, NextApiResponse } from "next";

import { getXataClient } from "@/lib/xata";

type GetAllTasksInput = {
    project_id: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = getXataClient();
    const inputData = await JSON.parse(req.body) as GetAllTasksInput;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    try {
        const tasks = await client.db.tasks.filter('project_id', inputData.project_id).getAll()
        return res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default handler;