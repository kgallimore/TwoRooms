export function hostageCounts(players: number): number[] {
	switch (true) {
		case players <= 10:
			return [1, 1, 1];
		case players <= 13:
			return [2, 2, 1, 1, 1];
		case players <= 17:
			return [3, 2, 2, 1, 1];
		case players <= 21:
			return [4, 3, 2, 1, 1];
		default:
			return [5, 4, 3, 2, 1];
	}
}
export type Roles =
	| 'Civilian'
	| 'President'
	| 'Agent'
	| 'Agoraphobe'
	| 'Ahab'
	| 'Angel'
	| 'Anarchist'
	| 'Ambassador'
	| 'Blind'
	| 'Bomber'
	| 'Bomb-Bot'
	| 'Bouncer'
	| 'Butler'
	| 'Clone'
	| 'Clown'
	| 'Conman'
	| 'Coyboy'
	| 'Criminal'
	| 'Cupid'
	| 'Dealer'
	| 'Decoy'
	| 'Demon'
	| 'Doctor'
	| 'Dr. Boom'
	| 'Drunk'
	| 'Eris'
	| 'Enforcer'
	| 'Engineer'
	| 'Gambler'
	| 'Hot Potato'
	| 'Invincible'
	| 'Intern'
	| 'Juliet'
	| 'Leprechaun'
	| 'Maid'
	| 'Martyr'
	| 'Mayor'
	| 'Medic'
	| 'MI6'
	| 'Mime'
	| 'Minion'
	| 'Mistress'
	| 'Moby'
	| 'Negotiator'
	| 'Nuclear Tyrant'
	| 'Nurse'
	| 'Paparazzo'
	| "President's Daughter"
	| 'Romeo'
	| 'Private Eye'
	| 'Psychologist'
	| 'Queen'
	| 'Rival'
	| 'Robot'
	| 'Security'
	| 'Shy Guy'
	| 'Sniper'
	| 'Target'
	| 'Spy'
	| 'Survivor'
	| 'Thug'
	| 'Tinkerer'
	| 'Traveler'
	| 'Tuesday Knight'
	| 'Usurper'
	| 'Victim'
	| 'Wife'
	| 'Zombie';
export interface RoleData {
	name: Roles;
	team: Teams;
	description: string;
	rules?: string;
	linkedCards?: Roles[];
}
export type Teams = 'Blue' | 'Red' | 'Either' | 'Gray' | 'Green' | 'Purple';
export const unSanRoles: Array<RoleData> = [
	{
		name: 'Civilian',
		team: 'Either',
		description: 'No special ability'
	},
	{
		name: 'Agent',
		team: 'Either',
		description: 'Force a card share once per round',
		rules:
			'Once per round, you may privately reveal your card to a player and force that player to card share with you. You must verbally say to the target player, "I\'m using my AGENT power. You must card share with me." The AGENT power works even on characters that normally can\'t card share (e.g. Shy Guy and Coy Boy).'
	},
	{
		name: 'Agoraphobe',
		team: 'Gray',
		description: 'Never leave your room',
		rules: 'You win if you never leave your room'
	},
	{
		name: 'Ahab',
		team: 'Gray',
		description: 'Stay away from Moby and the bomber',
		rules: "You win if you're not in the same room as Moby or the bomber",
		linkedCards: ['Moby']
	},
	{
		name: 'Ambassador',
		team: 'Either',
		description: 'Walk freely between the rooms',
		rules:
			'As soon as you are dealt your card, announce "I am an Ambassador!" Your card is permanently publicly revealed. You have the "immune" condition. Players with the "immune" condition are immune to all powers and conditions. Ambassadors can walk freely between the 2 rooms. Ambassadors are never considered a part of a room\'s population. Therefore, Ambassadors can never take part in any vote, be hostages, be leaders, and they can never be targeted by abilities'
	},
	{
		name: 'Anarchist',
		team: 'Gray',
		description: 'Usurp the room leader a majority of rounds',
		rules:
			'You win if your vote helped successfully usurp a leader during a majority of the rounds. For example, in a 3 round game, you must have usurped a leader 2 of the 3 rounds.'
	},
	{
		name: 'Angel',
		team: 'Either',
		description: 'Tell the truth',
		rules:
			'You begin with the “honest” condition. Players with the “honest” condition must always verbally tell the truth. This means that you are permitted to lie as long as it is not verbally. Note: If a player with the “honest” condition were to acquire the “liar” condition, the 2 conditions would cancel one another, leaving the player with neither condition.'
	},

	{ name: 'Blind', team: 'Either', description: 'Keep your eyes closed' },

	{
		name: 'Bomb-Bot',
		team: 'Gray',
		description: 'Be with the bomber, avoid the president.',
		rules:
			'You win if you end the game in the same room as the bomber and not in the same room as the president.'
	},
	{
		name: 'Bomber',
		team: 'Red',
		description: 'Be with the president the final round.',
		linkedCards: ['President'],
		rules:
			'Everyone in the same room as you at the end of the game gains the “dead” condition. The Red Team wins if the President gains the “dead” condition. Note: if the Bomber receives the “dead” condition before the end of the game then the Bomber does not provide the “dead” condition to everyone in the same room.'
	},
	{
		name: 'Bouncer',
		team: 'Either',
		description: 'Kick an Extra player out',
		rules:
			'You have the BOUNCER power: if you are in a room that has more players than the other room,  you may privately reveal your card to any player and verbally tell them, "Get out!" When you do, that player must immediately change rooms. The BOUNCER power does not work during the last round or between rounds.'
	},
	{
		name: 'Butler',
		team: 'Gray',
		description: 'Be with the maid and president.',
		linkedCards: ['Maid']
	},
	{
		name: 'Clone',
		team: 'Gray',
		description: 'The player that first shares with you must win',
		rules:
			'You win if the first player with whom you card share or color share wins. If you fail to share with any player by the end of the game, you lose. Note: if the first person with whom you share is the Robot, and the Robot’s first share was with you... you both lose.'
	},
	{ name: 'Clown', team: 'Either', description: 'Smile... always' },
	{
		name: 'Conman',
		team: 'Either',
		description: 'Color share forces a private reveal',
		rules:
			'You have the CONMAN power: when a player agrees to color share with you, private reveal instead. They must private reveal their card too.'
	},
	{
		name: 'Coyboy',
		team: 'Either',
		description: 'Can only color share',
		rules:
			'You begin with the "coy" condition. Players with the "coy" condition may ONLY color share unless a character\'s power forces otherwise. If a player with the “coy” condition were to acquire the “foolish” condition, the 2 conditions would cancel one another, leaving the player with neither condition.'
	},
	{
		name: 'Criminal',
		team: 'Either',
		description: 'Card reveal forces shy condition',
		rules:
			'You have the CRIMINAL power: any player that card shares with you gains the "shy" condition. Players with the "shy" condition may not reveal any part of their card to any player'
	},
	{
		name: 'Cupid',
		team: 'Red',
		description: "Make 2 players 'In Love' once per game",
		linkedCards: ['Eris'],
		rules:
			'You have the CUPID power: once per game, you may privately reveal your card to 2 players. You must verbally tell your target players, "You are in love with each other." Those 2 players gain the "in love" condition. Players with the "in love" condition replace their original win objective with the following win objective: Be in the same room with the player with whom you are "in love" at the end of the game or fail to win. The CUPID power cannot be used on yourself. The ERIS and CUPID powers can cancel each other out'
	},

	{
		name: 'Dealer',
		team: 'Either',
		description: 'Card share forces foolish',
		rules:
			'You have the DEALER power: any player that card shares with you gains the "foolish" condition. Players with the "foolish" condition can never turn down an offer to card or color share. Note: If a player with the “foolish” condition were to acquire a contradictory condition (e.g. “shy” or “coy”), the 2 conditions would cancel one another, leaving the player with neither condition.'
	},
	{ name: 'Decoy', team: 'Gray', description: 'Get shot by the sniper' },
	{
		name: 'Demon',
		team: 'Either',
		description: 'You must (verbally) lie',
		rules:
			'Players with the “liar” condition must always verbally tell lies. This means that you are permitted to tell the truth as long as it is not verbally.Note: If a player with the “liar” condition were to acquire the “honest” condition, the 2 conditions would cancel one another, leaving the player with neither condition.'
	},
	{
		name: 'Doctor',
		team: 'Blue',
		description: 'Card share with the president'
	},
	{
		name: 'Dr. Boom',
		team: 'Red',
		description: 'Card share with the president and instantly win.',
		rules:
			'The BOOM power never works on the President’s Daughter. If the President is buried, the BOOM power is never used.'
	},
	{
		name: 'Drunk',
		team: 'Purple',
		description: "You're drunk.",
		rules:
			'Before characters cards are dealt but after they are shuffled, randomly remove a character card. This is the “sober” character card. Place the “sober” card facedown in a location easily accessible to all players (usually between the 2 rooms). Then shuffle the Drunk card into the remaining deck of character cards. At the beginning of the last round of the game, the Drunk character should trade their Drunk card with the “sober” card. Assume all powers and responsibilities associated with the “sober” character card. You lose if you forget or are unable to trade your card for the “sober” card. Note: The “sober” card is always cleansed when it is first retrieved, meaning it has no acquired conditions. Another Note: If you don’t retrieve the “sober” card at the beginning of the last round, you’re still considered to be the “sober” character.'
	},
	{
		name: 'Eris',
		team: 'Blue',
		description: "Make 2 players 'In Hate' once per game",
		linkedCards: ['Cupid'],
		rules:
			'You have the ERIS power: once per game, you may privately reveal your card to 2 players. You must verbally tell your target players, "You are in hate with each other." Those 2 players gain the "in hate" condition. Players with the "in hate" condition replace their original win objective with the following win objective: Be in the opposite room with the player with whom you are "in hate" at the end of the game or fail to win. The ERIS power cannot be used on yourself. The ERIS and CUPID powers can cancel each other out'
	},
	{
		name: 'Enforcer',
		team: 'Either',
		description: 'Force players tp card share once per round.',
		rules:
			'You have the ENFORCER power: once per round, you may privately reveal your card to 2 players. You must verbally tell your target players, “You must reveal your cards to one another.” Those 2 players must card share with one another (not to you). You cannot use this power on yourself, but another Enforcer can use their power on you. Note: The ENFORCER power works even on characters that normally can’t card share (e.g. Shy Guy).'
	},
	{ name: 'Engineer', team: 'Red', description: 'Card share with the bomber' },
	{
		name: 'Gambler',
		team: 'Gray',
		description: 'Guess if red, blue, or neither team won',
		rules:
			'At the end of the last round, before all players reveal their cards, you must publicly announce which team (Red Team, Blue Team, or neither) you think won the game.'
	},
	{
		name: 'Hot Potato',
		team: 'Gray',
		description: 'You lose, but sharing = swapping',
		rules:
			'You have the HOT POTATO power: any player that card shares or color shares with you immediately trades cards with you. Both you and the other player assume the powers and the allegiance of the newly acquired cards. The Hot Potato loses at the end of the game.'
	},
	{
		name: 'Invincible',
		team: 'Either',
		description: 'Immune to all abilities and conditions'
	},
	{ name: 'Intern', team: 'Gray', description: 'Be with the president' },
	{
		name: 'Juliet',
		team: 'Gray',
		description: 'Be with the bomber and Romeo',
		linkedCards: ['Romeo']
	},
	{
		name: 'Leprechaun',
		team: 'Green',
		description: 'You win. You\'re "foolish" and card sharing = swapping',
		rules:
			'You begin with the “foolish” condition. Players with the “foolish” condition can never turn down an offer to card or color share. You also have the LEPRECHAUN power: Any player that card shares or even color shares with you immediately trades cards with you. A single player can only ever be the Leprechaun once per game. If a player is about to become the Leprechaun character for the second time, they must communicate that they can’t receive the Leprechaun card.'
	},
	{
		name: 'Maid',
		team: 'Gray',
		description: 'Be with the butler and the president',
		linkedCards: ['Butler']
	},
	{ name: 'Martyr', team: 'Red', description: 'If there is no bomber, be the bomber' },
	{
		name: 'Mayor',
		team: 'Either',
		description: 'Public reveal = 2 votes to usurp in an even room',
		rules:
			'If your room has an even number of players, you may publicly reveal your card when attempting to usurp a leader. Your vote to usurp counts as 2 votes instead of 1 unless the opposing Mayor also publicly reveals their card.'
	},
	{
		name: 'Medic',
		team: 'Either',
		description: 'Card reveal = cure all "conditions"',
		rules: 'You are not immune to conditions'
	},
	{ name: 'MI6', team: 'Gray', description: 'Card share with the bomber and president' },
	{ name: 'Mime', team: 'Either', description: 'Never speak' },
	{ name: 'Minion', team: 'Gray', description: 'You lose if your leader is usurped' },
	{
		name: 'Mistress',
		team: 'Gray',
		description: 'Be with the president, avoid the wife'
	},
	{ name: 'Moby', team: 'Gray', description: 'Avoid the bomber and Ahab' },
	{
		name: 'Negotiator',
		team: 'Either',
		description: 'You can only card share because you\'re "savy"',
		rules:
			'You begin with the “savvy” condition. Players with the “savvy” condition may only card share. You may not publicly, privately, or color share.'
	},
	{
		name: 'Nuclear Tyrant',
		team: 'Gray',
		description: 'You\'re "foolish", don\'t card share with the president and bomber',
		rules:
			'At the end of the game, you are asked if you shared your card with both the President and the Bomber. You win if the President and the Bomber did not card share with you by the end of the game. If you win, all other players lose.'
	},
	{ name: 'Nurse', team: 'Blue', description: 'If there is no doctor, be the doctor' },
	{
		name: 'Paparazzo',
		team: 'Either',
		description: 'Ignore privacy',
		rules:
			'Do your best to make sure there are no private conversations. Be as intrusive and nosy as possible without actually physically manipulating others. If playing with the Privacy Promise rule variant, ignore the rule as long as you publicly reveal your card to prove to others that you are permitted to be invasive.'
	},
	{
		name: 'President',
		team: 'Blue',
		description: 'Avoid the bomber',
		linkedCards: ['Bomber']
	},
	{
		name: 'Romeo',
		team: 'Gray',
		description: 'Be with the bomber and Juliet',
		linkedCards: ['Juliet']
	},
	{
		name: "President's Daughter",
		team: 'Blue',
		description: 'If there is no President, be the President'
	},
	{
		name: 'Private Eye',
		team: 'Gray',
		description: 'Guess the Buried Card'
	},
	{
		name: 'Psychologist',
		team: 'Either',
		description: 'Remove PSI Conditions',
		rules:
			'When you privately reveal your card to a character with a psych condition (e.g. “shy”, “coy”, etc.), that character may then immediately card share with you. If they do, their psych condition is removed.'
	},
	{
		name: 'Queen',
		team: 'Gray',
		description: 'Avoid the president and the bomber'
	},
	{
		name: 'Rival',
		team: 'Gray',
		description: 'Avoid the president'
	},
	{
		name: 'Robot',
		team: 'Gray',
		description: 'The player that first shares with you must lose'
	},
	{
		name: 'Security',
		team: 'Either',
		description: 'Permanent Public Reveal >> Tackle a player',
		rules:
			'You have the TACKLE power: publicly reveal your card, immediately pick any player in the room (besides yourself), then verbally tell them, “You’re going nowhere.” However, your card must permanently remain publicly revealed for the rest of the game. This means that you can only use this power once. The target of your TACKLE power can’t leave as a hostage this round.'
	},
	{
		name: 'Shy Guy',
		team: 'Either',
		description: 'No sharing or reveals because you\'re "shy"'
	},
	{
		name: 'Sniper',
		team: 'Gray',
		description: 'Shoot the target',
		rules:
			'At the end of the last round, before all players reveal their character cards, you must publicly announce which player you are shooting. The selected player does not have to be in the same room as you. You win if the player you selected is the Target. ',
		linkedCards: ['Target', 'Decoy']
	},
	{
		name: 'Spy',
		team: 'Either',
		description: 'You look like you are on the opposite team'
	},
	{
		name: 'Survivor',
		team: 'Gray',
		description: 'Avoid the bomber'
	},
	{
		name: 'Target',
		team: 'Gray',
		description: 'Don\t get shot by the sniper',
		linkedCards: ['Sniper'],
		rules: 'You win if the Sniper does not shoot you at the end of the last round.'
	},
	{
		name: 'Thug',
		team: 'Either',
		description: 'Card share >> "Coy"',
		rules:
			'You have the THUG power: any player that card shares with you acquires the “coy” condition. Players with the “coy condition may only color share unless a character’s power might force a card share. Note: If a player with the “foolish” condition were to acquire the “coy” condition, the 2 conditions would cancel one another, leaving the player with neither condition'
	},
	{
		name: 'Tinkerer',
		team: 'Red',
		description: 'If there is no Engineer, be the engineer'
	},
	{
		name: 'Traveler',
		team: 'Gray',
		description: 'Be sent as a hostage a majority of the rounds'
	},
	{
		name: 'Tuesday Knight',
		team: 'Blue',
		description: 'Card share with the bomber and instantly win'
	},
	{
		name: 'Usurper',
		team: 'Either',
		description: 'Permanent Public Reveal >> Become room leader'
	},
	{
		name: 'Victim',
		team: 'Gray',
		description: 'Be with the bomber'
	},
	{
		name: 'Wife',
		team: 'Gray',
		description: 'Be with the President, avoid the Mistress',
		linkedCards: ['Mistress']
	},
	{
		name: 'Zombie',
		team: 'Green',
		description: 'Make all survivors zombies'
	}
];

// cum
