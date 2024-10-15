import type Pocketbase from "pocketbase";
import type { RecordService } from "pocketbase";
import { z } from "zod";

/******* ENUMS *******/
export const collectionValues = [
	"config",
	"events",
	"images",
	"knowledges",
	"pages",
	"places",
	"posts",
	"products",
	"services",
	"testimonies",
] as const;
export const Collection = z.enum(collectionValues);
export type Collection = z.infer<typeof Collection>;
export const COLLECTION = Collection.enum;

export const servicesCategoryValues = [
	"consult",
	"training",
	"workshop",
] as const;
export const ServicesCategory = z.enum(servicesCategoryValues);
export type ServicesCategory = z.infer<typeof ServicesCategory>;
export const SERVICES_CATEGORY = ServicesCategory.enum;

/******* BASE *******/
export const BaseModel = z.object({
  created: z.string().pipe(z.coerce.date()),
  id: z.string(),
  updated: z.string().pipe(z.coerce.date()),
});
export type BaseModel = z.infer<typeof BaseModel>;

export const AdminModel = z.object({
  ...BaseModel.shape,
  avatar: z.string(),
  email: z.string().email(),
});
export type AdminModel = z.infer<typeof AdminModel>;

export const RecordModel = z.object({
  ...BaseModel.shape,
  collectionId: z.string(),
  collectionName: z.string(),
  expand: z.any().optional(),
});
export type RecordModel = z.infer<typeof RecordModel>;

/******* RECORDS *******/
export const ConfigRecord = z.object({
	...RecordModel.omit({ expand: true }).shape,
	collectionName: z.literal("config"),
	city: z.string(),
	email: z.string().email(),
	facebook: z.string().url(),
	instagram: z.string().url(),
	phone: z.string(),
	street: z.string(),
	title: z.string(),
	website: z.string().url(),
	zipcode: z.string(),
});
export type ConfigRecord = z.infer<typeof ConfigRecord>;

export const EventsRecord = z.object({
	...RecordModel.omit({ expand: true }).shape,
	collectionName: z.literal("events"),
	excerpt: z.string(),
	from: z.string().pipe(z.coerce.date()),
	image: z.string(),
	name: z.string(),
	places: z.string().array(),
	service: z.string(),
	slug: z.string(),
	to: z.string().pipe(z.coerce.date()),
	url: z.string().url(),
});
export type EventsRecord = z.infer<typeof EventsRecord>;

export const ImagesRecord = z.object({
	...RecordModel.omit({ expand: true }).shape,
	collectionName: z.literal("images"),
	alt: z.string(),
	height: z.number().int(),
	src: z.string(),
	width: z.number().int(),
});
export type ImagesRecord = z.infer<typeof ImagesRecord>;

export const KnowledgesRecord = z.object({
	...RecordModel.omit({ expand: true }).shape,
	collectionName: z.literal("knowledges"),
	image: z.string(),
	name: z.string(),
	slug: z.string(),
	text: z.string(),
});
export type KnowledgesRecord = z.infer<typeof KnowledgesRecord>;

export const PagesRecord = z.object({
	...RecordModel.omit({ expand: true }).shape,
	collectionName: z.literal("pages"),
	knowledge: z.string(),
	post: z.string(),
	services: z.string().array().optional(),
	slug: z.string(),
	testimoniesImage: z.string().transform((id) => id === "" ? undefined : id).optional(),
	title: z.string(),
});
export type PagesRecord = z.infer<typeof PagesRecord>;

export const PlacesRecord = z.object({
	...RecordModel.omit({ expand: true }).shape,
	collectionName: z.literal("places"),
	name: z.string(),
	slug: z.string(),
});
export type PlacesRecord = z.infer<typeof PlacesRecord>;

export const PostsRecord = z.object({
	...RecordModel.omit({ expand: true }).shape,
	collectionName: z.literal("posts"),
	excerpt: z.string(),
	image: z.string().transform((id) => id === "" ? undefined : id).optional(),
	knowledge: z.string(),
	slug: z.string(),
	text: z.string(),
	title: z.string(),
});
export type PostsRecord = z.infer<typeof PostsRecord>;

export const ProductsRecord = z.object({
	...RecordModel.omit({ expand: true }).shape,
	collectionName: z.literal("products"),
	excerpt: z.string(),
	image: z.string(),
	name: z.string(),
	price: z.string(),
	slug: z.string(),
	text: z.string(),
	url: z.string().url(),
});
export type ProductsRecord = z.infer<typeof ProductsRecord>;

export const ServicesRecord = z.object({
	...RecordModel.omit({ expand: true }).shape,
	collectionName: z.literal("services"),
	category: ServicesCategory,
	duration: z.string(),
	excerpt: z.string(),
	image: z.string(),
	knowledge: z.string(),
	name: z.string(),
	places: z.string().array(),
	price: z.string(),
	slug: z.string(),
	text: z.string(),
});
export type ServicesRecord = z.infer<typeof ServicesRecord>;

export const TestimoniesRecord = z.object({
	...RecordModel.omit({ expand: true }).shape,
	collectionName: z.literal("testimonies"),
	author: z.string(),
	text: z.string(),
	title: z.string(),
});
export type TestimoniesRecord = z.infer<typeof TestimoniesRecord>;

export const records = new Map<Collection, z.AnyZodObject>([
	["config", ConfigRecord],
	["events", EventsRecord],
	["images", ImagesRecord],
	["knowledges", KnowledgesRecord],
	["pages", PagesRecord],
	["places", PlacesRecord],
	["posts", PostsRecord],
	["products", ProductsRecord],
	["services", ServicesRecord],
	["testimonies", TestimoniesRecord],
]);

/******* CLIENT *******/
export type TypedPocketbase = Pocketbase & {
		collection(idOrName: "config"): RecordService<z.input<typeof ConfigRecord>>;
		collection(idOrName: "events"): RecordService<z.input<typeof EventsRecord>>;
		collection(idOrName: "images"): RecordService<z.input<typeof ImagesRecord>>;
		collection(idOrName: "knowledges"): RecordService<z.input<typeof KnowledgesRecord>>;
		collection(idOrName: "pages"): RecordService<z.input<typeof PagesRecord>>;
		collection(idOrName: "places"): RecordService<z.input<typeof PlacesRecord>>;
		collection(idOrName: "posts"): RecordService<z.input<typeof PostsRecord>>;
		collection(idOrName: "products"): RecordService<z.input<typeof ProductsRecord>>;
		collection(idOrName: "services"): RecordService<z.input<typeof ServicesRecord>>;
		collection(idOrName: "testimonies"): RecordService<z.input<typeof TestimoniesRecord>>;
};
