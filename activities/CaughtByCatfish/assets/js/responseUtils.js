// responseUtils.js

let responseData = [];

// Load response matrix from JSON
async function loadResponseMatrix() {
  if (!responseData.length) {
    const res = await fetch('assets/data/response_matrix_styled.json');
    responseData = await res.json();
  }
  return responseData;
}

/**
 * Choose a response based on strategy, phase, and style.
 * Returns both the response variant and the fallback level used.
 */
function chooseResponse(strategy, phase, style, data, trackFallback = false) {
  let fallbackLevel = 0;

  // Level 0: Full match
  let options = data.filter(
    (r) => r.strategy === strategy && r.phase === phase && (!style || r.style === style)
  );

  if (options.length === 0) {
    fallbackLevel = 1;
    options = data.filter((r) => r.strategy === strategy && r.phase === phase);
  }
  if (options.length === 0) {
    fallbackLevel = 2;
    options = data.filter((r) => r.strategy === strategy);
  }
  if (options.length === 0) {
    fallbackLevel = 3;
    options = data; // absolute fallback
  }

  const pick = options[Math.floor(Math.random() * options.length)];

  return trackFallback
    ? { variant: pick.variant, fallbackLevel }
    : pick.variant;
}

// Expose globally
window.loadResponseMatrix = loadResponseMatrix;
window.chooseResponse = chooseResponse;
