export default function handler(req, res) {
res.status(200).json({ ok: true, version: process.env.APP_VERSION || '1.0' });
}