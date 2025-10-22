// classifier.js
// Classifies user input using USE embeddings and centroid matching

let model = null;
let intentCentroids = {};
let typeCentroids = {};
let riskCentroids = {};
let styleCentroids = {};

// Load centroids from JSON files
async function loadCentroids() {
  const [intentRes, typeRes, riskRes, styleRes] = await Promise.all([
    fetch('assets/data/centroids_intent.json').then(res => res.json()),
    fetch('assets/data/centroids_type.json').then(res => res.json()),
    fetch('assets/data/centroids_risk.json').then(res => res.json()),
    fetch('assets/data/centroids_style.json').then(res => res.json())
  ]);
  intentCentroids = intentRes;
  typeCentroids = typeRes;
  riskCentroids = riskRes;
  styleCentroids = styleRes;
}

/**
 * Load the USE model once
 */
async function loadModel() {
  if (!model) {
    model = await window.universalSentenceEncoder.load();
  }
  return model;
}

/**
 * Compute cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}

/**
 * Find the closest label from a centroid map
 */
function classifyWithCentroids(embedding, centroids) {
  let bestLabel = null;
  let bestScore = -Infinity;

  for (const label in centroids) {
    const centroid = centroids[label];
    const score = cosineSimilarity(embedding, centroid);
    if (score > bestScore) {
      bestScore = score;
      bestLabel = label;
    }
  }

  return bestLabel;
}

/**
 * Main classification function
 */
async function classifyInput(text) {
  if (!model) await loadModel();
  if (!Object.keys(intentCentroids).length) await loadCentroids();

  const embeddings = await model.embed([text]);
  const embedding = embeddings.arraySync()[0];

  return {
    intent: classifyWithCentroids(embedding, intentCentroids),
    type: classifyWithCentroids(embedding, typeCentroids),
    risk: classifyWithCentroids(embedding, riskCentroids),
    style: classifyWithCentroids(embedding, styleCentroids)
  };
}

// Expose globally
window.classifyInput = classifyInput;
