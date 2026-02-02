import { requireAuth } from "@/lib/auth-utils";

interface SpecificCredentialPageProps {
	params: Promise<{ credentialId: string }>;
}

async function SpecificCredentialPage({ params }: SpecificCredentialPageProps) {
	await requireAuth();
	const { credentialId } = await params;

	return <div>CredentialId: {credentialId}</div>;
}

export default SpecificCredentialPage;
