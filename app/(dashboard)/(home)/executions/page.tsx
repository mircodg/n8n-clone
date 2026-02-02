import { requireAuth } from "@/lib/auth-utils";

async function ExecutionsPage() {
	await requireAuth();
	return <div>ExecutionsPage</div>;
}

export default ExecutionsPage;
