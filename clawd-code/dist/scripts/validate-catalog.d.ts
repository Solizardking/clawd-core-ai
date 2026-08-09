#!/usr/bin/env node
/**
 * Validates the product catalog for correctness.
 *
 * Checks:
 * 1. Every mcpTools entry exists in the action registry
 * 2. Every referenceFile exists on disk
 * 3. Every docKey exists in DOCS_INDEX
 * 4. Every minimumPlan is a valid key in PLAN_RANK and HELIUS_PLANS
 * 5. Plan-feature compatibility (Laserstream mainnet → business+, Enhanced WebSockets → developer+)
 * 6. No empty mcpTools arrays
 */
export {};
