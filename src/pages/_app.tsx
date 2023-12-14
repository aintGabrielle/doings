import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navbar from "@/components/navbar";
import NextThemeProvider from "@/components/next-theme-provider";
import { $$hasUser } from "@/lib/stores";
import $$supabase from "@/lib/supabase";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Toaster } from "sonner";

const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
	const checkUser = async () => {
		const { data } = await $$supabase.auth.getUser();

		if (data.user?.id) {
			$$hasUser.set(true);
		}
	};

	useEffect(() => {
		checkUser();
	}, []);

	return (
		<NextThemeProvider>
			<QueryClientProvider client={client}>
				<div className="flex justify-center px-4 lg:px-0">
					<div className="w-full max-w-5xl">
						<Navbar />
						<Component {...pageProps} />
						<Toaster
							duration={2000}
							position="bottom-right"
							closeButton
						/>
					</div>
				</div>

				<ReactQueryDevtools />
			</QueryClientProvider>
		</NextThemeProvider>
	);
}
