import type { LayoutServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load = (async (event) => {
	const { room } = event.params;
	const roles = await prisma.role.findMany({
		include: { requiredRoles: true, requiringRoles: true }
	});
	const targetRoom = await prisma.room.findFirst({
		where: { roomName: room },
		include: { users: true }
	});

	return { room: targetRoom, roles };
}) satisfies LayoutServerLoad;
