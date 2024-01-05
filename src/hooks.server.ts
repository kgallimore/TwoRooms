import { building } from '$app/environment';
import { parse } from 'url';
import { GlobalThisWSS } from '$lib/server/webSocketUtils';
import type { Handle } from '@sveltejs/kit';
import type {
	ExtendedGlobal,
	ExtendedWebSocket,
	WebsocketMessages
} from '$lib/server/webSocketUtils';
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
let wssInitialized = false;
const lookup: { [room: string]: { [user: string]: string[] } } = {};
function sendToRoom(room: number, message: WebsocketMessages) {
	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
	if (wss !== undefined) {
		wss.clients.forEach((client: ExtendedWebSocket) => {
			if (client.readyState === 1 && client.room === room) {
				client.send(JSON.stringify(message));
			}
		});
	} else {
		console.error('wss is undefined');
	}
}
const startupWebsocketServer = () => {
	if (wssInitialized) return;
	console.log('[wss:kit] setup');
	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
	if (wss !== undefined) {
		wss.on('connection', async (ws, req) => {
			const url = req.url ? parse(req.url) : null;
			if (url?.search == null) {
				ws.close();
				return;
			}
			const search = new URLSearchParams(url.search);
			if (!search) {
				ws.close();
				return;
			}
			const room = parseInt(search.get('room') ?? '');
			const user = parseInt(search.get('user') ?? '');
			if (!room || !user) {
				console.log(`Room or user not found. Room: ${room}, User: ${user}}`);
				ws.close();
				return;
			}
			if (!lookup[room]) {
				lookup[room] = { [user]: [ws.socketId] };
			} else {
				if (!lookup[room][user]) {
					lookup[room][user] = [ws.socketId];
				} else {
					lookup[room][user].push(ws.socketId);
				}
			}
			ws.room = room;
			ws.user = user;
			await prisma.user.updateMany({
				where: { id: ws.user },
				data: { disconnectedAt: null }
			});
			ws.on('message', async (message: string) => {
				let msg: WebsocketMessages;
				try {
					msg = JSON.parse(message.toString()) as WebsocketMessages;
				} catch (e) {
					console.log(`[wss:global] received: ${message}`);
					return;
				}
				if (msg.rolesChanged) {
					if ((await prisma.user.findFirst({ where: { id: ws.user, primaryUser: true } })) === null)
						return;
					await prisma.room.updateMany({
						where: { id: ws.room },
						data: { enabledRoles: JSON.stringify(msg.rolesChanged) }
					});
					sendToRoom(ws.room, msg);
				}
			});
			ws.on('close', async () => {
				if (ws.user) {
					lookup[ws.room][ws.user] = lookup[ws.room][ws.user].filter((id) => id !== ws.socketId);
					if (lookup[ws.room][ws.user].length === 0) {
						delete lookup[ws.room][ws.user];
						await prisma.user.updateMany({
							where: { id: ws.user },
							data: { disconnectedAt: new Date() }
						});
						sendToRoom(ws.room, { userLeft: ws.user });
					}
					if (lookup[ws.room] && Object.keys(lookup[ws.room])?.length === 0) {
						console.log('All users have left room, remove room from lookup and database', ws.room);
						delete lookup[ws.room];
						await prisma.room.deleteMany({ where: { id: ws.room } });
					}
				}
			});
		});
		wssInitialized = true;
	}
};

export const handle = (async ({ event, resolve }) => {
	startupWebsocketServer();
	// Skip WebSocket server when pre-rendering pages
	if (!building) {
		const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
		if (wss !== undefined) {
			event.locals!.wss = wss;
		}
	}
	if (event.url.pathname.match(/[A-Z]/)) {
		throw redirect(307, event.url.pathname.toLowerCase());
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-type'
	});
	return response;
}) satisfies Handle;
