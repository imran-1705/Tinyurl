import { getPool } from '../../../lib/db';

function isValidCode(code) {
return /^[A-Za-z0-9]{6,8}$/.test(code);
}
function isValidUrl(s) {
try { const u = new URL(s); return u.protocol === 'http:' || u.protocol === 'https:'; } catch { return false; }
}
function randomCode(len = 6) {
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
return Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}


export default async function handler(req, res) {
const pool = await getPool();


if (req.method === 'POST') {
const { target, code: custom } = req.body || {};
if (!target || !isValidUrl(target)) return res.status(400).json({ error: 'Invalid target URL' });


let code = custom ? String(custom) : null;
if (code) {
if (!isValidCode(code)) return res.status(400).json({ error: 'Code must match ^[A-Za-z0-9]{6,8}$' });
const exists = await pool.request().input('Code', code).query('SELECT 1 AS one FROM Links WHERE Code = @Code');
if (exists.recordset.length > 0) return res.status(409).json({ error: 'Code already exists' });
} else {
// generate unique
let attempts = 0;
do {
code = randomCode(6 + Math.floor(Math.random() * 3)); // 6-8
const r = await pool.request().input('Code', code).query('SELECT 1 AS one FROM Links WHERE Code = @Code');
if (r.recordset.length === 0) break;
attempts++;
} while (attempts < 10);
if (!code) code = randomCode(8);
}


try {
await pool.request().input('Code', code).input('Target', target).query('INSERT INTO Links (Code, Target) VALUES (@Code, @Target)');
return res.status(201).json({ code, target });
} catch (err) {
// unique constraint handling
console.error(err);
return res.status(500).json({ error: 'Internal Server Error' });
}
}


if (req.method === 'GET') {
const result = await pool.request().query('SELECT Code, Target, TotalClicks, LastClicked, CreatedAt FROM Links ORDER BY CreatedAt DESC');
return res.status(200).json(result.recordset);
}


res.setHeader('Allow', ['GET','POST']);
res.status(405).end(`Method ${req.method} Not Allowed`);
}