pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";

template CreditCheck() {
    signal input balance;      // User's balance
    signal input limit;        // Credit limit
    signal input creditBuy;    // Amount to buy on credit
    signal output valid;       // Output: 1 if balance + creditBuy <= maxLimit, 0 otherwise

    // Compute maxLimit as 1.5 * limit using integer arithmetic (avoid fractional multipliers)
    signal maxLimit;
    maxLimit <== limit + limit / 2;

    // Check if balance + creditBuy <= maxLimit
    component gt = GreaterThan(252);
    gt.in[0] <== balance + creditBuy;
    gt.in[1] <== maxLimit;

    // If gt.out is 0, it means balance + creditBuy <= maxLimit, so valid = 1
    valid <== 1 - gt.out;
}

component main = CreditCheck();
