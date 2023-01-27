import { FastifyInstance } from 'fastify';
import WebPush from 'web-push';
import { z } from 'zod';

const publicKey =
  'BA2Bu0woIqamsvbsdEriV9OWtzDloR6G1n6GSxkztKtMrC4NnhhUrXWjvpnlbPBFME6jMXv0Fi5wV-edKn69eXg';

const privateKey = 'lOdz3f6Q3epgFRcbR3dMOPIsYzEAdtKFGAUo5H2VuTM';

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey);

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public_key', () => {
    return {
      publicKey,
    };
  });

  app.post('/push/register', (request, reply) => {
    console.log(request.body);

    return reply.status(201).send();
  });

  app.post('/push/send', async (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    });

    const { subscription } = sendPushBody.parse(request.body);

    setTimeout(() => {
      WebPush.sendNotification(
        subscription,
        'Lembrete para completar seus hábitos diários.'
      );
    }, 1000);

    return reply.status(201).send();
  });
}
