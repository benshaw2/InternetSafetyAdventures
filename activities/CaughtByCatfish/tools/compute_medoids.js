import fs from "fs";
import path from "path";
import * as tf from "@tensorflow/tfjs-node";
import * as use from "@tensorflow-models/universal-sentence-encoder";

const INPUT = "assets/data/child_input_augmented_bank.json";
const OUT_DIR = "assets/data/";
const MODEL_PATH = "assets/models/use_model/"; // ✅ same as browser version

function cosineDistance(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return 1 - dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// Simple, lightweight k-medoids (PAM-style)
function kMedoids(vectors, k, maxIter = 30) {
  const n = vectors.length;
  if (n <= k) return [...Array(n).keys()];
  const medoids = [];
  while (medoids.length < k) {
    const i = Math.floor(Math.random() * n);
    if (!medoids.includes(i)) medoids.push(i);
  }

  let assignments = new Array(n).fill(0);
  let changed = true;
  for (let iter = 0; iter < maxIter && changed; iter++) {
    changed = false;
    // Assign each vector to nearest medoid
    for (let i = 0; i < n; i++) {
      let best = 0, bestD = Infinity;
      for (let m = 0; m < k; m++) {
        const d = cosineDistance(vectors[i], vectors[medoids[m]]);
        if (d < bestD) { bestD = d; best = m; }
      }
      if (assignments[i] !== best) { assignments[i] = best; changed = true; }
    }

    // Update medoids
    for (let m = 0; m < k; m++) {
      const cluster = assignments.map((a, i) => (a === m ? i : -1)).filter(i => i >= 0);
      if (cluster.length === 0) continue;
      let best = medoids[m];
      let bestSum = Infinity;
      for (const i of cluster) {
        const sum = cluster.reduce((acc, j) => acc + cosineDistance(vectors[i], vectors[j]), 0);
        if (sum < bestSum) { bestSum = sum; best = i; }
      }
      medoids[m] = best;
    }
    console.log(`  ↻ Iteration ${iter + 1} complete`);
  }
  return medoids;
}

(async () => {
  console.log("📂 Loading augmented dataset...");
  const raw = JSON.parse(fs.readFileSync(INPUT, "utf8"));
  console.log(`✅ Loaded ${raw.length} entries`);

  console.log("🚀 Loading Universal Sentence Encoder from local model...");
  const modelURL = `file://${path.resolve(MODEL_PATH, "model.json")}`; // ✅ Local
  const model = await use.load(modelURL);
  console.log("✅ Model loaded from", modelURL);

  const labelKeys = ["intent", "type", "risk", "style"];
  for (const key of labelKeys) {
    console.log(`\n🧠 Computing medoids for ${key}...`);
    const grouped = {};
    for (const row of raw) {
      const label = row[key];
      const text = row.variant || row.template;
      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(text);
    }

    const results = {};
    for (const [label, texts] of Object.entries(grouped)) {
      const n = texts.length;
      if (n === 0) continue;
      const k = Math.max(1, Math.round(Math.sqrt(n)));
      console.log(`→ ${label}: ${n} samples → ${k} medoids`);

      // Compute embeddings in small batches to save RAM
      const arr = [];
      const batchSize = 100;
      for (let i = 0; i < n; i += batchSize) {
        const slice = texts.slice(i, i + batchSize);
        const emb = await model.embed(slice);
        const eArr = await emb.array();
        arr.push(...eArr);
        emb.dispose();
        if ((i / n) * 100 % 10 < 1) console.log(`   progress: ${Math.round((i / n) * 100)}%`);
        await tf.nextFrame();
      }

      const medoidIdxs = kMedoids(arr, k);
      const centroids = medoidIdxs.map(i => arr[i]);
      results[label] = centroids;
      await tf.nextFrame();
    }

    const outPath = `${OUT_DIR}/centroids_${key}.json`;
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`✅ Saved medoids for ${key} → ${outPath}`);
  }

  console.log("\n🎉 All centroid files computed.");
})();

