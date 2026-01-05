-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('USER', 'SYSADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "platformRole" "PlatformRole" NOT NULL DEFAULT 'USER';
