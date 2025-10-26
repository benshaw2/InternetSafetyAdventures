/**
 * Compute medoid centroids for each label category (intent, type, risk, style)
 * using locally cached TensorFlow.js and Universal Sentence Encoder libraries.
 *
 * To run:
 *   1. Serve your repo locally (e.g., `python3 -m http.server`).
 *   2. Open http://localhost:8000/tools/compute_medoids_browser.html in your browser.
 *   3. Centroid files will be offered for download as JSON.
 *
 * Requirements:
 *   - assets/libs/tf.min.js
 *   - assets/libs/universal-sentence-encoder.min.js
 *   - assets/data/child_input_augmented_bank.json
 */

(async () => {
  // Load USE model
  console.log("🚀 Loading USE model from local assets...");
  const model = await use.load("assets/models/use_model/");
  console.log("✅ Model loaded.");

  // Load dataset
  const data = await fetch("../assets/data/child_input_augmented_bank.json").then(r => r.json());
  console.log(`📘 Loaded ${data.length} augmented samples.`);

  // ---- Helper functions ----
  const cosineDistance = (a, b) => {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    return 1 - dot / (Math.sqrt(na) * Math.sqrt(nb));
  };

  // Simple k-medoids (PAM-lite) for smallish datasets
  function kMedoids(data, k) {
    const n = data.length;
    if (n <= k) return [...Array(n).keys()];
    const medoids = [];
    while (medoids.length < k) {
      const idx = Math.floor(Math.random() * n);
      if (!medoids.includes(idx)) medoids.push(idx);
    }
    let changed = true;
    let assignments = new Array(n).fill(0);
    while (changed) {
      changed = false;
      // assign points
      for (let i = 0; i < n; i++) {
        let best = 0, bestDist = Infinity;
        for (let m = 0; m < k; m++) {
          const d = cosineDistance(data[i], data[medoids[m]]);
          if (d < bestDist) {
            bestDist = d;
            best = m;
          }
        }
        if (assignments[i] !== best) {
          assignments[i] = best;
          changed = true;
        }
      }
      // update medoids
      for (let m = 0; m < k; m++) {
        const clusterIdxs = assignments
          .map((a, i) => (a === m ? i : -1))
          .filter(i => i >= 0);
        if (clusterIdxs.length === 0) continue;
        let bestMedoid = medoids[m];
        let bestSum = Infinity;
        for (const i of clusterIdxs) {
          const sum = clusterIdxs.reduce(
            (acc, j) => acc + cosineDistance(data[i], data[j]),
            0
          );
          if (sum < bestSum) {
            bestSum = sum;
            bestMedoid = i;
          }
        }
        medoids[m] = bestMedoid;
      }
    }
    return medoids;
  }

  async function compute(labelKey) {
    console.log(`\n🧠 Computing medoids for ${labelKey}...`);
    const byLabel = {};
    for (const s of data) {
      const label = s[labelKey];
      if (!byLabel[label]) byLabel[label] = [];
      const text = s.variant?.trim() || s.template?.trim();
      if (text) byLabel[label].push(text);
    }

    const allCentroids = {};

    for (const [label, texts] of Object.entries(byLabel)) {
      if (texts.length === 0) continue;
      const n = texts.length;
      const k = Math.max(1, Math.round(Math.sqrt(n)));

      console.log(`→ Label "${label}": ${n} samples → ${k} medoids`);

      const embeddings = await model.embed(texts);
      const arr = await embeddings.array();
      embeddings.dispose();

      const medoidIdxs = kMedoids(arr, k);
      const centroids = medoidIdxs.map(i => arr[i]);
      allCentroids[label] = centroids;
    }

    const blob = new Blob([JSON.stringify(allCentroids, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `centroids_${labelKey}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    console.log(`✅ Saved ${labelKey} centroids.`);
  }

  for (const key of ["intent", "type", "risk", "style"]) {
    await compute(key);
  }

  console.log("\n🎉 All centroid files downloaded!");
})();

