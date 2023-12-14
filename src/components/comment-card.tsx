import { CommentsRecord, Users } from "@/lib/xata";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

type CommentCardProps = {
	comment: CommentsRecord;
};

const CommentCard = ({ comment }: CommentCardProps) => {
	const _user = useQuery({
		queryKey: ["commenter", comment.task_id, comment.user_id],
		queryFn: async () => {
			const res = await fetch("/api/users/getUser", {
				method: "POST",
				body: JSON.stringify({
					id: comment.user_id,
				}),
			});
			const data = await res.json();
			return data as Users;
		},
		enabled: !!comment.user_id,
	});

	return (
		<div className="border border-secondary rounded-lg p-2 px-4 flex flex-col">
			<div className="flex items-center justify-between">
				<h6>
					{_user.data?.first_name} {_user.data?.last_name}
				</h6>
				<p>{dayjs(comment.xata?.createdAt).format("MMM DD, YYYY")}</p>
			</div>
			<p className="py-5">{comment.content}</p>
		</div>
	);
};

export default CommentCard;
