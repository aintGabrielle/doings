import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MoreHorizontalIcon, Share2Icon, TrashIcon } from "lucide-react";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { copyToClipboard } from "@/lib/utils";
import { ProjectsRecord } from "@/lib/xata";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { buttonVariants } from "./ui/button";

interface ProjectCardProps {
	project: ProjectsRecord;
	queryKey?: string[];
	onClick?: () => void;
}

const ProjectCard = ({ project, queryKey }: ProjectCardProps) => {
	const [isRemovingProject, setIsRemovingProject] = useState(false);
	const queryClient = useQueryClient();

	const handleRemoveProject = async () => {
		toast.dismiss();
		toast.loading("Removing project...");

		try {
			const res = await fetch("/api/projects/removeProject", {
				method: "POST",
				body: JSON.stringify({
					project_id: project.id,
				}),
			});

			if (!res.ok) {
				toast.dismiss();
				toast.error("Something went wrong");
				throw new Error("Something went wrong");
			}

			toast.dismiss();
			toast.success("Project removed successfully");
			queryClient.invalidateQueries({
				queryKey,
			});
		} catch (error) {
			toast.dismiss();
			toast.error("Something went wrong");
			console.error(error);
		}
	};

	return (
		<>
			<Card className={isRemovingProject ? "opacity-5" : "opacity-100"}>
				<CardHeader>
					<Link href={`/projects/${project.id}`}>
						<CardTitle>{project.name}</CardTitle>
					</Link>
					<CardDescription>{project.description}</CardDescription>
					<div className="flex justify-between items-center">
						<p>Created at:</p>
						<p>
							{dayjs(project.xata.createdAt).format(
								"MMM DD, YYYY"
							)}
						</p>
					</div>
				</CardHeader>
				<CardFooter className="flex justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger
							className={buttonVariants({
								variant: "ghost",
								size: "icon",
							})}
						>
							<MoreHorizontalIcon />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Action</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => {
									copyToClipboard(
										project?.enrollment_id as string
									);
									toast.success(
										"Enrollment ID copied to clipboard"
									);
								}}
								className="space-x-2"
							>
								<Share2Icon size={16} />
								<span>Get Shareable Code</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setIsRemovingProject(true)}
								className="space-x-2 text-destructive"
							>
								<TrashIcon size={16} />
								<span>Remove Project</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardFooter>
			</Card>

			<AlertDialog
				open={isRemovingProject}
				onOpenChange={setIsRemovingProject}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to remove this project?
						</AlertDialogTitle>
						<AlertDialogDescription>
							You will not be able to recover this project once it
							is removed.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleRemoveProject}>
							Remove Project
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default ProjectCard;
