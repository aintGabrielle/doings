import { getXataClient } from "@/lib/xata";
import { NextApiRequest, NextApiResponse } from "next";

type GetAllProjectsInput = {
    enrollment_id: string;
    user_id: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = getXataClient();
    const inputData = await JSON.parse(req.body) as GetAllProjectsInput;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    try {
        const targetProject = await client.db.projects.filter('enrollment_id', inputData.enrollment_id).getFirst()
        
        const newJoinedProject = await client.db.joined_projects.create({
            owner_id: targetProject?.owner_id,
            project: targetProject,
            user_id: inputData.user_id,
        })

        return res.status(200).json(newJoinedProject);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default handler;