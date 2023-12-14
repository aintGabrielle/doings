import { Button, buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Projects, Tasks } from "@/lib/xata";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

import ProtectedPage from "@/components/protected-page";
import TaskCard from "@/components/task-card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import $$supabase from "@/lib/supabase";
import { TaskStatus } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { CreateTaskDataInput } from "../api/tasks/createTask";

const ProjectPage = () => {
	const [isAddingTask, setIsAddingTask] = useState(false);
	const router = useRouter();
	const { id } = router.query;
	const queryClient = useQueryClient();

	const [_project, _tasks] = useQueries({
		queries: [
			{
				queryKey: ["projects", "self", id],
				queryFn: async () => {
					const sp = await $$supabase.auth.getUser();
					const res = await fetch("/api/projects/getProject", {
						method: "POST",
						body: JSON.stringify({
							target_id: id,
						}),
					});
					const data = await res.json();
					return data as Projects;
				},
				enabled: !!id,
			},
			{
				queryKey: ["tasks", "self", id],
				queryFn: async () => {
					const res = await fetch("/api/tasks/getTasks", {
						method: "POST",
						body: JSON.stringify({
							project_id: id,
						}),
					});
					const data = await res.json();
					return data as Tasks[];
				},
				enabled: !!id,
			},
		],
	});

	const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = new FormData(e.currentTarget);
		const parsed = Object.fromEntries(form.entries());
		const sp = await $$supabase.auth.getUser();

		toast.loading("Creating Task ...");

		try {
			const res = await fetch("/api/tasks/createTask", {
				method: "POST",
				body: JSON.stringify({
					owner_id: sp.data.user?.id,
					name: parsed.name,
					priority_range: parsed.priority_range,
					project_id: id,
					short_description: parsed.short_description,
				} as CreateTaskDataInput),
			});

			if (!res.ok) {
				toast.dismiss();
				toast.error("Failed to create task");
				return;
			}

			toast.dismiss();
			toast.success("Task Created Successfully");

			setIsAddingTask(false);
			queryClient.invalidateQueries({
				queryKey: ["tasks", "self", id],
			});
		} catch (error) {
			toast.dismiss();
			toast.error("Failed to create task");
			console.log(error);
		}
	};

	const handleOnDrop = async (
		e: React.DragEvent<HTMLDivElement>,
		new_status: TaskStatus
	) => {
		e.preventDefault();
		const taskId = e.dataTransfer.getData("target_id");

		try {
			const res = await fetch("/api/tasks/updateTask", {
				method: "POST",
				body: JSON.stringify({
					target_id: taskId,
					content: {
						status: new_status,
					},
				}),
			});

			if (!res.ok) {
				toast.dismiss();
				toast.error("Failed to update task");
				return;
			}

			toast.dismiss();
			toast.success("Task Updated Successfully");

			queryClient.invalidateQueries({
				queryKey: ["tasks", "self", id],
			});
		} catch (error) {
			toast.dismiss();
			toast.error("Failed to update task");
			console.log(error);
		}
	};

	return (
		<>
			<ProtectedPage>
				<div className="flex flex-col gap-5 pt-10 pb-10">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<Link
								href="/projects"
								className={buttonVariants({
									variant: "ghost",
									size: "icon",
								})}
							>
								<ArrowLeftIcon size={24} />
							</Link>
							<h1>
								{_project.isFetched
									? _project.data?.name
									: "Project Loading"}
							</h1>
						</div>
						<p>
							{_project.isFetched
								? _project.data?.description
								: "Project Loading"}
						</p>
					</div>
					<Separator orientation="horizontal" />
					<div className="flex gap-2 justify-end">
						<Button
							onClick={() => setIsAddingTask(true)}
							variant="outline"
						>
							Add Task
						</Button>
						<div className="flex-1" />
						{/* <Button variant="outline">Edit Project</Button>
						<Button
							variant="destructive"
							className="btn btn-primary"
						>
							Remove Project
						</Button> */}
					</div>
				</div>

				<ScrollArea className="w-full min-h-[500px] mb-16">
					<div className="flex gap-2 pb-4 w-max h-full">
						<div
							onDrop={(e) => {
								handleOnDrop(e, TaskStatus.PENDING);
							}}
							onDragOver={(e) => e.preventDefault()}
							className="w-[350px] min-h-[500px] border-border rounded-lg border-2 px-4 py-3"
						>
							<h4>Pending Tasks</h4>
							<div className="flex flex-col gap-2 mt-5">
								{_tasks.isFetched &&
									_tasks.data?.map(
										(task) =>
											task.status ===
												TaskStatus.PENDING && (
												<TaskCard
													key={task.id}
													task={task}
													queryKey={[
														"tasks",
														"self",
														id as string,
													]}
												/>
											)
									)}
							</div>
						</div>
						<div
							onDrop={(e) => {
								handleOnDrop(e, TaskStatus.ONGOING);
							}}
							onDragOver={(e) => e.preventDefault()}
							className="w-[350px] min-h-[500px] border-border rounded-lg border-2 px-4 py-3"
						>
							<h4>On-going Tasks</h4>
							<div className="flex flex-col gap-2 mt-5">
								{_tasks.isFetched &&
									_tasks.data?.map(
										(task) =>
											task.status ===
												TaskStatus.ONGOING && (
												<TaskCard
													key={task.id}
													task={task}
													queryKey={[
														"tasks",
														"self",
														id as string,
													]}
												/>
											)
									)}
							</div>
						</div>
						<div
							onDrop={(e) => {
								handleOnDrop(e, TaskStatus.DONE);
							}}
							onDragOver={(e) => e.preventDefault()}
							className="w-[350px] min-h-[500px] border-border rounded-lg border-2 px-4 py-3"
						>
							<h4>Completed Tasks</h4>
							<div className="flex flex-col gap-2 mt-5">
								{_tasks.isFetched &&
									_tasks.data?.map(
										(task) =>
											task.status === TaskStatus.DONE && (
												<TaskCard
													key={task.id}
													task={task}
													queryKey={[
														"tasks",
														"self",
														id as string,
													]}
												/>
											)
									)}
							</div>
						</div>
						<div
							onDrop={(e) => {
								handleOnDrop(e, TaskStatus.DROPPED);
							}}
							onDragOver={(e) => e.preventDefault()}
							className="w-[350px] min-h-[500px] border-border rounded-lg border-2 px-4 py-3"
						>
							<h4>Dropped Tasks</h4>
							<div className="flex flex-col gap-2 mt-5">
								{_tasks.isFetched &&
									_tasks.data?.map(
										(task) =>
											task.status ===
												TaskStatus.DROPPED && (
												<TaskCard
													key={task.id}
													task={task}
													queryKey={[
														"tasks",
														"self",
														id as string,
													]}
												/>
											)
									)}
							</div>
						</div>
						<div
							onDrop={(e) => {
								handleOnDrop(e, TaskStatus.CANCELLED);
							}}
							onDragOver={(e) => e.preventDefault()}
							className="w-[350px] min-h-[500px] border-border rounded-lg border-2 px-4 py-3"
						>
							<h4>Cancelled Tasks</h4>
							<div className="flex flex-col gap-2 mt-5">
								{_tasks.isFetched &&
									_tasks.data?.map(
										(task) =>
											task.status ===
												TaskStatus.CANCELLED && (
												<TaskCard
													key={task.id}
													task={task}
													queryKey={[
														"tasks",
														"self",
														id as string,
													]}
												/>
											)
									)}
							</div>
						</div>
					</div>

					<ScrollBar
						orientation="horizontal"
						className="mx-2 mt-64"
					/>
				</ScrollArea>

				{/* <Accordion type="multiple" className="pb-32">
					<AccordionItem value={TaskStatus.PENDING}>
						<AccordionTrigger>
							{_tasks.isFetched &&
								_tasks.data?.filter(
									(task) => task.status === TaskStatus.PENDING
								).length}{" "}
							Pending Tasks
						</AccordionTrigger>
						<AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2 p-5 pt-2">
							{_tasks.isFetched &&
								_tasks.data?.map(
									(task) =>
										task.status === TaskStatus.PENDING && (
											<TaskCard
												key={task.id}
												task={task}
												queryKey={[
													"tasks",
													"self",
													id as string,
												]}
											/>
										)
								)}
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value={TaskStatus.ONGOING}>
						<AccordionTrigger>
							{_tasks.isFetched &&
								_tasks.data?.filter(
									(task) => task.status === TaskStatus.ONGOING
								).length}{" "}
							On-going Tasks
						</AccordionTrigger>
						<AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2 p-5 pt-2">
							{_tasks.isFetched &&
								_tasks.data?.map(
									(task) =>
										task.status === TaskStatus.ONGOING && (
											<TaskCard
												key={task.id}
												task={task}
												queryKey={[
													"tasks",
													"self",
													id as string,
												]}
											/>
										)
								)}
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value={TaskStatus.DONE}>
						<AccordionTrigger>
							{" "}
							{_tasks.isFetched &&
								_tasks.data?.filter(
									(task) => task.status === TaskStatus.DONE
								).length}{" "}
							Completed Tasks
						</AccordionTrigger>
						<AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2 p-5 pt-2">
							{_tasks.isFetched &&
								_tasks.data?.map(
									(task) =>
										task.status === TaskStatus.DONE && (
											<TaskCard
												key={task.id}
												task={task}
												queryKey={[
													"tasks",
													"self",
													id as string,
												]}
											/>
										)
								)}
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value={TaskStatus.DROPPED}>
						<AccordionTrigger>
							{_tasks.isFetched &&
								_tasks.data?.filter(
									(task) => task.status === TaskStatus.DROPPED
								).length}{" "}
							Dropped Tasks
						</AccordionTrigger>
						<AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2 p-5 pt-2">
							{_tasks.isFetched &&
								_tasks.data?.map(
									(task) =>
										task.status === TaskStatus.DROPPED && (
											<TaskCard
												key={task.id}
												task={task}
												queryKey={[
													"tasks",
													"self",
													id as string,
												]}
											/>
										)
								)}
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value={TaskStatus.CANCELLED}>
						<AccordionTrigger>
							{_tasks.isFetched &&
								_tasks.data?.filter(
									(task) =>
										task.status === TaskStatus.CANCELLED
								).length}{" "}
							Cancelled Tasks
						</AccordionTrigger>
						<AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2 p-5 pt-2">
							{_tasks.isFetched &&
								_tasks.data?.map(
									(task) =>
										task.status ===
											TaskStatus.CANCELLED && (
											<TaskCard
												key={task.id}
												task={task}
												queryKey={[
													"tasks",
													"self",
													id as string,
												]}
											/>
										)
								)}
						</AccordionContent>
					</AccordionItem>
				</Accordion> */}
			</ProtectedPage>

			{/* modals */}
			<Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Task</DialogTitle>
						<DialogDescription>
							Please enter the details of the task you want to
							add.
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={handleAddTask}
						className="flex flex-col gap-2"
					>
						<label>
							<span>Task Name</span>
							<Input
								required
								name="name"
								placeholder="Some task name here"
							/>
						</label>
						<label>
							<span>Short Description</span>
							<Textarea
								rows={4}
								required
								name="short_description"
								placeholder="Some task description here"
							/>
						</label>
						<label>
							<span>Priority</span>
							<Select name="priority_range" required>
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

						<Button type="submit" className="mt-5">
							Add Task
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ProjectPage;
