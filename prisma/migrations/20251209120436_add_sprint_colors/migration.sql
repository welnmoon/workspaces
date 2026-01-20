             
CREATE TYPE "SprintColor" AS ENUM ('LAVENDER', 'MINT', 'PEACH', 'BABY_BLUE', 'BLUSH', 'LILAC', 'APRICOT', 'POWDER', 'SKY');

             
ALTER TABLE "Sprint" ADD COLUMN     "color" "SprintColor" DEFAULT 'POWDER';
