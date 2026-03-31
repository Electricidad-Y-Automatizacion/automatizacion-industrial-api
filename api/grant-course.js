export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Método no permitido' });
    }

    const { email, courseId, courseTitle, planType } = req.body || {};

    if (!email || !courseId || !courseTitle || !planType) {
      return res.status(400).json({ ok: false, error: 'Faltan datos obligatorios' });
    }

    const params = new URLSearchParams({
      action: 'grant',
      secret: process.env.ADMIN_SECRET,
      email,
      courseId,
      courseTitle,
      planType
    });

    const response = await fetch(`${process.env.APPS_SCRIPT_URL}?${params.toString()}`);
    const text = await response.text();

    let data;
    try { data = JSON.parse(text); }
    catch { data = { ok: false, error: 'Respuesta inválida', raw: text }; }

    return res.status(data.ok ? 200 : 400).json(data);
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}