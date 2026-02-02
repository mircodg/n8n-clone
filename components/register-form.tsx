"use client";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
	FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Zod schema used for client-side validation
const formSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export function RegisterForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const router = useRouter();

	async function onSubmit(data: z.infer<typeof formSchema>) {
		await authClient.signUp.email(
			{
				name: data.email,
				email: data.email,
				password: data.password,
				callbackURL: "/",
			},
			{
				onSuccess: () => {
					router.push("/");
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
			},
		);
	}

	const isPending = form.formState.isSubmitting;

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<Link
							href="/"
							className="flex flex-col items-center gap-2 font-medium"
						>
							<div className="flex size-8 items-center justify-center rounded-md">
								<Image
									src="/logov2.svg"
									alt="Flowie AI"
									width={32}
									height={32}
								/>
							</div>
							<span className="sr-only">Flowie AI</span>
						</Link>
						<h1 className="text-xl font-bold">Welcome to Flowie AI.</h1>
						<FieldDescription>
							Already have an account? <Link href="/login">Login</Link>
						</FieldDescription>
					</div>
					<Controller
						name="email"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Email</FieldLabel>
								<Input
									{...field}
									id={field.name}
									type="email"
									aria-invalid={fieldState.invalid}
									placeholder="jondoe@flowieai.com"
									autoComplete="email"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="password"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Password</FieldLabel>
								<Input
									{...field}
									id={field.name}
									type="password"
									placeholder="********"
									aria-invalid={fieldState.invalid}
									autoComplete="new-password"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Field>
						<Button type="submit" disabled={isPending}>
							{isPending ? (
								<div className="flex items-center">
									<LoaderCircle className="size-4 animate-spin" />
								</div>
							) : (
								"Register"
							)}
						</Button>
					</Field>
					<FieldSeparator>Or</FieldSeparator>
					<Field className="grid gap-4 sm:grid-cols-2">
						<Button variant="outline" type="button" disabled={isPending}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="lucide lucide-github-icon lucide-github"
							>
								<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
								<path d="M9 18c-4.51 2-5-2-7-2" />
							</svg>
							Continue with Github
						</Button>
						<Button variant="outline" type="button" disabled={isPending}>
							<svg
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 48 48"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								style={{ display: "block" }}
							>
								<path
									fill="#EA4335"
									d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
								></path>
								<path
									fill="#4285F4"
									d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
								></path>
								<path
									fill="#FBBC05"
									d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
								></path>
								<path
									fill="#34A853"
									d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
								></path>
								<path fill="none" d="M0 0h48v48H0z"></path>
							</svg>
							Continue with Google
						</Button>
					</Field>
				</FieldGroup>
			</form>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
				and <a href="#">Privacy Policy</a>.
			</FieldDescription>
		</div>
	);
}
