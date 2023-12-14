import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { $$hasUser } from "@/lib/stores";
import $$supabase from "@/lib/supabase";
import { Separator } from "@radix-ui/react-separator";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { toast } from "sonner";
import { RegistrationDataInput } from "./api/auth/create_user";

const RegisterPage = () => {
	const router = useRouter();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const parsed = Object.fromEntries(formData.entries());

		toast.dismiss();
		toast.loading("Creating account...");

		// disable form and button
		const form = e.currentTarget;
		const inputs = form.querySelectorAll("input");
		const button = form.querySelector("button");
		button?.setAttribute("disabled", "true");
		inputs.forEach((input) => input.setAttribute("disabled", "true"));

		try {
			const data = await $$supabase.auth.signUp({
				email: parsed.email as string,
				password: parsed.password as string,
				options: {
					data: {
						first_name: parsed.first_name as string,
						last_name: parsed.last_name as string,
						phone: parsed.phone as string,
						birthday: parsed.birthday as string,
					},
				},
			});
			if (data.data) {
				toast.dismiss();
				toast.loading("Appending user data...");
				const res = await fetch("/api/auth/create_user", {
					method: "POST",
					body: JSON.stringify({
						birthday: new Date(parsed.birthday as string),
						email: parsed.email as string,
						first_name: parsed.first_name as string,
						last_name: parsed.last_name as string,
						phone: parsed.phone as string,
						user_id: data.data.user?.id,
					} as RegistrationDataInput),
				});

				if (res.ok) {
					toast.dismiss();
					toast.success("Account created successfully!");
					toast("Please check your email for the verification link.");

					$$hasUser.set(true);
					router.push("/");
				} else {
					toast.dismiss();
					toast.error("Something went wrong. Please try again.");
					return;
				}
			} else {
				toast.dismiss();
				toast.error("Something went wrong. Please try again.");

				button?.setAttribute("disabled", "false");
				inputs.forEach((input) =>
					input.setAttribute("disabled", "false")
				);
				return;
			}
		} catch (error) {
			toast.dismiss();
			toast.error("Something went wrong. Please try again.");

			button?.setAttribute("disabled", "false");
			inputs.forEach((input) => input.setAttribute("disabled", "false"));
			return;
		}
	};

	return (
		<div className="min-h-[80vh] flex justify-center items-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Register to Doings</CardTitle>
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
								pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
								title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
							/>
						</label>
						<Separator orientation="horizontal" />
						<div className="flex gap-2">
							<label className="flex-1">
								<span>First Name</span>
								<Input
									required
									name="first_name"
									type="text"
									placeholder="Juan"
								/>
							</label>
							<label className="flex-1">
								<span>Last Name</span>
								<Input
									required
									name="last_name"
									type="text"
									placeholder="Juan"
								/>
							</label>
						</div>
						<div>
							<span>Phone Number</span>
							<div className="flex items-center gap-2">
								<p>+63</p>
								<Input
									required
									name="phone"
									type="number"
									maxLength={10}
									placeholder="9123456789"
								/>
							</div>
						</div>
						<label className="flex-1">
							<span>Birthday</span>
							<Input required name="birthday" type="date" />
						</label>

						<Button type="submit" className="mt-5">
							Submit
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default RegisterPage;
