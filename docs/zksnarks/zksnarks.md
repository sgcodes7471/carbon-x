# ZK-SNARKs Integration for EnergyChain

## Introduction
ZK-SNARKs (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge) is a cryptographic protocol that enables one party (the prover) to prove knowledge of a statement to another party (the verifier) without revealing any additional information beyond the truth of the statement itself.

### Features of ZK-SNARK Proofs:
- **Zero-Knowledge**: The verifier learns only that the statement is true, without any extra details.
- **Succinct**: Proofs are short and can be verified quickly.
- **Non-Interactive**: No back-and-forth communication is required between the prover and verifier.
- **Argument of Knowledge**: Ensures that the prover possesses the claimed knowledge.

The implementation involves encoding quadratic constraints into polynomials, ensuring privacy by utilizing a secret point unknown to the verifier. The verifier checks that the polynomial, created from the prover's key (`zkey`), matches the verification key (`verification_key`), both of which are generated in a trusted setup ceremony known as the "Perpetual Power of Tau."

## Problem Statement
Transaction and IoT spending data contain highly sensitive information about both private and public companies, including cash flow patterns and ongoing projects. Public exposure of this data could lead to market vulnerabilities such as stock price fluctuations.

Additionally, current carbon credit trading systems, such as **EU ETS**, suffer from arbitrary allocations determined by officials. Eliminating human intervention through automation ensures a free and fair marketplace, leading to reduced emissions and optimized resource distribution.

## ZK-SNARKs Implementation Plan

### System Architecture
ZK-SNARKs will be employed to:
- Verify whether a client has sufficient carbon credits to list a quote.
- Ensure that post-purchase credit holdings remain below **150%** of the initial allocation, preventing stockpiling and ensuring market stability.
- Guarantee that a client's balance never falls into negative values.

### Smart Contract Integration
- A smart contract function validates the generated proof against the corresponding key pair.
- An alternative approach involves verifying the proof via a separate verification smart contract (more gas-intensive but highly secure).
- Key pairs are stored on **IPFS** to maintain immutability and prevent tampering.

### Energy Trading Workflow
1. When the **list** button is clicked, the system verifies that the user has sufficient credits via a **pre-generated WASM file** and `zkey`.
2. This proof is validated using the `verification_key` (currently implemented off-chain).
3. If verified, **public signals** are passed on-chain and used within the smart contract function.
4. This mechanism ensures:
  - Proof generation remains confidential.
  - Transactions occur without revealing the actual credit balance of clients.

## Technical Implementation

### Signal Circuit Implementation

The signal circuit is designed using Circom files, ensuring the use of only quadratic constraints. The greater-than constraint is implemented as follows:

```circom
component gt = GreaterThan(252);
gt.in[0] <== balance + 1; // Using +1 to enforce a strict greater-than condition
gt.in[1] <== credits; // Ensuring credits remain an integer value
valid <== gt.out;
```

Next the perpetual power of TAU generated using the `r1cs` file compiled from Circom. The proof verification process is executed using the PTAU verification key and the `zkey` file.

Additionally, an optional `verifier.sol` smart contract can be generated to enable on-chain verification.

### Proof Generation and Verification with SnarkJS

The proof generation is carried out using `snarkjs`. The process involves compiling the circuit, generating witness data, and verifying proofs.

#### **Proof Generation**
```javascript
const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input, wasmfile, zkeyfile // Retrieve these files from IPFS
);
```
#### **Proof Verification**
```javascript
const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
```
## Security & Scalability Considerations

### Security Mechanisms
- **Immutable Storage**: `wasm`, `zkey_file`, and `vkey_file` are stored on **IPFS** to ensure they remain tamper-proof.
- **IoT Data Retrieval**: Before any transaction execution, the latest carbon credit data is fetched from IoT devices.
- **Privacy-Preserving Transactions**: Since sensitive data (such as carbon credit balances) remains off-chain and undecrypted, privacy is assured.

### Scalability Enhancements
- **Gas Optimization**: Off-chain proof verification significantly reduces on-chain computation costs, making the solution scalable.
- **Efficient Proof Generation**: Since blockchain-based computation is resource-intensive, off-chain processing optimizes transaction times and improves overall system efficiency.


