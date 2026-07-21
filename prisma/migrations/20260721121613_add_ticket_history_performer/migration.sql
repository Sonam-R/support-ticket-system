-- Clear existing history rows that lack performer attribution
DELETE FROM "TicketHistory";

-- AlterTable
ALTER TABLE "TicketHistory" ADD COLUMN "field" TEXT;
ALTER TABLE "TicketHistory" ADD COLUMN "performedById" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TicketHistory_ticketId_createdAt_idx" ON "TicketHistory"("ticketId", "createdAt");

-- AddForeignKey
ALTER TABLE "TicketHistory" ADD CONSTRAINT "TicketHistory_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
