import * as fs from "fs";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import * as tf from "@tensorflow/tfjs-node";

// Load child input dataset
const inputData = JSON.parse(fs.readFileSync("child_input_augmented_bank.json", "utf8"));

// Configuration: number of medoids per class
const config = {
  intent: { count: 8 },
  type: { count: 11 },
  risk: { count: 16 }
};

// Group inputs by axis and label
function groupByAxis(data, axis) {
  const grouped = {};
  for (const entry of data) {
    const label = entry[axis];
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(entry.text);
  }
  return grouped;
}

// Select k medoids using greedy minimization of pairwise distance
async function selectMedoids(texts, k, model) {
  const embeddings = await model.embed(texts);
  const vectors = await embeddings.array();
  embeddings.dispose();

  const distances = (a, b) => {
    const dot = a.reduce((s, x, i) => s + x * b[i], 0);
    const norm = v => Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    return 1 - dot / (norm(a) * norm(b));
  };

  const n = vectors.length;
  const medoids = [];
  const used = new Set();

  while (medoids.length < Math.min(k, n)) {
    let bestIndex = -1;
    let bestScore = Infinity;

    for (let i = 0; i < n; i++) {
      if (used.has(i)) continue;
      let score = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) score += distances(vectors[i], vectors[j]);
      }
      if (score < bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    used.add(bestIndex);
    medoids.push({ text: texts[bestIndex], embedding: vectors[bestIndex] });
  }

  return medoids;
}

// Main execution
(async () => {
  console.log("Loading USE Lite model...");
  const model = await use.load();

  for (const axis of ["intent", "type", "risk"]) {
    console.log(`Processing axis: ${axis}`);
    const grouped = groupByAxis(inputData, axis);
    const centroidList = [];

    for (const [label, texts] of Object.entries(grouped)) {
      console.log(`  Clustering label: ${label} (${texts.length} samples)`);
      const medoids = await selectMedoids(texts, config[axis].count, model);
      medoids.forEach((m, i) => {
        centroidList.push({
          label,
          centroid_index: i,
          text: m.text,
          embedding: m.embedding
        });
      });
    }

    const outPath = `${axis}_centroids.json`;
    fs.writeFileSync(outPath, JSON.stringify(centroidList, null, 2));
    console.log(`✅ Saved ${centroidList.length} centroids to ${outPath}`);
  }
})();
