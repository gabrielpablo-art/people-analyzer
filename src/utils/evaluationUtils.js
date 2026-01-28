
/**
 * Transforms evaluation data object into arrays expected by the Employee model
 * @param {Object} evalValues - Object { 'Value1': '+', 'Value2': '-' }
 * @param {Object} evalGwc - Object { 'get': 'Y', 'want': 'N', ... }
 * @param {Array} coreValues - Array of core value strings ['Value1', 'Value2']
 * @returns {Object} { values: Array, gwc: Array }
 */
export const transformEvaluationData = (evalValues, evalGwc, coreValues) => {
    // Map values to array based on coreValues order
    const valuesArray = coreValues.map(val => evalValues[val] || '');

    // Map GWC to array [Get, Want, Capacity]
    const gwcArray = [
        evalGwc['get'] || 'N',
        evalGwc['want'] || 'N',
        evalGwc['capacity'] || 'N'
    ];

    return {
        values: valuesArray,
        gwc: gwcArray
    };
};

/**
 * Calculates the employee rating based on values and GWC
 * @param {Array} values - Array of '+', '±', '-'
 * @param {Array} gwc - Array of 'Y', 'N'
 * @returns {String} 'Right Employee', 'Wrong Seat', 'Wrong Person'
 */
export const calculateRating = (values, gwc) => {
    // 1. Check Core Values (The Bar)
    // Rule: Need at least 3 '+' and NO '-' (Allowing '±')
    // This is a default implementation of "3+, 2±" roughly
    // Adjusted: If any '-', automatically Wrong Person
    // If fewer than 3 '+', Wrong Person

    const plusCount = values.filter(v => v === '+').length;
    const minusCount = values.filter(v => v === '-').length;

    const meetsValuesBar = plusCount >= 3 && minusCount === 0;

    // 2. Check GWC
    // Rule: Must be all 'Y'
    const meetsGWC = gwc.every(val => val === 'Y');

    if (meetsValuesBar && meetsGWC) {
        return 'Right Employee';
    } else if (meetsValuesBar && !meetsGWC) {
        return 'Wrong Seat';
    } else {
        return 'Wrong Person';
    }
};
