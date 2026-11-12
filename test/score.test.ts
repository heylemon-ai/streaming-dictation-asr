import assert from "node:assert/strict";
import { test } from "node:test";
import { align, formattedTokens, normalize, scoreClip, tokens } from "../src/score";

test("normalize drops case, apostrophes and punctuation", () => {
	assert.equal(normalize("Don't stop, U.S. team!", "en"), "dont stop us team");
});

test("numbers are not normalized", () => {
	assert.equal(scoreClip("seven days", "7 days", "en").headline.errors, 1);
});

test("traditional and simplified Chinese score the same", () => {
	assert.equal(scoreClip("开始", "開始", "zh").headline.errors, 0);
});

test("arabic spelling variants are folded", () => {
	assert.equal(scoreClip("السيارة على المبنى", "السياره علي المبني", "ar").headline.errors, 0);
	assert.equal(scoreClip("أحمد", "احمد", "ar").headline.errors, 0);
});

test("mixed error rate counts a Latin run as one token", () => {
	assert.deepEqual(tokens("摩尔多瓦 Moldova", "zh", "mer"), ["摩", "尔", "多", "瓦", "moldova"]);
});

test("alignment splits substitutions, deletions and insertions", () => {
	const s = align(["a", "b", "c"], ["a", "x", "c", "d"]);
	assert.deepEqual([s.sub, s.del, s.ins, s.errors], [1, 0, 1, 2]);
});

test("formatted scoring counts punctuation and case", () => {
	assert.deepEqual(formattedTokens("Don't sit, stand.", "en"), ["Don't", "sit", ",", "stand", "."]);
	const s = scoreClip("Don't sit, stand.", "don't sit stand", "en");
	assert.equal(s.headline.errors, 0);
	assert.ok(s.formatted.errors >= 3);
});

test("formatted tokens keep dots inside words", () => {
	assert.deepEqual(formattedTokens("Open example.ai now.", "en"), ["Open", "example.ai", "now", "."]);
});
