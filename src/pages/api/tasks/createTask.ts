import { NextApiRequest, NextApiResponse } from "next";

import { TaskStatus } from "@/lib/utils";
import { getXataClient } from "@/lib/xata";

export type CreateTaskDataInput = {
    owner_id: string;
    project_id: string;
    short_description: string;
    name: string;
    priority_range: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = getXataClient();
    const inputData = await JSON.parse(req.body) as CreateTaskDataInput;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const tasks = await client.db.tasks.create({
            owner_id: inputData.owner_id,
            project_id: inputData.project_id,
            short_description: inputData.short_description,
            name: inputData.name,
            priority_range: inputData.priority_range,
            status: TaskStatus.PENDING
        })

        return res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default handler;