import { Menu, MoonIcon } from "lucide-react";
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

import { $$hasUser } from "@/lib/stores";
import $$supabase from "@/lib/supabase";
import { useStore } from "@nanostores/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import { Drawer } from "vaul";
import { Toggle } from "./ui/toggle";

const Navbar = () => {
	const { setTheme } = useTheme();
	const [isSigningOut, setIsSigningOut] = useState(false);
	const _hasUser = useStore($$hasUser);
	const router = useRouter();

	const handleSignOut = async () => {
		toast.dismiss();
		toast.loading("Signing out...");

		try {
			await $$supabase.auth.signOut();

			toast.dismiss();
			toast.success("Signed out successfully!");
			$$hasUser.set(false);
			setIsSigningOut(false);
			router.push("/");
		} catch (error) {
			toast.dismiss();
			toast.error("Something went wrong!");
			console.error(error);
		}
	};

	return (
		<>
			<nav className="flex items-center justify-between py-5 bg-background sticky top-0 z-10">
				<div className="flex items-center gap-2">
					<h2 className="text-lg font-bold">DOINGS</h2>
				</div>
				<div className="md:flex items-center gap-2 hidden">
					<Link
						href="/"
						className={buttonVariants({
							variant: "link",
						})}
					>
						Home
					</Link>
					{!_hasUser && (
						<>
							<Link
								href="/login"
								className={buttonVariants({
									variant: "link",
								})}
							>
								Login
							</Link>
							<Link
								href="/register"
								className={buttonVariants({
									variant: "default",
								})}
							>
								Register
							</Link>
						</>
					)}
					{_hasUser && (
						<>
							<Link
								href="/projects"
								className={buttonVariants({ variant: "link" })}
							>
								Projects
							</Link>
							<Link
								href="/events"
								className={buttonVariants({
									variant: "link",
								})}
							>
								Events
							</Link>
							<Button
								onClick={() => setIsSigningOut(true)}
								variant="destructive"
							>
								Sign out
							</Button>
						</>
					)}
					<Toggle
						onPressedChange={(pressed) =>
							setTheme(pressed ? "dark" : "light")
						}
					>
						<MoonIcon size={18} />
					</Toggle>
				</div>
				{/* <div className="md:hidden">
					<SignedIn>
						<UserButton afterSignOutUrl="/" />
					</SignedIn>
				</div> */}
			</nav>

			<div className="md:hidden fixed bottom-0 left-0 py-5 flex justify-center w-full z-50">
				<Drawer.Root>
					<Drawer.Trigger asChild>
						<Button size="icon">
							<Menu size={18} />
						</Button>
					</Drawer.Trigger>
					<Drawer.Portal>
						<Drawer.Content className="fixed bg-background rounded-t-xl pt-5 pb-10 px-5 bottom-0 w-full z-[51]">
							<div className="h-1 w-16 bg-foreground rounded-full mx-auto mb-5" />
							<div className="flex flex-col gap-3">
								<Link
									href="/"
									className={buttonVariants({
										variant: "ghost",
									})}
								>
									Home
								</Link>
								{!_hasUser && (
									<>
										<Link
											href="/login"
											className={buttonVariants({
												variant: "ghost",
											})}
										>
											Login
										</Link>
										<Link
											href="/register"
											className={buttonVariants({
												variant: "default",
											})}
										>
											Register
										</Link>
									</>
								)}
								{_hasUser && (
									<>
										<Link
											href="/projects"
											className={buttonVariants({
												variant: "link",
											})}
										>
											Projects
										</Link>
										<Link
											href="/events"
											className={buttonVariants({
												variant: "link",
											})}
										>
											Events
										</Link>
									</>
								)}
								<Toggle
									onPressedChange={(pressed) =>
										setTheme(pressed ? "dark" : "light")
									}
									className="space-x-2"
								>
									<MoonIcon size={18} />
									<span>Toggle Theme</span>
								</Toggle>
							</div>
						</Drawer.Content>
						<Drawer.Overlay className="fixed h-screen w-full bg-black/90 inset-0 z-50" />
					</Drawer.Portal>
				</Drawer.Root>
			</div>

			<AlertDialog open={isSigningOut} onOpenChange={setIsSigningOut}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to sign out?
						</AlertDialogTitle>
						<AlertDialogDescription>
							You will be redirected to the home page. You can
							sign in again later.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleSignOut}>
							Sign out
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default Navbar;
