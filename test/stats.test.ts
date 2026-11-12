import assert from "node:assert/strict";
import { test } from "node:test";
import type { Score } from "../src/score";
import { bootstrapRate, pairedBootstrap } from "../src/stats";

const s = (errors: number, refLen: number): Score => ({ errors, refLen, sub: errors, del: 0, ins: 0, hypLen: refLen });

test("bootstrap interval contains the point estimate and is reproducible", () => {
	const items = Array.from({ length: 20 }, (_, i) => ({ spk: `s${i % 5}`, sc: s(i % 3, 10) }));
	const a = bootstrapRate(items, (x) => x.spk, (x) => x.sc);
	const b = bootstrapRate(items, (x) => x.spk, (x) => x.sc);
	assert.ok(a.lo <= a.value && a.value <= a.hi);
	assert.deepEqual(a, b);
	assert.equal(a.speakers, 5);
});

test("one speaker gives no interval", () => {
	const i = bootstrapRate([{ sc: s(1, 10) }, { sc: s(2, 10) }], () => "only", (x) => x.sc);
	assert.equal(i.lo, i.hi);
});

test("paired bootstrap detects a consistent difference", () => {
	const items = Array.from({ length: 30 }, (_, i) => ({ spk: `s${i}`, a: s(3, 10), b: s(1, 10) }));
	const r = pairedBootstrap(items, (x) => x.spk, (x) => x.a, (x) => x.b);
	assert.ok(Math.abs(r.diff - 0.2) < 1e-9);
	assert.ok(r.p < 0.05);
});
