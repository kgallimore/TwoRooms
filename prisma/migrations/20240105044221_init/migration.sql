-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" INTEGER,
    "team" TEXT,
    "roomId" INTEGER NOT NULL,
    "disconnectedAt" DATETIME,
    "primaryUser" BOOLEAN NOT NULL DEFAULT false,
    "assignedRoom" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "disconnectedAt", "id", "name", "primaryUser", "roleId", "roomId", "team", "updatedAt") SELECT "createdAt", "disconnectedAt", "id", "name", "primaryUser", "roleId", "roomId", "team", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
