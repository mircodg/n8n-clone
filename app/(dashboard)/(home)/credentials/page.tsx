import { requireAuth } from "@/lib/auth-utils";

async function CredentialsPage() {
	await requireAuth();
	return <div>CredentialsPage</div>;
}

export default CredentialsPage;
