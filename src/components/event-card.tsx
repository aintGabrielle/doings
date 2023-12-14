import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowRightIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
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
import { Button, buttonVariants } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

import { Events } from "@/lib/xata";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface EventCardProps {
	event: Events;
	queryKey?: string[];
	onClick?: () => void;
}

const EventCard = ({ event, queryKey }: EventCardProps) => {
	const [isRemovingEvent, setIsRemovingEvent] = useState(false);
	const [isEditing, setIsEditingEvent] = useState(false);
	const queryClient = useQueryClient();

	// const handleRemoveProject = async () => {
	// 	toast.dismiss();
	// 	toast.loading("Removing project...");

	// 	try {
	// 		const res = await fetch("/api/projects/removeProject", {
	// 			method: "POST",
	// 			body: JSON.stringify({
	// 				project_id: project.id,
	// 			}),
	// 		});

	// 		if (!res.ok) {
	// 			toast.dismiss();
	// 			toast.error("Something went wrong");
	// 			throw new Error("Something went wrong");
	// 		}

	// 		toast.dismiss();
	// 		toast.success("Project removed successfully");
	// 		queryClient.invalidateQueries({
	// 			queryKey,
	// 		});
	// 	} catch (error) {
	// 		toast.dismiss();
	// 		toast.error("Something went wrong");
	// 		console.error(error);
	// 	}
	// };

	return (
		<>
			<Card className={isRemovingEvent ? "opacity-5" : "opacity-100"}>
				<CardHeader>
					<CardTitle>{event.name}</CardTitle>
					<CardDescription>{event.short_description}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						{dayjs(event.starting_date).format("MMM DD, YYYY")}
						<ArrowRightIcon />
						{dayjs(event.ending_date).format("MMM DD, YYYY")}
					</div>
				</CardContent>
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
								onClick={() => setIsEditingEvent(true)}
								className="space-x-2"
							>
								<TrashIcon size={16} />
								<span>Update Event</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setIsRemovingEvent(true)}
								className="space-x-2 text-destructive"
							>
								<TrashIcon size={16} />
								<span>Remove Event</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardFooter>
			</Card>

			<Dialog open={isEditing} onOpenChange={setIsEditingEvent}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Event</DialogTitle>
						<DialogDescription>
							Please fill in the form below to edit the event.
							Leave a field blank if you don&apos;t want to change
							it.
						</DialogDescription>
					</DialogHeader>

					<form className="flex flex-col gap-2">
						<label>
							<span>Event Name</span>
							<Input
								type="text"
								name="name"
								placeholder="Type in new Event Name"
							/>
						</label>
						<label>
							<span>Short Description</span>
							<Textarea
								name="short_description"
								rows={3}
								placeholder="Type in new short description"
							/>
						</label>
						<div className="flex gap-2 items-center">
							<label className="flex-1">
								<span>Starting Date</span>
								<Input type="date" name="starting_date" />
							</label>
							<label className="flex-1">
								<span>Ending Date</span>
								<Input type="date" name="ending_date" />
							</label>
						</div>
						<label>
							<span>Priority</span>
							<Select name="priority_range">
								<SelectTrigger>
									<SelectValue placeholder="Select Priority Level" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="10">High</SelectItem>
									<SelectItem value="5">Medium</SelectItem>
									<SelectItem value="1">Low</SelectItem>
								</SelectContent>
							</Select>
						</label>

						<Button type="submit">Update Event</Button>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={isRemovingEvent}
				onOpenChange={setIsRemovingEvent}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to remove this event?
						</AlertDialogTitle>
						<AlertDialogDescription>
							You will not be able to recover this event once it
							is removed.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction>Remove Event</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default EventCard;
