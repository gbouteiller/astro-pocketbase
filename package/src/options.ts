import { z } from "astro/zod";
import { pascalCase, snakeCase } from "es-toolkit";

const defaultOptions = {
  ignore: [],
  nameEnum: (name: string) => snakeCase(name).toUpperCase(),
  nameEnumField: (collectionName: string, fieldName: string) => `${collectionName}${pascalCase(fieldName)}`,
  nameEnumSchema: (name: string) => pascalCase(name),
  nameEnumType: (name: string) => pascalCase(name),
  nameEnumValues: (name: string) => `${name}Values`,
  nameRecordSchema: (name: string) => `${pascalCase(name)}Record`,
  nameRecordType: (name: string) => `${pascalCase(name)}Record`,
};

export const optionsSchema = z
  .object({
    ignore: z.string().array().default(defaultOptions.ignore),
    nameEnum: z
      .function(z.tuple([z.string()]), z.string())
      .optional()
      .transform((f) => f ?? defaultOptions.nameEnum),
    nameEnumField: z
      .function(z.tuple([z.string(), z.string()]), z.string())
      .optional()
      .transform((f) => f ?? defaultOptions.nameEnumField),
    nameEnumSchema: z
      .function(z.tuple([z.string()]), z.string())
      .optional()
      .transform((f) => f ?? defaultOptions.nameEnumSchema),
    nameEnumType: z
      .function(z.tuple([z.string()]), z.string())
      .optional()
      .transform((f) => f ?? defaultOptions.nameEnumType),
    nameEnumValues: z
      .function(z.tuple([z.string()]), z.string())
      .optional()
      .transform((f) => f ?? defaultOptions.nameEnumValues),
    nameRecordSchema: z
      .function(z.tuple([z.string()]), z.string())
      .optional()
      .transform((f) => f ?? defaultOptions.nameRecordSchema),
    nameRecordType: z
      .function(z.tuple([z.string()]), z.string())
      .optional()
      .transform((f) => f ?? defaultOptions.nameRecordType),
  })
  .default(defaultOptions);

export type Options = z.infer<typeof optionsSchema>;
