import { logger } from "../config/winston.js";
import tf from "@tensorflow/tfjs-node";

const VIETNAMESE_STOP_WORDS = new Set([
  'và', 'của', 'cho', 'trong', 'tại', 'với', 'các', 'là', 'được', 'có',
  'những', 'về', 'này', 'đến', 'theo', 'như', 'năm', 'từ', 'ra', 'đã',
  'sẽ', 'vào', 'một', 'để', 'có thể', 'cần', 'mà', 'tới', 'lên'
]);

/**
 * Builds a TF-IDF matrix from an array of documents.
 *
 * This function processes each document by cleaning and tokenizing the text,
 * removing stop words, and calculating term frequencies. It then computes the
 * TF-IDF values for each term in the vocabulary across all documents.
 *
 * @param {string[]} documents - An array of text documents to process.
 * @returns {Object} An object containing:
 *   - `matrix`: A 2D tensor representing the TF-IDF matrix.
 *   - `vocabulary`: An array of terms included in the TF-IDF matrix.
 */


export const buildTfIdfMatrix = (documents) => {
  const cleanAndTokenize = (text) => {
    if (typeof text !== 'string') {
      logger.warn('Invalid text input:', text);
      return [];
    }

    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s\u00C0-\u1EF9]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 1 && 
        !VIETNAMESE_STOP_WORDS.has(word)
      )
      .map(word => word.trim());
  };

  const docFrequencies = new Map();
  const processedDocs = documents.map(doc => {
    const words = cleanAndTokenize(doc);
    const uniqueWords = new Set(words);
    uniqueWords.forEach(word => {
      docFrequencies.set(word, (docFrequencies.get(word) || 0) + 1);
    });
    return words;
  });

  const minDocFreq = 2; 
  const vocabulary = Array.from(docFrequencies.entries())
    .filter(([_, freq]) => freq >= minDocFreq)
    .map(([term]) => term)
    .sort();

  const tfIdfMatrix = processedDocs.map(words => {
    const termCounts = new Map();
    words.forEach(word => {
      termCounts.set(word, (termCounts.get(word) || 0) + 1);
    });

    return vocabulary.map(term => {
      const tf = termCounts.get(term) || 0;
      const df = docFrequencies.get(term);
      const idf = Math.log((documents.length + 1) / (df + 1)) + 1;
      return (tf / words.length) * idf;
    });
  });

  return {
    matrix: tf.tensor2d(tfIdfMatrix),
    vocabulary: vocabulary
  };
};