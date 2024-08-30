/*
  Warnings:

  - You are about to alter the column `chainId` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" INTEGER NOT NULL,
    "chainId" BIGINT NOT NULL,
    "messageBox" TEXT NOT NULL,
    "taskDefinitionId" INTEGER NOT NULL,
    "kernelTxHash" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "proofOfTask" TEXT,
    "avsTaskNumber" INTEGER,
    "performer" TEXT,
    "aggregator" TEXT,
    "peripheryTxHash" TEXT,
    "user" TEXT NOT NULL,
    "appAddress" TEXT NOT NULL,
    "taskCalldata" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Task" ("aggregator", "appAddress", "avsTaskNumber", "chainId", "createdAt", "id", "kernelTxHash", "lastUpdatedAt", "messageBox", "performer", "peripheryTxHash", "proofOfTask", "status", "taskCalldata", "taskDefinitionId", "taskId", "user") SELECT "aggregator", "appAddress", "avsTaskNumber", "chainId", "createdAt", "id", "kernelTxHash", "lastUpdatedAt", "messageBox", "performer", "peripheryTxHash", "proofOfTask", "status", "taskCalldata", "taskDefinitionId", "taskId", "user" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_taskId_appAddress_key" ON "Task"("taskId", "appAddress");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
