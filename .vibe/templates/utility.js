// Utility Template
// SOLID Principles: Single Responsibility
// Security: Input validation, no side effects

/**
 * Utility function for {{utilityName}}
 * @param {Object} params - Input parameters
 * @returns {Object} - Result
 */
export function {{utilityName}}(params) {
  // Validate input
  if (!params) {
    throw new Error('Invalid input: params is required');
  }

  // Implement logic here
  return { success: true };
}