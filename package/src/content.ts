import { sortBy } from "es-toolkit";
import type { CollectionModel, SchemaField } from "pocketbase";
import type { Options } from "./options.ts";
import { getCollectionNameFromId, getCollectionSelectFields, stringifyCollectionNames, type SelectField } from "./utils.ts";

export function stringifyContent(collections: CollectionModel[], options: Options) {
  function stringifyEnum({ name, values }: SelectField) {
    const valuesName = options.nameEnumValues(name);
    const schemaName = options.nameEnumSchema(name);
    const enumName = options.nameEnum(name);
    return `export const ${valuesName} = [\n\t${values.map((value) => `"${value}"`).join(",\n\t")},\n];\nexport const ${schemaName} = z.enum(${valuesName});\nexport const ${enumName} = ${schemaName}.enum;`;
  }

  function stringifyRecord({ name, schema }: CollectionModel) {
    const schemaName = options.nameRecordSchema(name);
    const fields = sortBy(schema, ["name"]).map((field) => stringifyField(field, name));
    return `export const ${schemaName} = z.object({\n\t...RecordModel.omit({ expand: true }).shape,\n\t${fields.join(",\n\t")}\n});`;
  }

  function stringifyField(field: SchemaField, collectionName: string) {
    let schema: string | undefined;
    if (field.type === "bool") schema = stringifyBoolField(field);
    else if (field.type === "date") schema = stringifyDateField(field);
    else if (field.type === "editor") schema = stringifyEditorField(field);
    else if (field.type === "email") schema = stringifyEmailField(field);
    else if (field.type === "file") schema = stringifyFileField(field);
    else if (field.type === "json") schema = stringifyJsonField(field);
    else if (field.type === "number") schema = stringifyNumberField(field);
    else if (field.type === "relation") schema = stringifyRelationField(field);
    else if (field.type === "select") schema = stringifySelectField(field, collectionName);
    else if (field.type === "text") schema = stringifyTextField(field);
    else if (field.type === "url") schema = stringifyUrlField(field);
    // TODO: manage unknown field type
    return `${field.name}: ${schema}${field.required ? "" : ".optional()"}`;
  }

  function stringifyBoolField(_: SchemaField) {
    return "z.boolean()";
  }

  function stringifyDateField(_field: SchemaField) {
    // TODO: implement min and max
    return "z.string().pipe(z.coerce.date())";
  }

  function stringifyEditorField(_field: SchemaField) {
    // TODO: implement convertUrls
    return "z.string()";
  }

  function stringifyEmailField(_field: SchemaField) {
    // TODO: implement exceptDomains and onlyDomains
    return "z.string().email()";
  }

  function stringifyFileField({ options: { maxSelect } }: SchemaField) {
    // TODO: implement maxSize, mimeTypes, protected, thumbs
    return `z.string()${maxSelect === 1 ? "" : `.array().max(${maxSelect})`}`;
  }

  function stringifyJsonField(_field: SchemaField) {
    // TODO: implement maxSize and json schema
    return "z.any()";
  }

  function stringifyNumberField({ options: { max, min, noDecimal } }: SchemaField) {
    return `z.number()${noDecimal ? ".int()" : ""}${min ? `.min(${min})` : ""}${max ? `.max(${max})` : ""}`;
  }

  function stringifyRelationField({ options }: SchemaField) {
    const { collectionId, maxSelect, minSelect } = options;
    // TODO: implement cascadeDelete, displayFields
    const collection = getCollectionNameFromId(collectionId, collections);
    const min = minSelect ? `.min(${minSelect})` : "";
    const max = maxSelect ? `.max(${maxSelect})` : "";
    const multiple = maxSelect === 1 ? "" : `.array()${min}${max}`;
    return `z.string().transform((id) => { return id !== "" ? { collection: "${collection}", id } : undefined })${multiple}`;
  }

  function stringifySelectField({ name, options: { maxSelect } }: SchemaField, collectionName: string) {
    // TODO: implement values
    return `${options.nameEnumSchema(options.nameEnumField(collectionName, name))}${maxSelect === 1 ? "" : `.array().max(${maxSelect})`}`;
  }

  function stringifyTextField({ options: { max, min } }: SchemaField) {
    // TODO: implement pattern
    return `z.string()${min ? `.min(${min})` : ""}${max ? `.max(${max})` : ""}`;
  }

  function stringifyUrlField(_field: SchemaField) {
    // TODO: implement exceptDomains and onlyDomains
    return "z.string().url()";
  }

  function stringifySchemasEntry({ name }: CollectionModel) {
    return `["${name}", ${options.nameRecordSchema(name)}]`;
  }

  return {
    collectionNames: stringifyCollectionNames(collections),
    enums: getCollectionSelectFields(collections, options).map(stringifyEnum).join("\n\n"),
    records: `${collections.map(stringifyRecord).join("\n\n")}\n\nexport const records = new Map([\n\t${collections.map(stringifySchemasEntry).join(",\n\t")},\n]);`,
  };
}
