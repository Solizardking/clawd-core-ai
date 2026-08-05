/**
 * Terminal Tool - Command execution for agents
 * Execute shell commands and capture output
 */

import { spawn, ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";

export interface CommandResult {
  code: number;
  stdout: string;
  stderr: string;
  duration: number;
}

export interface TerminalConfig {
  /** Default working directory */
  cwd?: string;
  /** Environment variables */
  env?: Record<string, string>;
  /** Default timeout in ms */
  timeout?: number;
  /** Use shell for commands */
  shell?: boolean;
  /** Allowed commands (whitelist) */
  allowedCommands?: string[];
  /** Blocked commands (blacklist) */
  blockedCommands?: string[];
}

const DEFAULT_BLOCKED_COMMANDS = [
  "rm -rf /",
  "rm -rf /*",
  "dd if=",
  "mkfs",
  "> /dev/sda",
  ":(){ :|:& };:",
  "shutdown",
  "reboot",
  "halt",
  "poweroff",
];

export class TerminalTool extends EventEmitter {
  private config: TerminalConfig;
  private runningProcesses: Map<string, ChildProcess> = new Map();

  constructor(config: TerminalConfig = {}) {
    super();
    this.config = {
      cwd: process.cwd(),
      timeout: 60000,
      shell: true,
      blockedCommands: DEFAULT_BLOCKED_COMMANDS,
      ...config,
    };
  }

  /**
   * Check if a command is allowed
   */
  private isAllowed(command: string): boolean {
    const cmd = command.toLowerCase().trim();

    // Check blocklist
    for (const blocked of this.config.blockedCommands ?? []) {
      if (cmd.includes(blocked.toLowerCase())) {
        return false;
      }
    }

    // Check allowlist if configured
    if (this.config.allowedCommands && this.config.allowedCommands.length > 0) {
      const firstWord = cmd.split(/\s+/)[0];
      return this.config.allowedCommands.some(
        (allowed) => firstWord === allowed.toLowerCase()
      );
    }

    return true;
  }

  /**
   * Run a command and return the result
   */
  async run(
    command: string,
    options: {
      args?: string[];
      cwd?: string;
      timeout?: number;
      env?: Record<string, string>;
    } = {}
  ): Promise<CommandResult> {
    const fullCommand = options.args
      ? `${command} ${options.args.join(" ")}`
      : command;

    if (!this.isAllowed(fullCommand)) {
      return {
        code: 1,
        stdout: "",
        stderr: `Command blocked for security: ${command}`,
        duration: 0,
      };
    }

    const startTime = Date.now();

    return new Promise((resolve) => {
      const processId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const childProcess = spawn(command, options.args ?? [], {
        cwd: options.cwd ?? this.config.cwd,
        shell: this.config.shell,
        env: {
          ...process.env,
          ...this.config.env,
          ...options.env,
        },
      });

      this.runningProcesses.set(processId, childProcess);

      let stdout = "";
      let stderr = "";
      let timedOut = false;

      const timeout = options.timeout ?? this.config.timeout;
      const timeoutId = timeout
        ? setTimeout(() => {
            timedOut = true;
            childProcess.kill("SIGTERM");
          }, timeout)
        : null;

      childProcess.stdout?.on("data", (data) => {
        const chunk = data.toString();
        stdout += chunk;
        this.emit("stdout", { processId, data: chunk });
      });

      childProcess.stderr?.on("data", (data) => {
        const chunk = data.toString();
        stderr += chunk;
        this.emit("stderr", { processId, data: chunk });
      });

      childProcess.on("close", (code) => {
        if (timeoutId) clearTimeout(timeoutId);
        this.runningProcesses.delete(processId);

        const duration = Date.now() - startTime;

        if (timedOut) {
          stderr += "\nProcess timed out and was terminated.";
        }

        this.emit("close", { processId, code, duration });

        resolve({
          code: code ?? 0,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          duration,
        });
      });

      childProcess.on("error", (error) => {
        if (timeoutId) clearTimeout(timeoutId);
        this.runningProcesses.delete(processId);

        resolve({
          code: 1,
          stdout: "",
          stderr: error.message,
          duration: Date.now() - startTime,
        });
      });
    });
  }

  /**
   * Run multiple commands in sequence
   */
  async runSequence(
    commands: string[],
    options: { cwd?: string; stopOnError?: boolean } = {}
  ): Promise<CommandResult[]> {
    const results: CommandResult[] = [];

    for (const command of commands) {
      const result = await this.run(command, { cwd: options.cwd });
      results.push(result);

      if (options.stopOnError && result.code !== 0) {
        break;
      }
    }

    return results;
  }

  /**
   * Run a command and stream output
   */
  stream(
    command: string,
    options: {
      args?: string[];
      cwd?: string;
      onStdout?: (data: string) => void;
      onStderr?: (data: string) => void;
    } = {}
  ): { processId: string; kill: () => void } {
    const processId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (!this.isAllowed(command)) {
      options.onStderr?.(`Command blocked for security: ${command}`);
      return { processId, kill: () => {} };
    }

    const childProcess = spawn(command, options.args ?? [], {
      cwd: options.cwd ?? this.config.cwd,
      shell: this.config.shell,
      env: { ...process.env, ...this.config.env },
    });

    this.runningProcesses.set(processId, childProcess);

    childProcess.stdout?.on("data", (data) => {
      options.onStdout?.(data.toString());
    });

    childProcess.stderr?.on("data", (data) => {
      options.onStderr?.(data.toString());
    });

    childProcess.on("close", () => {
      this.runningProcesses.delete(processId);
    });

    return {
      processId,
      kill: () => {
        childProcess.kill("SIGTERM");
        this.runningProcesses.delete(processId);
      },
    };
  }

  /**
   * Kill a running process
   */
  kill(processId: string): boolean {
    const process = this.runningProcesses.get(processId);
    if (process) {
      process.kill("SIGTERM");
      this.runningProcesses.delete(processId);
      return true;
    }
    return false;
  }

  /**
   * Kill all running processes
   */
  killAll(): void {
    for (const [id, process] of this.runningProcesses) {
      process.kill("SIGTERM");
      this.runningProcesses.delete(id);
    }
  }

  /**
   * Get count of running processes
   */
  getRunningCount(): number {
    return this.runningProcesses.size;
  }

  /**
   * Update configuration
   */
  configure(config: Partial<TerminalConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
