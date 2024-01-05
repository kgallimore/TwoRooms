import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';
import { sendToClients } from '$lib/server/webSocketUtils';
export const GET: RequestHandler = async ({ params, locals }) => {
	const targetRoom = await prisma.room.findFirst({
		where: { roomName: params.room },
		include: { users: true }
	});
	if (!targetRoom) {
		return json({ error: 'Room not found' });
	}
	if (targetRoom.users.find((u) => u.name === params.user)?.primaryUser === false) {
		return json({ error: 'You are not the primary user' });
	}
	if (targetRoom.currentRound === 1) {
		return json({ error: 'Already at lowest round' });
	}
	const newRoundStartTime = new Date();
	await prisma.room.updateMany({
		where: { id: targetRoom.id },
		data: { currentRound: targetRoom.currentRound - 1, roundStartTime: newRoundStartTime }
	});
	sendToClients(locals.wss, targetRoom.id, {
		nextRound: { currentRound: targetRoom.currentRound - 1, roundStartTime: newRoundStartTime }
	});
	return json({ error: '' });
};
