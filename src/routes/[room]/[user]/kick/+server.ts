import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { sendToClients } from '$lib/server/webSocketUtils';
export const POST: RequestHandler = async ({ params, request, locals }) => {
	const { user } = (await request.json()) as { user: number };
	const targetRoom = await prisma.room.findFirst({
		where: { roomName: params.room },
		include: { users: true }
	});
	if (!targetRoom) {
		return json({ error: 'Room not found' });
	}
	if (targetRoom.users.find((u) => u.name === params.user)?.primaryUser === false) {
		return json({ error: 'Only the primary user can kick users' });
	}
	if (targetRoom.gameState !== 'Lobby') {
		return json({ error: 'Game already started' });
	}

	await prisma.user.deleteMany({
		where: { id: user }
	});
	sendToClients(locals.wss, targetRoom.id, { userKicked: user });

	return json({ error: '' });
};
