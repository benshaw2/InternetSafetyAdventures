// compute_centroids_lite.js
import * as fs from "fs";
import * as use from "@tensorflow-models/universal-sentence-encoder";
import * as tf from "@tensorflow/tfjs-node";

// Load response bank (same JSON used in app)
const responseBank = JSON.parse(fs.readFileSync("assets/data/catfisher_responses.json", "utf8"));

function cosineSimilarity(a, b) {
  const dot = a.reduce((s, x, i) => s + x * b[i], 0);
  const norm = v => Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return dot / (norm(a) * norm(b));
}

(async () => {
  console.log("Loading USE Lite model...");
  const model = await use.load(); // defaults to Lite version in Node.js

  const centroids = {};

  for (const [intent, responses] of Object.entries(responseBank)) {
    console.log(`Embedding intent: ${intent} (${responses.length} examples)`);

    const embeddings = await model.embed(responses);
    const arr = await embeddings.array();
    embeddings.dispose();

    // Compute mean centroid
    const centroid = new Array(arr[0].length).fill(0);
    for (const vec of arr) {
      for (let i = 0; i < vec.length; i++) centroid[i] += vec[i];
    }
    for (let i = 0; i < centroid.length; i++) centroid[i] /= arr.length;

    centroids[intent] = { centroid };
  }

  const outPath = "assets/data/catfisher_prototypes.json";
  fs.writeFileSync(outPath, JSON.stringify(centroids, null, 2));
  console.log(`✅ Saved USE Lite centroids to ${outPath}`);
})();

