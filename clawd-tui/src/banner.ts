const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RED = '\x1b[38;5;203m';
const ORANGE = '\x1b[38;5;215m';
const PURPLE = '\x1b[38;5;141m';

const LOGO = `
  ██████╗██╗      █████╗ ██╗    ██╗██████╗
 ██╔════╝██║     ██╔══██╗██║    ██║██╔══██╗
 ██║     ██║     ███████║██║ █╗ ██║██║  ██║
 ██║     ██║     ██╔══██║██║███╗██║██║  ██║
 ╚██████╗███████╗██║  ██║╚███╔███╔╝██████╔╝
  ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═════╝`;

export function printBanner(model: string, variant: 'clawd' | 'dark-clawd' = 'clawd'): void {
  const accent = variant === 'dark-clawd' ? PURPLE : RED;
  const title = variant === 'dark-clawd' ? 'DARK-CLAWD' : 'CLAWD';
  const tagline =
    variant === 'dark-clawd'
      ? 'shadow terminal for serious code work'
      : 'claws that code, brains that deploy';

  console.log(accent + BOLD + LOGO + RESET);
  console.log(`  ${ORANGE}${title}${RESET} ${DIM}${tagline}${RESET}`);
  console.log(`  ${DIM}model${RESET}  ${ORANGE}${model}${RESET}\n`);
}
