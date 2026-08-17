/**
 * 🦞 ClawdRouter — Web UI
 * Connect a Solana wallet (Phantom injected), view balances, top up,
 * subscribe monthly, or pay per use with $CLAWD / SOL / USDC.
 *
 * Uses `@solana/web3.js` from the CDN (exposed as `solana` global) for
 * transfer/ATA builders. The Phantom wallet provider is also exposed as
 * `window.solana` — we capture BOTH and alias them: `S` = web3 library,
 * `phantom` = wallet provider.
 */
const S = window.solanaWeb3 || window.solana ?? {}; // web3.js CDN global
let phantom = window.solana; // Phantom provider

// ── Constants ────────────────────────────────────────────────────────
const CLAWD_TOKEN = '8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump';
const USDC_TOKEN = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const SOL_TOKEN = 'So11111111111111111111111111111111111111112';
const WSOL_TOKEN = 'So11111111111111111111111111111111111111112';
const RPC_URL =
  localStorage.getItem('clawdrouter_rpc') ||
  'https://api.mainnet-beta.solana.com';

// Default recipient — overridden by /v1/web/config
let RECIPIENT = '';

// ── State ────────────────────────────────────────────────────────────
let wallet = null;
let publicKey = null;
let prices = { CLAWD: 0.0001, SOL: 150, USDC: 1 };
let currentToken = 'USDC';
let currentAmount = 5;
let currentPlan = 29;

// ── DOM refs ─────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const connectBtn = $('connectBtn');
const connState = $('connState');
const walletAddr = $('walletAddr');
const balClawd = $('balClawd');
const balUsdc = $('balUsdc');
const balSol = $('balSol');
const tier = $('tier');
const discount = $('discount');
const payStatus = $('payStatus');
const payTarget = $('payTarget');
const chat = $('chat');
const promptEl = $('prompt');
const sendBtn = $('sendBtn');
const chatStatus = $('chatStatus');
const modelSelect = $('modelSelect');

// ── Helpers ──────────────────────────────────────────────────────────
function short(addr) {
  return addr?.slice(0, 4) + '…' + addr?.slice(-4) ?? '';
}
function toBase64(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

// ── Prices (Jupiter price API v2) ────────────────────────────────────
async function loadPrices() {
  try {
    const res = await fetch(
      `https://api.jup.ag/price/v2?ids=${CLAWD_TOKEN},${WSOL_TOKEN},${USDC_TOKEN}`,
    );
    const json = await res.json();
    const d = json?.data ?? {};
    prices = {
      CLAWD: parseFloat(d[CLAWD_TOKEN]?.price ?? 0.0001),
      SOL: parseFloat(d[WSOL_TOKEN]?.price ?? 150),
      USDC: 1,
    };
  } catch {
    /* keep fallbacks */
  }
}

// ── Bootstrap config ─────────────────────────────────────────────────
async function loadConfig() {
  try {
    const res = await fetch('/v1/web/config');
    if (res.ok) {
      const cfg = await res.json();
      if (cfg.recipient) RECIPIENT = cfg.recipient;
      else if (cfg.payTo) RECIPIENT = cfg.payTo;
    }
  } catch {
    /* offline */
  }
  refreshPayTarget();
}

function refreshPayTarget() {
  const tokenAmt = usdToToken(currentAmount);
  payTarget.textContent = `Recipient: ${RECIPIENT || 'set on server'} · ${currentToken} ≈ ${currentAmount > 0 ? '$' + currentAmount : ''}${currentToken === 'USDC' ? '' : ' ≈ ' + tokenAmt} ${currentToken}`;
}

// Convert USD dollar amount to selected token units using live prices
function usdToToken(usd) {
  if (currentToken === 'USDC') return usd;
  return usd / (prices[currentToken] || 1);
}

// ── Wallet connect (Phantom) ─────────────────────────────────────────
async function connectWallet() {
  if (!window.solana?.isPhantom) {
    payStatus.textContent = 'Phantom wallet not found. Install from https://phantom.app';
    payStatus.className = 'statusbox err';
    return;
  }
  wallet = window.solana;
  phantom = window.solana;
  connState.textContent = 'connecting…';
  try {
    const resp = await wallet.connect();
    publicKey = resp.publicKey.toString();
    connState.textContent = 'connected';
    connState.className = 'state-pill connected';
    walletAddr.textContent = short(publicKey);
    connectBtn.textContent = 'Disconnect';
    await loadPrices();
    await refreshBalances();
  } catch (err) {
    connState.textContent = 'not connected';
    payStatus.textContent = 'Connection rejected: ' + err.message;
    payStatus.className = 'statusbox err';
  }
}

function disconnectWallet() {
  wallet?.disconnect?.();
  publicKey = null;
  connState.textContent = 'not connected';
  connState.className = 'state-pill';
  walletAddr.textContent = '—';
  connectBtn.textContent = 'Connect Wallet';
  ['balClawd', 'balUsdc', 'balSol'].forEach((id) => ($(id).textContent = '—'));
  tier.textContent = '—';
  discount.textContent = '0%';
}

// ── Balances & tier ──────────────────────────────────────────────────
async function rpc(method, params = []) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

async function getBalance(addr, mint) {
  try {
    if (mint === SOL_TOKEN) {
      const b = await rpc('getBalance', [addr]);
      return (b?.value ?? 0) / 1e9;
    }
    const { value } = await rpc('getTokenAccountsByOwner', [
      addr,
      { mint },
      { encoding: 'jsonParsed' },
    ]);
    for (const acc of value || []) {
      const info = acc.account?.data?.parsed?.info;
      return Number(info?.tokenAmount?.uiAmount ?? 0);
    }
    return 0;
  } catch {
    return 0;
  }
}

async function getTier(clawdBalance) {
  if (clawdBalance >= 10000000) return { name: 'WHALE', discount: 50 };
  if (clawdBalance >= 1000000) return { name: 'DIAMOND', discount: 25 };
  if (clawdBalance >= 100000) return { name: 'HOLDER', discount: 10 };
  if (clawdBalance >= 1000) return { name: 'HOLDER', discount: 5 };
  return { name: 'FREE', discount: 0 };
}

async function refreshBalances() {
  if (!publicKey) return;
  try {
    const [clawd, usdc, sol] = await Promise.all([
      getBalance(publicKey, CLAWD_TOKEN),
      getBalance(publicKey, USDC_TOKEN),
      getBalance(publicKey, SOL_TOKEN),
    ]);
    balClawd.textContent = clawd.toLocaleString(undefined, { maximumFractionDigits: 0 });
    balUsdc.textContent = '$' + usdc.toFixed(2);
    balSol.textContent = sol.toFixed(3) + ' SOL';
    const t = await getTier(clawd);
    tier.textContent = t.name;
    discount.textContent = t.discount + '%';
  } catch (err) {
    payStatus.textContent = 'Balance fetch failed: ' + err.message;
    payStatus.className = 'statusbox err';
  }
}

// ── Payments ─────────────────────────────────────────────────────────
function tokenMint() {
  if (currentToken === 'CLAWD') return CLAWD_TOKEN;
  if (currentToken === 'SOL') return SOL_TOKEN;
  return USDC_TOKEN;
}
function tokenDecimals() {
  return currentToken === 'SOL' ? 9 : 6;
}

async function ensureAta(connection, mint, owner) {
  const from = new S.PublicKey(owner);
  const ata = await S.Token.getAssociatedTokenAddress(
    S.ASSOCIATED_TOKEN_PROGRAM_ID,
    S.TOKEN_PROGRAM_ID,
    new S.PublicKey(mint),
    from,
  );
  const info = await connection.getAccountInfo(ata);
  return { ata, exists: !!info };
}

async function sendPayment(kind, amountUsd) {
  if (!publicKey) {
    payStatus.textContent = 'Connect your wallet first.';
    payStatus.className = 'statusbox err';
    return;
  }
  if (!RECIPIENT) {
    payStatus.textContent = 'No payment recipient — set CLAWDROUTER_PAY_TO on the server.';
    payStatus.className = 'statusbox err';
    return;
  }
  const tokenAmount = usdToToken(amountUsd);
  const decimals = tokenDecimals();
  const rawAmount = BigInt(Math.round(tokenAmount * 10 ** decimals));
  payStatus.textContent = `Building ${kind}: pay ${tokenAmount.toFixed(decimals === 9 ? 6 : 2)} ${currentToken} ($${amountUsd})…`;
  payStatus.className = 'statusbox';

  try {
    const connection = new S.Connection(RPC_URL);
    const from = new S.PublicKey(publicKey);
    const to = new S.PublicKey(RECIPIENT);
    const mint = tokenMint();
    const feePayer = from;

    if (currentToken === 'SOL') {
      // Native SOL transfer (lamports)
      const tx = new S.Transaction().add(
        S.SystemProgram.transfer({
          fromPubkey: from,
          toPubkey: to,
          lamports: BigInt(Math.round(tokenAmount * 1e9)),
        }),
      );
      tx.feePayer = feePayer;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const sig = await wallet.signAndSendTransaction({ transaction: tx, connection });
      payStatus.textContent = 'Paid! SOL tx: ' + short(sig?.signature ?? sig);
      payStatus.className = 'statusbox ok';
      return;
    }

    // SPL (USDC / CLAWD)
    const tx = new S.Transaction();
    const fromAtaRes = await ensureAta(connection, mint, publicKey);
    // Recipient ATA — create via fromSig if missing
    const toAta = await S.Token.getAssociatedTokenAddress(
      S.ASSOCIATED_TOKEN_PROGRAM_ID,
      S.TOKEN_PROGRAM_ID,
      new S.PublicKey(mint),
      to,
    );
    const toAccountInfo = await connection.getAccountInfo(toAta);
    if (!toAccountInfo) {
      tx.add(
        S.Token.createAssociatedTokenAccountInstruction(
          S.ASSOCIATED_TOKEN_PROGRAM_ID,
          S.TOKEN_PROGRAM_ID,
          new S.PublicKey(mint),
          toAta,
          to,
          from,
        ),
      );
    }
    tx.add(
      S.Token.createTransferInstruction(
        S.TOKEN_PROGRAM_ID,
        fromAtaRes.ata,
        toAta,
        from,
        [],
        rawAmount,
      ),
    );
    tx.feePayer = feePayer;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const sig = await wallet.signAndSendTransaction({ transaction: tx, connection });
    payStatus.textContent = `Paid! ${currentToken} tx: ` + short(sig?.signature ?? sig);
    payStatus.className = 'statusbox ok';
  } catch (err) {
    payStatus.textContent = 'Payment failed: ' + err.message;
    payStatus.className = 'statusbox err';
  }
}

// ── Chat ─────────────────────────────────────────────────────────────
function addMsg(role, text) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  const r = document.createElement('span');
  r.className = 'role';
  r.textContent = role === 'user' ? 'You' : role === 'assistant' ? '🦞' : '⚠';
  const t = document.createElement('span');
  t.textContent = text;
  div.appendChild(r);
  div.appendChild(t);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendChat() {
  const text = promptEl.value.trim();
  if (!text) return;
  addMsg('user', text);
  promptEl.value = '';
  sendBtn.disabled = true;
  chatStatus.textContent = 'authenticating…';
  const model = modelSelect.value || 'clawdrouter/auto';

  try {
    let authHeader = 'x402'; // local fallback
    if (publicKey && wallet) {
      const msg = new TextEncoder().encode(
        'ClawdRouter auth: ' + new Date().toISOString().slice(0, 10),
      );
      const sig = await wallet.signMessage(msg);
      authHeader = `x402:${publicKey}:${toBase64(sig)}`;
    }
    chatStatus.textContent = 'routing request…';
    const res = await fetch('/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + authHeader },
      body: JSON.stringify({ model, messages: [{ role: 'user', content: text }], stream: false }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || res.statusText);
    }
    const json = await res.json();
    addMsg('assistant', json?.choices?.[0]?.message?.content || '(empty)');
  } catch (err) {
    addMsg('error', 'Request failed: ' + err.message);
  } finally {
    sendBtn.disabled = false;
    chatStatus.textContent = '';
  }
}

// ── Model list ───────────────────────────────────────────────────────
async function loadModels() {
  try {
    const res = await fetch('/v1/models');
    if (!res.ok) return;
    const json = await res.json();
    modelSelect.innerHTML = '';
    for (const m of json.data || []) {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.id;
      modelSelect.appendChild(opt);
    }
  } catch {
    /* offline */
  }
}

// ── Wire up events ───────────────────────────────────────────────────
connectBtn.addEventListener('click', () => (publicKey ? disconnectWallet() : connectWallet()));

document.querySelectorAll('.chip[data-token]').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip[data-token]').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    currentToken = chip.dataset.token;
    refreshPayTarget();
  });
});
document.querySelectorAll('.chip[data-amount]').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip[data-amount]').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    currentAmount = parseInt(chip.dataset.amount, 10);
    refreshPayTarget();
  });
});
document.querySelectorAll('.chip[data-plan]').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip[data-plan]').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    currentPlan = parseInt(chip.dataset.plan, 10);
    $('subscribeBtn').textContent = `Subscribe for $${currentPlan}/mo`;
  });
});

$('payPerUseBtn').addEventListener('click', () => sendPayment('pay-per-use', currentAmount));
$('subscribeBtn').addEventListener('click', () => sendPayment('subscription', currentPlan));
sendBtn.addEventListener('click', sendChat);
promptEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
});

window.addEventListener('solana::connect', refreshBalances);
window.addEventListener('solana::disconnect', disconnectWallet);

// ── Boot ─────────────────────────────────────────────────────────────
(async () => {
  await loadPrices();
  await loadConfig();
  await loadModels();
})();