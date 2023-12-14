import { CommentsRecord, Events, Tasks, Users } from "@/lib/xata";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ArrowRightIcon,
	CalendarIcon,
	Edit2Icon,
	MessageSquare,
	MoreHorizontalIcon,
	Trash2Icon,
} from "lucide-react";
import { FormEvent, useState } from "react";
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
} from "./ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

import $$supabase from "@/lib/supabase";
import { TaskStatus } from "@/lib/utils";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Drawer } from "vaul";
import CommentCard from "./comment-card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";

interface TaskRowProps {
	task: Tasks;
	queryKey: string[];
}

const TaskCard = ({ task, queryKey }: TaskRowProps) => {
	const queryClient = useQueryClient();
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isSettingEvent, setIsSettingEvent] = useState(false);
	const [isCommenting, setIsCommenting] = useState(false);

	const _createdBy = useQuery({
		queryKey: ["task", task.id, "createdBy", task.owner_id],
		queryFn: async () => {
			const res = await fetch("/api/users/getUser", {
				method: "POST",
				body: JSON.stringify({
					user_id: task.owner_id,
				}),
			});
			const data = await res.json();
			return data as Users;
		},
		enabled: !!task.owner_id,
	});

	const _events = useQuery({
		queryKey: ["task", task.id, "events_list"],
		queryFn: async () => {
			const res = await fetch("/api/events/getAllEvents", {
				method: "POST",
				body: JSON.stringify({
					owner_id: task.owner_id,
				}),
			});
			const data = await res.json();
			return data as Events[];
		},
		enabled: !!task.id,
	});

	const _currentEvent = useQuery({
		queryKey: ["task", task.id, "currentEvent"],
		queryFn: async () => {
			const res = await fetch("/api/events/getEvent", {
				method: "POST",
				body: JSON.stringify({
					target_id: task.event_id,
				}),
			});
			const data = await res.json();
			return data as Events;
		},
		enabled: !!task.event_id,
	});

	const _comments = useQuery({
		queryKey: ["task", task.id, "comments"],
		queryFn: async () => {
			const res = await fetch("/api/comments/getComments", {
				method: "POST",
				body: JSON.stringify({
					task_id: task.id,
				}),
			});
			const data = await res.json();
			return data as CommentsRecord[];
		},
		enabled: !!task.id,
		refetchInterval: 5000,
	});

	const handleUpdateTask = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const parsed = Object.fromEntries(formData.entries());

		// remove empty fields
		const filtered = Object.fromEntries(
			Object.entries(parsed).filter(([_, v]) => v)
		);

		if (
			!parsed.name &&
			!parsed.short_description &&
			!parsed.priority_range &&
			!parsed.status
		) {
			toast.error(
				"To edit a task, please fill the inputs you want to edit"
			);
			return;
		}

		toast.promise(
			fetch("/api/tasks/updateTask", {
				method: "POST",
				body: JSON.stringify({
					target_id: task.id,
					content: filtered,
				}),
			}),
			{
				loading: "Updating task...",
				success: () => {
					queryClient.invalidateQueries({
						queryKey,
					});
					setIsEditing(false);
					return "Task updated successfully";
				},
				error: "An error occurred while updating task",
			}
		);
	};

	const handleDeleteTask = async () => {
		toast.dismiss();
		toast.loading("Deleting task...");

		try {
			const res = await fetch("/api/tasks/removeTask", {
				method: "POST",
				body: JSON.stringify({
					target_id: task.id,
				}),
			});

			if (!res.ok) {
				toast.dismiss();
				toast.error("Something went wrong");
				throw new Error("Something went wrong");
			}

			toast.dismiss();
			toast.success("Task deleted successfully");
			queryClient.invalidateQueries({
				queryKey,
			});
		} catch (error) {
			toast.dismiss();
			toast.error("Something went wrong");
			console.error(error);
		}
	};

	const handleAddEvent = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const parsed = Object.fromEntries(formData.entries());

		toast.promise(
			fetch("/api/tasks/updateTask", {
				method: "POST",
				body: JSON.stringify({
					target_id: task.id,
					content: {
						event_id: parsed.event_id,
					},
				}),
			}),
			{
				loading: "Adding task to event...",
				success: () => {
					queryClient.invalidateQueries({
						queryKey,
					});
					setIsSettingEvent(false);
					return "Task added to event successfully";
				},
				error: "An error occurred while adding task to event",
			}
		);
	};

	const handleAddComment = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const parsed = Object.fromEntries(formData.entries());
		const sp = await $$supabase.auth.getUser();

		toast.promise(
			fetch("/api/comments/createComment", {
				method: "POST",
				body: JSON.stringify({
					user_id: sp.data.user?.id,
					task_id: task.id,
					content: parsed.comment,
				}),
			}),
			{
				loading: "Adding comment...",
				success: () => {
					queryClient.invalidateQueries({
						queryKey: ["task", task.id, "comments"],
					});
					setIsCommenting(false);
					return "Comment added successfully";
				},
				error: "An error occurred while adding comment",
			}
		);
	};

	const handleOnDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.dataTransfer.setData("target_id", task.id.toString());
		console.log("dragging", task.id);
	};

	return (
		<>
			<div
				draggable
				onDragStart={handleOnDrag}
				className="flex flex-col gap-2 p-5 border rounded-md cursor-move"
			>
				<div className="flex items-center gap-2">
					<h3>{task.name}</h3>
					<div className="flex-1" />
					<span className="text-xs text-gray-500">
						{task.priority_range}
					</span>
				</div>
				<p>{task.short_description}</p>
				<p>
					Created By:{" "}
					{_createdBy.isFetched &&
						`${_createdBy.data?.first_name} ${_createdBy.data?.last_name}`}
				</p>

				{_currentEvent.isFetched && task.event_id && (
					<div>
						<p>Event set on </p>
						<p>
							{_currentEvent.isFetched &&
								_currentEvent.data?.name}
						</p>
						<div className="flex items-center gap-3">
							<p>
								{_currentEvent.isFetched &&
									dayjs(
										_currentEvent.data?.starting_date
									).format("MMM DD, YYYY")}
							</p>
							<ArrowRightIcon size={16} />
							<p>
								{_currentEvent.isFetched &&
									dayjs(
										_currentEvent.data?.ending_date
									).format("MMM DD, YYYY")}
							</p>
						</div>
					</div>
				)}

				<div className="mt-5 flex justify-between gap-2">
					<Button
						onClick={() => setIsCommenting(true)}
						variant="ghost"
						className="space-x-2"
					>
						<MessageSquare size={16} />
						<span>Add Comment</span>
					</Button>
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
							<DropdownMenuItem
								onClick={() => setIsSettingEvent(true)}
								className="space-x-2"
							>
								<CalendarIcon size={16} />
								<span>Set Event</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => setIsEditing(true)}
								className="space-x-2"
							>
								<Edit2Icon size={16} />
								<span>Edit Task</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setIsDeleting(true)}
								className="space-x-2 text-destructive"
							>
								<Trash2Icon size={16} />
								<span>Remove Task</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<Drawer.Root open={isCommenting} onOpenChange={setIsCommenting}>
				<Drawer.Portal>
					<Drawer.Content className="fixed bg-background rounded-t-xl pt-5 pb-10 px-5 bottom-0 left-0 w-full h-[90vh] z-[45] ">
						<div className="h-1 w-16 bg-foreground rounded-full mx-auto mb-5" />
						<ScrollArea className="flex flex-col gap-3 w-full max-w-5xl mx-auto overflow-y-auto max-h-[83vh] pb-10">
							<h3>Comments on {task.name}</h3>
							<div className="flex flex-col gap-2 mt-4">
								{_comments.isFetched && (
									<>
										{_comments.data?.map((comment) => (
											<CommentCard
												comment={comment}
												key={`comment_${comment.id}`}
											/>
										))}
									</>
								)}
							</div>

							<form onSubmit={handleAddComment} className="mt-10">
								<label>
									<span>Add Comment</span>
									<Textarea
										name="comment"
										rows={5}
										required
										placeholder="Type in your comment here"
									/>
								</label>
								<Button className="mt-5">Add Comment</Button>
							</form>
						</ScrollArea>
					</Drawer.Content>
					<Drawer.Overlay className="fixed bg-secondary/80 z-[40] top-0 left-0 w-full h-screen" />
				</Drawer.Portal>
			</Drawer.Root>

			<Dialog open={isSettingEvent} onOpenChange={setIsSettingEvent}>
				<DialogContent>
					<DialogHeader className="font-bold text-xl">
						Add to Event
					</DialogHeader>
					<DialogDescription>
						Select an event to add this task to.
					</DialogDescription>
					<form
						onSubmit={handleAddEvent}
						className="flex flex-col gap-2"
					>
						<label>
							<span>Event</span>
							<Select name="event_id">
								<SelectTrigger>
									<SelectValue placeholder="Select Event" />
								</SelectTrigger>
								<SelectContent>
									{_events.isFetched && (
										<>
											{_events.data?.map((event) => (
												<SelectItem
													value={event.id}
													key={`event_${task.id}_${event.id}`}
												>
													{event.name}
												</SelectItem>
											))}
										</>
									)}
								</SelectContent>
							</Select>
						</label>
						<Button className="mt-5">Update Task</Button>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={isEditing} onOpenChange={setIsEditing}>
				<DialogContent>
					<DialogHeader className="font-bold text-xl">
						Edit Task
					</DialogHeader>
					<DialogDescription>
						Please fill in the form below to edit the task. Leave a
						field blank if you don&apos;t want to change it.
					</DialogDescription>
					<form
						onSubmit={handleUpdateTask}
						className="flex flex-col gap-2"
					>
						<label>
							<span>Task Name</span>
							<Input
								type="text"
								placeholder="Enter Task Name here"
								name="name"
							/>
						</label>
						<label>
							<span>Task Description</span>
							<Textarea
								placeholder="lorem ipsum dolor sit amet"
								name="short_description"
							/>
						</label>
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
						<label>
							<span>Status</span>
							<Select name="status">
								<SelectTrigger>
									<SelectValue placeholder="Select Task Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={TaskStatus.ONGOING}>
										Ongoing
									</SelectItem>
									<SelectItem value={TaskStatus.DONE}>
										Done
									</SelectItem>
									<SelectItem value={TaskStatus.PENDING}>
										Pending
									</SelectItem>
									<SelectItem value={TaskStatus.CANCELLED}>
										Cancelled
									</SelectItem>
									<SelectItem value={TaskStatus.DROPPED}>
										Dropped
									</SelectItem>
								</SelectContent>
							</Select>
						</label>
						<Button className="mt-5">Update Task</Button>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Do you want to remove this task?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Removing this task is irreversible. Are you sure you
							want to remove this task?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setIsDeleting(false)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteTask}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default TaskCard;
