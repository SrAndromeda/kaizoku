-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "ntfyEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ntfyHost" TEXT,
ADD COLUMN     "ntfyPassword" TEXT,
ADD COLUMN     "ntfyTopic" TEXT,
ADD COLUMN     "ntfyUsername" TEXT;
