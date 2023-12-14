import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { $$hasUser } from "@/lib/stores";
import $$supabase from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { toast } from "sonner";

const LoginPage = () => {
	const router = useRouter();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const parsed = Object.fromEntries(formData.entries());

		toast.dismiss();
		toast.loading("Logging in...");

		try {
			const data = await $$supabase.auth.signInWithPassword({
				email: parsed.email as string,
				password: parsed.password as string,
			});

			if (data.error) {
				toast.dismiss();
				toast.error(data.error.message);
				return;
			}

			toast.dismiss();
			toast.success("Logged in successfully.");
			$$hasUser.set(true);
			router.push("/projects");
		} catch (error) {
			toast.error("Something went wrong, please try again.");
		}
	};

	return (
		<div className="min-h-[80vh] flex justify-center items-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Welcome to Doings</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-3"
					>
						<label>
							<span>Email</span>
							<Input
								required
								name="email"
								type="email"
								placeholder="juancarlos@email.com"
							/>
						</label>
						<label>
							<span>Password</span>
							<Input
								required
								name="password"
								type="password"
								placeholder="********"
							/>
						</label>

						<Button type="submit">Submit</Button>

						{/* dont have an account */}
						<div className="flex justify-center">
							<span className="text-sm">
								Don&apos;t have an account?{" "}
								<Link
									href="/register"
									className="text-accent font-bold"
								>
									Sign up
								</Link>
							</span>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginPage;
