             
CREATE TYPE "PlatformRole" AS ENUM ('USER', 'SYSADMIN');

             
ALTER TABLE "User" ADD COLUMN     "platformRole" "PlatformRole" NOT NULL DEFAULT 'USER';
