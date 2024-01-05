-- CreateTable
CREATE TABLE "Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "gameState" TEXT NOT NULL DEFAULT 'Lobby',
    "enabledRoles" TEXT NOT NULL DEFAULT '[]',
    "currentRound" INTEGER NOT NULL DEFAULT 0,
    "roundStartTime" DATETIME
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" INTEGER,
    "team" TEXT,
    "roomId" INTEGER NOT NULL,
    "disconnectedAt" DATETIME,
    "primaryUser" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "rules" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomName_key" ON "Room"("roomName");
