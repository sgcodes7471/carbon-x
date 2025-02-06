pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";

template CreditCheck() {
    signal input balance;      // User's balance
    signal input credits;    // Threshold to check against
    signal output valid;       // Output: 1 if balance >= threshold, 0 otherwise

    signal diff;               // Difference: balance - threshold
    signal sign;               // Sign of diff: 0 if diff >= 0, 1 if diff < 0

    component gt = GreaterThan(252);
    gt.in[0] <== balance+1;
    gt.in[1] <== credits;
    valid <== gt.out;
}

component main = CreditCheck();