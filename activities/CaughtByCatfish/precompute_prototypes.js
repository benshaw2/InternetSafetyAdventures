/**
 * precompute_prototypes.js
 *
 * Node.js script to generate precomputed catfisher embeddings and intent centroids.
 * Saves `catfisher_prototypes.json` for use in the browser.
 *
 * Usage: node precompute_prototypes.js
 */

const use = require('@tensorflow-models/universal-sentence-encoder');
const tf = require('@tensorflow/tfjs-node'); // Node.js backend
const fs = require('fs');

// Load catfisher response bank JSON
const responseBank = require('./assets/data/catfisher_responses.json');

// Output path
const OUTPUT_FILE = './assets/data/catfisher_prototypes.json';

/**
 * Compute the centroid (mean vector) of an array of tensors.
 * Returns a plain array.
 */
function computeCentroid(tensorArray) {
  return tf.stack(tensorArray).mean(0).arraySync();
}

/**
 * Main processing function
 */
async function main() {
  console.log('Loading Universal Sentence Encoder...');
  const model = await use.load();
  console.log('Model loaded.');

  const prototypes = {};

  for (const [intent, sentences] of Object.entries(responseBank)) {
    console.log(`Processing intent: ${intent} (${sentences.length} sentences)`);

    // Embed each sentence
    const embeddings = await model.embed(sentences);
    const tensorArray = [];
    const embedArray = embeddings.arraySync(); // shape: [num_sentences, 512]

    // Push each embedding as a tf.tensor1d
    for (let i = 0; i < embedArray.length; i++) {
      tensorArray.push(tf.tensor1d(embedArray[i]));
    }

    // Compute centroid
    const centroid = computeCentroid(tensorArray);
    prototypes[intent] = {
      centroid,
      embeddings: embedArray // optional: save individual sentence embeddings if desired
    };

    // Dispose tensors to free memory
    embeddings.dispose();
    tensorArray.forEach(t => t.dispose());
  }

  // Save prototypes to JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(prototypes, null, 2));
  console.log(`Precomputed prototypes saved to ${OUTPUT_FILE}`);
}

main().catch(err => console.error(err));

