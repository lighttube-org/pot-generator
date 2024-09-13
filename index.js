const JSDOM = require("jsdom").JSDOM;
const BG = require("bgutils-js").BG;

const express = require("express");
const app = express();
const port = 3000;

async function getVisitorData(userAgent) {
	const homepage = await fetch("https://www.youtube.com/", {
		headers: {
			"User-Agent": userAgent
		}
	});
	const html = await homepage.text();
	const dom = new JSDOM(html);
	const scripts = dom.window.document.querySelectorAll("script[nonce]");
	let cfg = null;
	scripts.forEach((script) => {
		if (!script.innerHTML.includes("visitorData")) return;
		if (script.innerHTML.includes("ytInitialData")) return;
		const part = script.innerHTML.split("ytcfg.set(")[1].split(");")[0];
		cfg = JSON.parse(part);
	});
	if (cfg == null || cfg == undefined)
		throw new Error("Failed to get visitorData (failed to find ytcfg)");
	const itCtx = cfg["INNERTUBE_CONTEXT"] || {};
	const client = itCtx["client"] || {};
	const visitorData = client["visitorData"];
	if (visitorData == null)
		throw new Error(
			"Failed to get visitorData (INNERTUBE_CONTEXT did not contain visitorData)"
		);
	return visitorData;
}

async function getPoToken(cfg = {}) {
	const dom = new JSDOM();

	const requestKey = cfg.requestKey || "O43z0dpjhgX20SCx4KAo";
	let userAgent = cfg.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
	let visitorData = cfg.visitorData || (await getVisitorData(userAgent));

	Object.assign(globalThis, {
		window: dom.window,
		document: dom.window.document,
	});

	const bgConfig = {
		fetch: (url, options) => fetch(url, options),
		globalObj: globalThis,
		identifier: visitorData,
		requestKey,
	};

	const challenge = await BG.Challenge.create(bgConfig);

	if (!challenge) throw new Error("Could not get challenge");

	if (challenge.script) {
		const script = challenge.script.find((sc) => sc !== null);
		if (script) new Function(script)();
	} else {
		throw new Error("Unable to load botguard");
	}

	const poToken = await BG.PoToken.generate({
		program: challenge.challenge,
		globalName: challenge.globalName,
		bgConfig,
	});

	return {
		visitorData,
		poToken,
	};
}

app.get("/", async (req, res) => {
	res.redirect("https://github.com/lighttube-org/pot-generator")
});

app.get("/generate", async (req, res) => {
	try {
		const pot = await getPoToken(req.query);
		console.log(`Successfully generated poToken (visitorData: ${pot.visitorData}, poToken: ${pot.poToken})`);
		res.send({
			success: true,
			response: pot,
			error: null
		});
	} catch (e) {
		console.log(`Failed to generate poToken`);
		console.log(e);
		res.send({
			success: false,
			response: null,
			error: e.message
		});
	}
});

app.listen(port, () => {
	console.log(`pot-generator listening on port ${port}`);
});
