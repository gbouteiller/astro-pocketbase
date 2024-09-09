import { z } from "astro/zod";
import { pascalCase } from "es-toolkit";

const defaultOptions = {
	nameRecordSchema: (name: string) => `${pascalCase(name)}Model`,
	nameRecordType: (name: string) => `${pascalCase(name)}Model`,
};

export const optionsSchema = z
	.object({
		nameRecordSchema: z.function().args(z.string()).returns(z.string()).default(defaultOptions.nameRecordSchema),
		nameRecordType: z.function().args(z.string()).returns(z.string()).default(defaultOptions.nameRecordType),
	})
	.optional()
	.default(defaultOptions);

export type Options = z.infer<typeof optionsSchema>;
