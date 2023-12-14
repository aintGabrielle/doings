import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

import EventCard from "@/components/event-card";
import ProtectedPage from "@/components/protected-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import $$supabase from "@/lib/supabase";
import { Events } from "@/lib/xata";
import { PlusSquareIcon } from "lucide-react";
import { toast } from "sonner";

const EventPage = () => {
	const [isCreatingEvent, setIsCreatingEvent] = useState(false);
	const queryClient = useQueryClient();

	const createEvent = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const parsed = Object.fromEntries(formData.entries());

		const userData = await $$supabase.auth.getUser();
		toast.loading("Creating Event ...");

		try {
			const res = await fetch("/api/events/createEvent", {
				method: "POST",
				body: JSON.stringify({
					...parsed,
					ending_date: new Date(
						parsed.ending_date as string
					).toISOString(),
					starting_date: new Date(
						parsed.starting_date as string
					).toISOString(),
					owner_id: userData.data.user?.id,
				}),
			});

			if (res.ok) {
				toast.dismiss();
				toast.success("Event Created Successfully");

				queryClient.invalidateQueries({
					queryKey: ["events", "self", "all"],
				});
				setIsCreatingEvent(false);
			} else {
				toast.error("Something went wrong");
			}
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	const _events = useQuery({
		queryKey: ["events", "self", "all"],
		queryFn: async () => {
			const userData = await $$supabase.auth.getUser();
			const res = await fetch("/api/events/getAllEvents", {
				method: "POST",
				body: JSON.stringify({
					owner_id: userData.data.user?.id,
				}),
			});

			const data = await res.json();
			return data as Events[];
		},
		refetchInterval: 5000,
	});

	return (
		<>
			<ProtectedPage>
				<main className="flex flex-col gap-5 pt-10 pb-32">
					<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
						<h1>Events</h1>
						<div className="flex gap-2 justify-end">
							<Button
								className="space-x-2"
								onClick={() => setIsCreatingEvent(true)}
							>
								<PlusSquareIcon size={16} />
								<span>Add an Event</span>
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{_events.isFetched &&
							_events.data?.map((event) => (
								<EventCard
									event={event}
									queryKey={["events", "self", "all"]}
									key={`event-${event.id}`}
								/>
							))}
					</div>
				</main>
			</ProtectedPage>

			<>
				<Dialog
					open={isCreatingEvent}
					onOpenChange={setIsCreatingEvent}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add new Event</DialogTitle>
						</DialogHeader>

						<form
							onSubmit={createEvent}
							className="flex flex-col gap-3"
						>
							<label>
								<span>Event Name</span>
								<Input
									required
									type="text"
									name="name"
									placeholder="Project Bright Idea "
								/>
							</label>
							<label>
								<span>Short Event Description</span>
								<Textarea
									required
									rows={4}
									name="short_description"
									placeholder="A short description about the project that will be displayed on the project card"
								/>
							</label>
							<div className="flex items-center gap-2">
								<label className="flex-1">
									<span>Starting Date</span>
									<Input
										required
										name="starting_date"
										type="date"
									/>
								</label>
								<label className="flex-1">
									<span>Ending Date</span>
									<Input
										required
										name="ending_date"
										type="date"
									/>
								</label>
							</div>
							<label>
								<span>Priority</span>
								<Select name="priority_range" required>
									<SelectTrigger>
										<SelectValue placeholder="Select Priority Level" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="10">High</SelectItem>
										<SelectItem value="5">
											Medium
										</SelectItem>
										<SelectItem value="1">Low</SelectItem>
									</SelectContent>
								</Select>
							</label>

							<Button type="submit" className="mt-5">
								Create Event
							</Button>
						</form>
					</DialogContent>
				</Dialog>
			</>
		</>
	);
};

export default EventPage;
