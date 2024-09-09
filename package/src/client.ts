import Pocketbase from "pocketbase";

let pocketbase: Pocketbase;

export async function getPocketbase(env: ImportMetaEnv | NodeJS.ProcessEnv) {
	if (!pocketbase) {
		const { ASTRO_POCKETBASE_ADMIN_EMAIL: email, ASTRO_POCKETBASE_ADMIN_PASSWORD: password, PUBLIC_ASTRO_POCKETBASE_URL: url } = env;
		if (!email || !password || !url) throw new Error("undefined env variables");
		pocketbase = new Pocketbase(url);
		await pocketbase.admins.authWithPassword(email, password);
	}
	return pocketbase;
}
