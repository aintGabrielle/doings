import $$supabase from "@/lib/supabase";
import { useRouter } from "next/router";
import { useEffect } from "react";

type ProtectedPageProps = {
	children: React.ReactNode;
};

const ProtectedPage = (props: ProtectedPageProps) => {
	const router = useRouter();
	const checkUser = async () => {
		const user = await $$supabase.auth.getUser();

		if (!user.data.user?.id) {
			router.push("/login");
		}
	};

	useEffect(() => {
		checkUser();
	}, []);

	return props.children;
};

export default ProtectedPage;
