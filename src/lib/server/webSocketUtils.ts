import { parse } from 'url';
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import { nanoid } from 'nanoid';
import type { WebSocket as WebSocketBase } from 'ws';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';
import type { User } from '@prisma/client';
//import prisma from '$lib/prisma';

export const GlobalThisWSS = Symbol.for('sveltekit.wss');

export interface ExtendedWebSocket extends WebSocketBase {
	socketId: string;
	room: number;
	user: number;
	// userId: string;
}
export type GameStates = 'Lobby' | 'In Progress';

export interface WebsocketMessages {
	userLeft?: number;
	userKicked?: number;
	userJoined?: User;
	userRejoined?: number;
	gameStateChanged?: GameStates;
	rolesChanged?: number[];
	gameStarted?: {
		assignedRoles: { [userId: number]: number };
		gameState: GameStates;
		currentRound: number;
		roundStartTime: Date;
	};
	nextRound?: { currentRound: number; roundStartTime: Date };
}

// You can define server-wide functions or class instances here
// export interface ExtendedServer extends Server<ExtendedWebSocket> {};

export type ExtendedWebSocketServer = WebSocket.Server<ExtendedWebSocket>;

export type ExtendedGlobal = typeof globalThis & {
	[GlobalThisWSS]: ExtendedWebSocketServer;
};

export const onHttpServerUpgrade = (req: IncomingMessage, sock: Duplex, head: Buffer) => {
	const pathname = req.url ? parse(req.url).pathname : null;
	if (pathname !== '/websocket') return;

	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];

	wss.handleUpgrade(req, sock, head, (ws) => {
		//console.log('[handleUpgrade] creating new connection');
		wss.emit('connection', ws, req);
	});
};

export const createWSSGlobalInstance = () => {
	const wss = new WebSocketServer({ noServer: true }) as unknown as ExtendedWebSocketServer;

	(globalThis as ExtendedGlobal)[GlobalThisWSS] = wss;

	wss.on('connection', (ws: ExtendedWebSocket) => {
		ws.socketId = nanoid();
		// const url = req.url ? parse(req.url) : null;
		// if (url?.search == null) {
		// 	ws.close();
		// 	return;
		// }
		// const search = new URLSearchParams(url.search);
		// if (!search) {
		// 	ws.close();
		// 	return;
		// }
		// const room = parseInt(search.get('room') ?? '');
		// const user = parseInt(search.get('user') ?? '');
		// if (!room || !user) {
		// 	ws.close();
		// 	return;
		// }
		// ws.room = room;
		// ws.user = user;
		//console.log(`[wss:global] client connected (${ws.socketId})`);
		ws.on('message', () => {});

		ws.on('close', async () => {
			//console.log(`[wss:global] client disconnected (${ws.socketId})`);
		});
	});

	return wss;
};

export function sendToClients(
	wss: ExtendedWebSocketServer | undefined,
	room: number,
	msg: WebsocketMessages
) {
	if (wss) {
		wss.clients.forEach((client) => {
			if (client.readyState === 1 && client.room === room) {
				client.send(JSON.stringify(msg));
			}
		});
	} else {
		console.error('wss is undefined');
	}
}
