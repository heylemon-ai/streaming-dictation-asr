/**
 * Confidence intervals by bootstrap resampling.
 *
 * Resampling is by SPEAKER, not by clip: clips from one speaker are not
 * independent, so resampling clips would make intervals look tighter than they
 * are. Where a set has no speaker labels, each clip is treated as its own
 * speaker and the report says so.
 */

import type { Score } from "./score";

/** Small seeded PRNG so intervals are reproducible run to run. */
function mulberry32(seed: number) {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export type Interval = { value: number; lo: number; hi: number; speakers: number };

const quantile = (sorted: number[], q: number) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))];

function group<T>(items: T[], key: (t: T) => string): T[][] {
	const m = new Map<string, T[]>();
	for (const it of items) m.set(key(it), [...(m.get(key(it)) ?? []), it]);
	return [...m.values()];
}

const corpusRate = (groups: Score[][]) => {
	let e = 0, r = 0;
	for (const g of groups) for (const s of g) (e += s.errors), (r += s.refLen);
	return r ? e / r : 0;
};

export function bootstrapRate<T>(items: T[], speaker: (t: T) => string, score: (t: T) => Score, iterations = 2000, seed = 7): Interval {
	const groups = group(items, speaker).map((g) => g.map(score));
	const value = corpusRate(groups);
	if (groups.length < 2) return { value, lo: value, hi: value, speakers: groups.length };
	const rnd = mulberry32(seed);
	const samples: number[] = [];
	for (let b = 0; b < iterations; b++) {
		const pick: Score[][] = [];
		for (let k = 0; k < groups.length; k++) pick.push(groups[Math.floor(rnd() * groups.length)]);
		samples.push(corpusRate(pick));
	}
	samples.sort((a, b) => a - b);
	return { value, lo: quantile(samples, 0.025), hi: quantile(samples, 0.975), speakers: groups.length };
}

export type PairedResult = { diff: number; lo: number; hi: number; p: number };

/**
 * Paired comparison of two engines on the same clips: resample speakers once
 * per iteration and score both engines on the same draw. p is the two-sided
 * share of draws where the sign of the difference flips.
 */
export function pairedBootstrap<T>(
	items: T[],
	speaker: (t: T) => string,
	a: (t: T) => Score,
	b: (t: T) => Score,
	iterations = 2000,
	seed = 11,
): PairedResult {
	const groups = group(items, speaker);
	const diffOf = (gs: T[][]) => corpusRate(gs.map((g) => g.map(a))) - corpusRate(gs.map((g) => g.map(b)));
	const diff = diffOf(groups);
	if (groups.length < 2) return { diff, lo: diff, hi: diff, p: 1 };
	const rnd = mulberry32(seed);
	const samples: number[] = [];
	for (let k = 0; k < iterations; k++) {
		const pick: T[][] = [];
		for (let j = 0; j < groups.length; j++) pick.push(groups[Math.floor(rnd() * groups.length)]);
		samples.push(diffOf(pick));
	}
	samples.sort((x, y) => x - y);
	const flips = samples.filter((d) => (diff >= 0 ? d <= 0 : d >= 0)).length / samples.length;
	return { diff, lo: quantile(samples, 0.025), hi: quantile(samples, 0.975), p: Math.min(1, 2 * flips) };
}

export function percentile(values: number[], q: number): number {
	if (!values.length) return 0;
	const s = [...values].sort((a, b) => a - b);
	return s[Math.min(s.length - 1, Math.floor(q * (s.length - 1)))];
}
