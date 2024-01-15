import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { sendToClients } from '$lib/server/webSocketUtils';
export const POST: RequestHandler = async ({ params, request, locals }) => {
	const selectedRoles = (await request.json()) as number[];
	const roles = await prisma.role.findMany();
	const targetRoom = await prisma.room.findFirst({
		where: { roomName: params.room },
		include: { users: true }
	});
	if (!targetRoom) {
		return json({ error: 'Room not found' });
	}
	if (targetRoom.users.find((u) => u.name === params.user)?.primaryUser === false) {
		return json({ error: 'Only the primary user can start the game' });
	}
	if (targetRoom.gameState !== 'Lobby') {
		return json({ error: 'Game already started' });
	}
	if (selectedRoles.length > targetRoom.users.length) {
		return json({ error: 'Too many cards selected' });
	}

	const roomAssignments = Array.from({ length: targetRoom.users.length }, (_, i) => i % 2 === 0);
	const dbRoles = await prisma.role.findMany();
	const usersCopy = [...targetRoom.users];
	for (let i = 0; i < selectedRoles.length; i++) {
		const role = selectedRoles[i];
		const dbRole = dbRoles.find((r) => r.id === role);
		const randomTargetUser = Math.floor(Math.random() * usersCopy.length);
		const randomTargetRoom = Math.floor(Math.random() * roomAssignments.length);
		await prisma.user.updateMany({
			where: { id: usersCopy[randomTargetUser].id },
			data: { roleId: dbRole?.id, assignedRoom: roomAssignments[randomTargetRoom] }
		});
		roomAssignments.splice(randomTargetRoom, 1);
		usersCopy.splice(randomTargetUser, 1);
	}
	const blueCiv = roles.find((r) => r.name === 'Civilian' && r.team == 'Blue')!.id;
	const redCiv = roles.find((r) => r.name === 'Civilian' && r.team == 'Red')!.id;
	const teamAssignments = Array.from({ length: targetRoom.users.length }, (_, i) =>
		i % 2 === 0 ? blueCiv : redCiv
	);
	for (let i = 0; i < usersCopy.length; i++) {
		const randomTargetTeam = Math.floor(Math.random() * teamAssignments.length);

		await prisma.user.updateMany({
			where: { id: usersCopy[i].id },
			data: { roleId: teamAssignments[randomTargetTeam] }
		});
		teamAssignments.splice(randomTargetTeam, 1);
	}
	const fullGame = targetRoom.users.length > 10;
	const numRounds = fullGame ? 5 : 3;
	const roundStartTime = new Date();
	const roomUpdated = await prisma.room.update({
		where: { id: targetRoom.id },
		data: {
			gameState: 'In Progress',
			enabledRoles: JSON.stringify(selectedRoles),
			currentRound: numRounds,
			roundStartTime
		},
		include: { users: true }
	});
	const assignedRoles: { [key: string]: number } = {};
	for (let i = 0; i < roomUpdated.users.length; i++) {
		assignedRoles[roomUpdated.users[i].id] = roomUpdated.users[i].roleId as number;
	}
	sendToClients(locals.wss, targetRoom.id, {
		gameStarted: {
			users: roomUpdated.users,
			gameState: 'In Progress',
			currentRound: numRounds,
			roundStartTime: roundStartTime
		}
	});
	return json({ error: '' });
};
