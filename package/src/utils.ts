import { pascalCase, sortBy } from "es-toolkit";
import type { CollectionModel, SchemaField } from "pocketbase";
import { getPocketbase } from "./client.js";

export function schemaField(name: string, type = "text"): SchemaField {
	return { id: "", name, options: {}, presentable: false, required: true, system: true, type };
}

export async function fetchSortedCollections(): Promise<{ data: CollectionModel[]; error: undefined } | { data: undefined; error: Error }> {
	try {
		const pocketbase = await getPocketbase(process.env);
		const collections = await pocketbase.collections.getFullList();
		return { data: sortBy(collections, ["name"]), error: undefined };
	} catch (error) {
		return { data: undefined, error: error instanceof Error ? error : new Error("unknown error") };
	}
}

export function getCollectionNameFromId(id: string, collections: CollectionModel[]) {
	return collections.find((collection) => collection.id === id)?.name;
}

export function getCollectionNames(collections: CollectionModel[]) {
	return collections.map(({ name }) => `"${name}"`);
}

export function getCollectionSelectFields(collections: CollectionModel[]) {
	return collections.flatMap((collection) =>
		collection.schema
			.filter((field) => field.type === "select")
			.map((field) => ({ name: `${collection.name}${pascalCase(field.name)}`, values: (field.options.values ?? []) as string[] })),
	);
}

export function stringifyCollectionNames(collections: CollectionModel[]) {
	return `[${getCollectionNames(collections).join(", ")}]`;
}

export function stringifyCollectionUnion(collections: CollectionModel[]) {
	return getCollectionNames(collections).join(" | ");
}

export type SelectField = { name: string; values: string[] };
