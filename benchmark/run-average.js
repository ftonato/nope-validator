#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');

const runs = 10;
const names = ['nopeSync', 'yupSync', 'yupAsync'];
const data = Object.fromEntries(names.map((n) => [n, { ops: [], variance: [] }]));

for (let i = 1; i <= runs; i++) {
  process.stderr.write(`Run ${i}/${runs}...\n`);
  const out = execSync('npm start 2>&1', {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });

  for (const name of names) {
    const re = new RegExp(`${name}:\\s*\\n\\s*([\\d ]+) ops/s, ±([\\d.]+)%`, 'm');
    const m = out.match(re);
    if (!m) {
      throw new Error(`Failed to parse ${name} on run ${i}`);
    }
    data[name].ops.push(parseInt(m[1].replace(/\s/g, ''), 10));
    data[name].variance.push(parseFloat(m[2]));
  }
}

function avg(arr) {
  return arr.reduce((s, x) => s + x, 0) / arr.length;
}

function fmtOps(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const avgOps = Object.fromEntries(names.map((n) => [n, avg(data[n].ops)]));
const avgVariance = Object.fromEntries(names.map((n) => [n, avg(data[n].variance)]));
const fastest = 'nopeSync';
const slowest = 'yupAsync';

const lines = names.map((name) => {
  const pctSlower = ((1 - avgOps[name] / avgOps[fastest]) * 100).toFixed(2);
  const suffix =
    name === fastest
      ? ' | fastest'
      : name === slowest
        ? ` | slowest, ${pctSlower}% slower`
        : ` | ${pctSlower}% slower`;
  return `${name.padEnd(10)} ${fmtOps(avgOps[name]).padStart(9)} ops/s, ±${avgVariance[name].toFixed(2)}%${suffix}`;
});

console.log(JSON.stringify({ runs, lines, avgOps, avgVariance, data }));
