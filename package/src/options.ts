import { z } from "astro/zod";
import { pascalCase, snakeCase } from "es-toolkit";

const defaultOptions = {
  cacheDuration: "1d",
  ignore: [],
  nameEnum: (name: string) => snakeCase(name).toUpperCase(),
  nameEnumField: (collectionName: string, fieldName: string) => `${collectionName}${pascalCase(fieldName)}`,
  nameEnumSchema: (name: string) => pascalCase(name),
  nameEnumType: (name: string) => pascalCase(name),
  nameEnumValues: (name: string) => `${name}Values`,
  nameRecordSchema: (name: string) => `${pascalCase(name)}Model`,
  nameRecordType: (name: string) => `${pascalCase(name)}Model`,
};

export const optionsSchema = z
  .object({
    cacheDuration: z.string().default(defaultOptions.cacheDuration),
    ignore: z.string().array().default(defaultOptions.ignore),
    nameEnum: z.function().args(z.string()).returns(z.string()).default(defaultOptions.nameEnum),
    nameEnumField: z.function().args(z.string(), z.string()).returns(z.string()).default(defaultOptions.nameEnumField),
    nameEnumSchema: z.function().args(z.string()).returns(z.string()).default(defaultOptions.nameEnumSchema),
    nameEnumType: z.function().args(z.string()).returns(z.string()).default(defaultOptions.nameEnumType),
    nameEnumValues: z.function().args(z.string()).returns(z.string()).default(defaultOptions.nameEnumValues),
    nameRecordSchema: z.function().args(z.string()).returns(z.string()).default(defaultOptions.nameRecordSchema),
    nameRecordType: z.function().args(z.string()).returns(z.string()).default(defaultOptions.nameRecordType),
  })
  .optional()
  .default(defaultOptions);

export type Options = z.infer<typeof optionsSchema>;
