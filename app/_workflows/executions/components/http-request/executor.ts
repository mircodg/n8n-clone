import { NonRetriableError } from "inngest";
import type { Options as KyOptions } from "ky";
import ky from "ky";
import type { NodeExecutor } from "@/app/_workflows/executions/types";

type HttpRequestData = {
	endpoint?: string;
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	body?: string;
	variableName: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
	data,
	context,
	step,
}) => {
	if (!data.endpoint) {
		throw new NonRetriableError("HTTP Request node: No endpoint provided");
	}

	if (!data.variableName) {
		throw new NonRetriableError("HTTP Request node: No variable name provided");
	}

	const result = await step.run("http-request", async () => {
		// biome-ignore lint/style/noNonNullAssertion: <>
		const endpoint = data.endpoint!;
		const method = data.method || "GET";

		const options: KyOptions = { method };

		if (["POST", "PUT", "PATCH"].includes(method)) {
			options.json = data.body;
			options.headers = {
				"Content-Type": "application/json",
			};
		}

		const response = await ky(endpoint, options);
		const contentType = response.headers.get("content-type");
		const responseData = contentType?.includes("application/json")
			? await response.json()
			: await response.text();

		const responsePayload = {
			httpResponse: {
				status: response.status,
				statusText: response.statusText,
				data: responseData,
			},
		};

		return {
			...context,
			[data.variableName]: responsePayload,
		};
	});

	return result;
};
