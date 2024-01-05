import prisma from '$lib/prisma';
import { sendToClients } from '$lib/server/webSocketUtils';
import type { PageServerLoad } from './$types';
export const load = (async (event) => {
	const { room, user } = event.params;
	let targetRoom = (await event.parent()).room;
	if (targetRoom === null) {
		targetRoom = await prisma.room.create({
			data: {
				roomName: room,
				users: {
					create: {
						name: user,
						primaryUser: true
					}
				}
			},
			include: { users: true }
		});
	} else {
		const findUser = targetRoom.users.find((u) => u.name === user);
		if (findUser === undefined) {
			const newUser = await prisma.user.create({
				data: {
					name: user,
					roomId: targetRoom.id
				}
			});
			targetRoom.users.push(newUser);
			sendToClients(event.locals.wss, targetRoom.id, { userJoined: newUser });
		} else {
			await prisma.user.updateMany({
				where: { name: user, roomId: targetRoom.id },
				data: { disconnectedAt: null }
			});
			sendToClients(event.locals.wss, targetRoom.id, { userRejoined: findUser.id });
		}
	}
	console.log();
	return { room: targetRoom, user };
}) satisfies PageServerLoad;
