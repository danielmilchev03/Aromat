-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('HAVE', 'WANT', 'HAD');

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "perfumeId" TEXT NOT NULL,
    "status" "CollectionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Collection_userId_status_idx" ON "Collection"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_userId_perfumeId_key" ON "Collection"("userId", "perfumeId");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
