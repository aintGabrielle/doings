import { JoinedProjectsRecord, Users } from "@/lib/xata";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontalIcon, TrashIcon } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type JoinedProjectCardProps = {
	joined_project: JoinedProjectsRecord;
	queryKey: string[];
};

const JoinedProjectCard = ({
	joined_project,
	queryKey,
}: JoinedProjectCardProps) => {
	const [isLeavingProject, setIsLeavingProject] = useState(false);
	const queryClient = useQueryClient();

	const handleLeaveProject = async () => {
		toast.dismiss();
		toast.loading("Leaving Project...");

		try {
			const res = await fetch("/api/projects/leaveProject", {
				method: "POST",
				body: JSON.stringify({
					id: joined_project.id,
				}),
			});

			if (!res.ok) {
				toast.dismiss();
				toast.error("Something went wrong!");
				throw new Error("Something went wrong!");
			}

			toast.dismiss();
			toast.success("Project left successfully!");

			queryClient.invalidateQueries({
				queryKey,
			});
		} catch (error) {}
	};

	const _createdBy = useQuery({
		queryKey: [
			"project",
			joined_project.id,
			"createdBy",
			joined_project.owner_id,
		],
		queryFn: async () => {
			const res = await fetch("/api/users/getUser", {
				method: "POST",
				body: JSON.stringify({
					user_id: joined_project.owner_id,
				}),
			});
			const data = await res.json();
			return data as Users;
		},
		enabled: !!joined_project.owner_id,
	});

	return (
		<>
			<Card>
				<CardHeader>
					<Link href={`/projects/${joined_project.project?.id}`}>
						<CardTitle>{joined_project.project?.name}</CardTitle>
					</Link>
					<CardDescription>
						{joined_project.project?.description}
					</CardDescription>
					<div className="flex items-center justify-between">
						<p>Created at:</p>
						<p>
							{dayjs(joined_project.xata.createdAt).format(
								"MMM DD, YYYY"
							)}
						</p>
					</div>
					<div className="flex items-center justify-between">
						<p>Created by:</p>
						<p>
							{_createdBy.isFetched &&
								`${_createdBy.data?.first_name} ${_createdBy.data?.last_name}`}
						</p>
					</div>
				</CardHeader>
				<CardFooter className="flex justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="icon" variant="ghost">
								<MoreHorizontalIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Action</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => setIsLeavingProject(true)}
								className="space-x-2 text-destructive"
							>
								<TrashIcon size={16} />
								<span>Leave Project</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardFooter>
			</Card>

			<AlertDialog
				open={isLeavingProject}
				onOpenChange={setIsLeavingProject}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to leave this project?
						</AlertDialogTitle>
						<AlertDialogDescription>
							You will not be able to access this project anymore.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleLeaveProject}>
							Leave Project
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default JoinedProjectCard;
