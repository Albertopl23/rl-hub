const admin = require('firebase-admin');

// 1. Inicializar credenciales de administrador de Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "rl-peto",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  });
}

// 2. Recibir la petición y disparar la notificación
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Método no permitido' };

  const { token, title, body } = JSON.parse(event.body);

  try {
    await admin.messaging().send({
      token: token,
      notification: { title, body }
    });
    return { statusCode: 200, body: 'Notificación enviada con éxito' };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};