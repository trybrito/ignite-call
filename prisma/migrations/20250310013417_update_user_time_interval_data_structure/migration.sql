/*
  Warnings:

  - You are about to drop the column `time_end_in_minutes` on the `user_time_intervals` table. All the data in the column will be lost.
  - You are about to drop the column `time_start_in_minutes` on the `user_time_intervals` table. All the data in the column will be lost.
  - Added the required column `end_time_in_minutes` to the `user_time_intervals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time_in_minutes` to the `user_time_intervals` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_time_intervals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "week_day" INTEGER NOT NULL,
    "start_time_in_minutes" INTEGER NOT NULL,
    "end_time_in_minutes" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "user_time_intervals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user_time_intervals" ("id", "user_id", "week_day") SELECT "id", "user_id", "week_day" FROM "user_time_intervals";
DROP TABLE "user_time_intervals";
ALTER TABLE "new_user_time_intervals" RENAME TO "user_time_intervals";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
