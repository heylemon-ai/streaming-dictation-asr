import assert from "node:assert/strict";
import { test } from "node:test";
import { scoreHalves, verdictOf } from "../src/codeswitch";

const parts = [
	{ set: "en-dictation", clip: "a", language: "en", reference: "please send the report by friday" },
	{ set: "de-de", clip: "b", language: "de", reference: "das wetter ist heute sehr schön" },
];

test("both halves heard", () => {
	const h = scoreHalves(parts, "Please send the report by Friday. Das Wetter ist heute sehr schön.");
	assert.deepEqual(h.map(verdictOf), ["came through", "came through"]);
});

test("a dropped half is missing", () => {
	const h = scoreHalves(parts, "Please send the report by Friday.");
	assert.deepEqual(h.map(verdictOf), ["came through", "missing"]);
});

test("a translated half is replaced", () => {
	const h = scoreHalves(parts, "Please send the report by Friday. The weather is very nice today.");
	assert.equal(verdictOf(h[1]), "replaced");
});
