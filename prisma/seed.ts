import { PrismaClient, Prisma } from '@prisma/client';
import { unSanRoles } from '../src/lib/roles';
const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);
	const linkingRoles: { [key: string]: number } = {};
	for (const p of unSanRoles) {
		if (p.team === 'Either') {
			const role1 = await prisma.role.create({
				data: {
					name: p.name,
					description: p.description,
					team: 'Red',
					rules: p.rules
				}
			});
			const role2 = await prisma.role.create({
				data: {
					name: p.name,
					description: p.description,
					team: 'Blue',
					rules: p.rules
				}
			});
			console.log(`Created 2 roles with ids: ${role1.id} ${role2.id}`);
		} else {
			const buildRelations: Prisma.RoleWhereUniqueInput[] = [];
			if (p.linkedCards) {
				for (const linked of p.linkedCards) {
					if (linkingRoles[linked]) {
						buildRelations.push({ id: linkingRoles[linked] });
					}
				}
			}
			const user = await prisma.role.create({
				data: {
					name: p.name,
					description: p.description,
					team: p.team,
					rules: p.rules,
					requiredRoles: { connect: buildRelations }
				}
			});
			if (p.linkedCards) {
				linkingRoles[p.name] = user.id;
			}
			console.log(`Created role with id: ${user.id}`);
		}
	}
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
