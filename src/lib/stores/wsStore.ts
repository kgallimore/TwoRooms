import { writable } from 'svelte/store';
import { Prisma } from '@prisma/client';
type RoomsWithUsers = Prisma.RoomGetPayload<{
	include: { users: true };
}>;
export const socket = writable<WebSocket | null>(null);
export const roomData = writable<RoomsWithUsers>();
