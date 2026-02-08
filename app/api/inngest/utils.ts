import toposort from "toposort";
import type { Connection, Node } from "@/drizzle/schema";

export const topologicalSort = (
	nodes: Node[],
	connections: Connection[],
): Node[] => {
	// if no connections, return the node as-is
	if (connections.length === 0) {
		return nodes;
	}

	// create edges array for toposort
	const edges: [string, string][] = connections.map((conn) => [
		conn.fromNodeId,
		conn.toNodeId,
	]);

	// add nodes with no connections as self-edges to ensure the're included
	const connectedNodeIds = new Set<string>();

	for (const conn of connections) {
		connectedNodeIds.add(conn.fromNodeId);
		connectedNodeIds.add(conn.toNodeId);
	}

	for (const node of nodes) {
		if (!connectedNodeIds.has(node.id)) {
			edges.push([node.id, node.id]);
		}
	}

	// sort the nodes
	let sortedNodeIds: string[] = [];

	try {
		sortedNodeIds = toposort(edges);
		// remove duplicates (from self-edges)
		sortedNodeIds = [...new Set(sortedNodeIds)];
	} catch (error) {
		if (error instanceof Error && error.message.includes("Cyclic")) {
			throw new Error("Workflow contains a cycle");
		}
		throw error;
	}

	// Map sorted IDs back to node objects
	const nodeMap = new Map<string, Node>(nodes.map((node) => [node.id, node]));
	// biome-ignore lint/style/noNonNullAssertion: <>
	return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
