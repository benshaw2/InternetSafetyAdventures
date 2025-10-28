class ResponseComposer {
  constructor(vagueResponses, acknowledgementPhrases, responseMatrixRaw) {
    this.vagueResponses = vagueResponses;
    this.acknowledgementPhrases = acknowledgementPhrases;
    this.responseMatrix = this.buildMatrix(responseMatrixRaw);
  }

  buildMatrix(rawArray) {
    const matrix = {};
    for (const entry of rawArray) {
      const { strategy, phase, variant } = entry;
      if (!matrix[strategy]) matrix[strategy] = {};
      if (!matrix[strategy][phase]) matrix[strategy][phase] = [];
      matrix[strategy][phase].push(variant);
    }
    return matrix;
  }

  compose({ intent, type, risk, style, phase, strategy }) {
    const parts = [];

    if (["comment", "statement"].includes(type)) {
      parts.push(this.randomChoice(this.acknowledgementPhrases));
    }

    if (type === "question" || intent === "Information Seeking") {
      const vagueCategory = this.selectVagueCategory(intent, risk);
      const vagueList = this.vagueResponses[vagueCategory];
      if (vagueList && vagueList.length > 0) {
        parts.push(this.randomChoice(vagueList));
      }
    }

    const matrixEntry = this.responseMatrix?.[strategy]?.[phase];
    if (matrixEntry && matrixEntry.length > 0) {
      parts.push(this.randomChoice(matrixEntry));
    } else {
      console.warn("No matrix entry found for:", strategy, phase);
      parts.push("Hmm, not sure what to say right now.");
    }

    return parts.join(" ");
  }

  selectVagueCategory(intent, risk) {
    if (intent === "Suspicion") return "avoidance";
    if (risk === "High Risk") return "deflection";
    if (intent === "Validation Seeking") return "general_positivity";
    if (intent === "Information Seeking") return "stalling";
    return "vagueness";
  }

  randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

window.ResponseComposer = ResponseComposer;
