#!/usr/bin/env node
/**
 * Clawd Code Plugin — CLI entry
 * @openclawd/clawd-plugin
 */
import { runCli } from './index.js';

runCli(process.argv.slice(2));