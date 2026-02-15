"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const httpRequestSchema = z.object({
	variableName: z
		.string()
		.min(1, { message: "Variable name is required" })
		.regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
			message:
				"Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
		}),
	endpoint: z.url({ message: "Please enter a valid endpoint" }),
	method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
	body: z.string().optional(),
});

export type HttpRequestFormValues = z.infer<typeof httpRequestSchema>;

interface HttpRequestDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: z.infer<typeof httpRequestSchema>) => void;
	defaultValues?: Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = ({
	open,
	onOpenChange,
	onSubmit,
	defaultValues = {},
}: HttpRequestDialogProps) => {
	const form = useForm<z.infer<typeof httpRequestSchema>>({
		defaultValues: {
			variableName: defaultValues.variableName || "myApiCall",
			endpoint: defaultValues.endpoint || "",
			method: defaultValues.method || "GET",
			body: defaultValues.body || "",
		},
		resolver: zodResolver(httpRequestSchema),
	});

	useEffect(() => {
		if (open) {
			form.reset({
				variableName: defaultValues.variableName || "myApiCall",
				endpoint: defaultValues.endpoint || "",
				method: defaultValues.method || "GET",
				body: defaultValues.body || "",
			});
		}
	}, [open, defaultValues, form]);

	const watchMethod = form.watch("method");
	const watchVariableName = form.watch("variableName");
	const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

	const handleSubmit = (values: z.infer<typeof httpRequestSchema>) => {
		onSubmit(values);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>HTTP Request</DialogTitle>
					<DialogDescription>
						Configure settings for the HTTP Request node.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-8 mt-4"
					>
						<FormField
							control={form.control}
							name="variableName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Variable Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											aria-invalid={!!form.formState.errors.endpoint}
											placeholder="myApiCall"
										/>
									</FormControl>
									<FormDescription>
										Use this variable to reference the result in other nodes:{" "}
										{`{{${watchVariableName}.httpResponse.data}}`}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="method"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Method</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select a method" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="GET">GET</SelectItem>
											<SelectItem value="POST">POST</SelectItem>
											<SelectItem value="PUT">PUT</SelectItem>
											<SelectItem value="DELETE">DELETE</SelectItem>
											<SelectItem value="PATCH">PATCH</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										The HTTP method to use for this request.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="endpoint"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Endpoint URL</FormLabel>
									<FormControl>
										<Input
											{...field}
											aria-invalid={!!form.formState.errors.endpoint}
											placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
										/>
									</FormControl>
									<FormDescription>
										Static URL or use {"{{variables}}"} for simple values or{" "}
										{"{{json variable"} to stringify objects.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{showBodyField && (
							<FormField
								control={form.control}
								name="body"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Request Body</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												aria-invalid={!!form.formState.errors.body}
												className="min-h-[120px] font-mono text-sm"
											/>
										</FormControl>
										<FormDescription>
											JSON with template variables. Use {"{{variables}}"}
											for simple values or {"{{json variable}}"}to stringify
											objects.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						<DialogFooter className="mt-4">
							<Button type="submit">Save</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
