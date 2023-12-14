import { NextApiRequest, NextApiResponse } from "next";

import { generateProjectEnrollmentID } from "@/lib/utils";
import { getXataClient } from "@/lib/xata";

export type GetAllProjectsInput = {
    owner_id: string;
    description: string;
    name: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = getXataClient();
    const inputData = await JSON.parse(req.body) as GetAllProjectsInput;


    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const projects = await client.db.projects.create({
            description: inputData.description,
            enrollment_id: generateProjectEnrollmentID(),
            owner_id: inputData.owner_id,
            name: inputData.name,
        })
        return res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default handler;