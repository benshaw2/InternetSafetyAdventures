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
/*async function loadModel() {
  if (!model) {
    if (!window.loadUSELite) {
      // wait for the module wrapper to execute
      let attempts = 0;
      while (!window.loadUSELite && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }
      if (!window.loadUSELite) {
        throw new Error("❌ USE loader not available — check script order or file path.");
      }
    }

    model = await window.loadUSELite();
    console.log("✅ USE Lite model loaded.");
  }
  return model;
}*/

// Load USE Lite model from local path
async function loadModel() {
  if (!model) {
    if (!window.use) {
      // wait for USE library to be available
      let attempts = 0;
      while (!window.use && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }
      if (!window.use) {
        throw new Error("❌ USE library not loaded — check script order or file path.");
      }
    }

    model = await window.use.load({
      modelUrl: 'assets/models/use_model/model.json'
    });
    //console.log("✅ USE Lite model loaded.");
  }
  return model;
}

// Example usage in classifier
/*async function classifyInput(text) {
  if (!model) await loadModel();

  const embeddings = await model.embed([text]);
  const embedding = embeddings.arraySync()[0];

  // Your centroid classification logic here...
  return embedding;
}*/

// Expose globally
//window.classifyInput = classifyInput;




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
  //if (!Object.keys(intentCentroids).length) await loadCentroids();

  const embeddings = await model.embed([text]);
  //const array = embeddings.arraySync();   // immediate conversion
  //console.log(array[0]);                   // first embedding
  if (!Object.keys(intentCentroids).length) await loadCentroids();
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
