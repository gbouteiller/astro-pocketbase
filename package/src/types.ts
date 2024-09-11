import { pascalCase, snakeCase, sortBy } from "es-toolkit";
import type { CollectionModel, SchemaField } from "pocketbase";
import type { Options } from "./options.ts";
import {
  getCollectionNameFromId,
  getCollectionSelectFields,
  schemaField,
  stringifyCollectionNames,
  stringifyCollectionUnion,
  type SelectField,
} from "./utils.ts";

export function stringifyTypes(collections: CollectionModel[], options: Options) {
  function stringifyEnum({ name, values }: SelectField) {
    const valuesName = `${name}Values`;
    const enumSchemaName = pascalCase(name);
    const enumName = snakeCase(name).toUpperCase();
    const valuesContent = `[${values.map((value) => `"${value}"`).join(", ")}]`;
    return `export const ${valuesName}: readonly ${valuesContent};\n\texport const ${enumSchemaName}: z.ZodEnum<${valuesContent}>;\n\texport const ${enumName}: z.Values<${valuesContent}>;`;
  }

  function stringifyRecord({ name, schema }: CollectionModel) {
    const schemaName = options.nameRecordSchema(name);
    const typeName = options.nameRecordType(name);
    const fields = sortBy(
      [
        ...schema,
        schemaField("collectionId"),
        schemaField("collectionName"),
        schemaField("created", "date"),
        schemaField("id"),
        schemaField("updated", "date"),
      ],
      ["name"],
    );
    const fieldSchemas = fields.map(stringifyFieldSchema);
    const fieldInputs = fields.map(stringifyFieldInput);
    const fieldOutputs = fields.map(stringifyFieldOutput);

    return `export const ${schemaName}: z.ZodObject<{\n\t\t${fieldSchemas.join(";\n\t\t")};\n\t},\n\t"strip",\n\tz.ZodTypeAny,\n\t{\n\t\t${fieldOutputs.join(";\n\t\t")};\n\t},\n\t{\n\t\t${fieldInputs.join(";\n\t\t")};\n\t}>;\n\texport type ${typeName} = z.infer<typeof ${schemaName}>;`;
  }

  function stringifyFieldSchema(field: SchemaField) {
    let type: string | undefined;
    if (field.type === "bool") type = "z.ZodBoolean";
    else if (field.type === "date") type = "z.ZodPipeline<z.ZodString, z.ZodDate>";
    else if (field.type === "editor") type = "z.ZodString";
    else if (field.type === "email") type = "z.ZodString";
    else if (field.type === "file") type = field.options.maxSelect === 1 ? "z.ZodString" : `z.ZodArray<z.ZodString, "many">`;
    else if (field.type === "json") type = "Z.ZodAny";
    else if (field.type === "number") type = "z.ZodNumber";
    else if (field.type === "relation") {
      const collection = getCollectionNameFromId(field.options.collectionId, collections);
      const singular = `z.ZodEffects<z.ZodString, { collection: "${collection}"; id: string; }, string>`;
      type = field.options.maxSelect === 1 ? singular : `z.ZodArray<${singular}, "many">`;
    } else if (field.type === "select") type = field.options.maxSelect === 1 ? "z.ZodString" : `z.ZodArray<z.ZodString, "many">`;
    else if (field.type === "text") type = "z.ZodString";
    else if (field.type === "url") type = "z.ZodString";
    // TODO: manage unknown field type
    return `${field.name}: ${field.required ? type : `z.ZodOptional<${type}>`}`;
  }

  function stringifyFieldInput(field: SchemaField) {
    let type: string | undefined;
    if (field.type === "bool") type = "boolean";
    else if (field.type === "date") type = "string";
    else if (field.type === "editor") type = "string";
    else if (field.type === "email") type = "string";
    else if (field.type === "file") type = field.options.maxSelect === 1 ? "string" : "string[]";
    else if (field.type === "json") type = "any";
    else if (field.type === "number") type = "number";
    else if (field.type === "relation") type = field.options.maxSelect === 1 ? "string" : "string[]";
    else if (field.type === "select") type = field.options.maxSelect === 1 ? "z.ZodString" : `z.ZodArray<z.ZodString, "many">`;
    else if (field.type === "text") type = "string";
    else if (field.type === "url") type = "string";
    // TODO: manage unknown field type
    return `${field.name}${field.required ? `: ${type}` : `?: ${type} | undefined`}`;
  }

  function stringifyFieldOutput(field: SchemaField) {
    let type: string | undefined;
    if (field.type === "date") type = "Date";
    if (field.type === "relation") {
      const collection = getCollectionNameFromId(field.options.collectionId, collections);
      const singular = `{ collection: "${collection}"; id: string; }`;
      type = field.options.maxSelect === 1 ? singular : `${singular}[]`;
    } else return stringifyFieldInput(field);
    return `${field.name}${field.required ? `: ${type}` : `?: ${type} | undefined`}`;
  }

  function stringifyService({ name }: CollectionModel) {
    return `\t\tcollection(idOrName: "${name}"): RecordService<z.input<typeof ${options.nameRecordSchema(name)}>>;`;
  }

  return {
    collectionsUnion: stringifyCollectionUnion(collections),
    collectionNames: stringifyCollectionNames(collections),
    enums: getCollectionSelectFields(collections).map(stringifyEnum).join("\n\n\t"),
    records: `${collections.map(stringifyRecord).join("\n\n\t")}`,
    services: collections.map(stringifyService).join("\n"),
  };
}
