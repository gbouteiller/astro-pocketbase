import type { AstroPocketbase } from "pocketbase:astro";

declare global {
	namespace App {
		interface Locals {
			pocketbase: AstroPocketbase;
		}
	}
}

export {};
