import { parseAsInteger, parseAsString } from "nuqs/server";
import { pagination } from "@/config/constants";

export const workflowsParams = {
	page: parseAsInteger
		.withDefault(pagination.DEFAULT_PAGE)
		.withOptions({ clearOnDefault: true }),
	pageSize: parseAsInteger
		.withDefault(pagination.DEFAULT_PAGE_SIZE)
		.withOptions({ clearOnDefault: true }),
	search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
