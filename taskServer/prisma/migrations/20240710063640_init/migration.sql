-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" INTEGER NOT NULL,
    "chainId" INTEGER NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "Task_taskId_appAddress_key" ON "Task"("taskId", "appAddress");
