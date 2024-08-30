/*
  Warnings:

  - You are about to drop the column `peripheryTxHash` on the `Task` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "chainId" BIGINT NOT NULL,
    "messageBox" TEXT NOT NULL,
    "kernelTxHash" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "appAddress" TEXT NOT NULL,
    "taskCalldata" TEXT NOT NULL,
    "taskDefinitionId" INTEGER NOT NULL,
    "proofOfTask" TEXT,
    "avsTaskNumber" INTEGER,
    "avsTxHash" TEXT,
    "performer" TEXT,
    "aggregator" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Task" ("aggregator", "appAddress", "avsTaskNumber", "chainId", "createdAt", "id", "kernelTxHash", "lastUpdatedAt", "messageBox", "performer", "proofOfTask", "status", "taskCalldata", "taskDefinitionId", "taskId", "user") SELECT "aggregator", "appAddress", "avsTaskNumber", "chainId", "createdAt", "id", "kernelTxHash", "lastUpdatedAt", "messageBox", "performer", "proofOfTask", "status", "taskCalldata", "taskDefinitionId", "taskId", "user" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_taskId_messageBox_key" ON "Task"("taskId", "messageBox");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
