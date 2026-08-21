/*
  Warnings:

  - A unique constraint covering the columns `[mac_address]` on the table `device_connection_status` will be added. If there are existing duplicate values, this will fail.
  - Made the column `mac_address` on table `device_connection_status` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "device_connection_status_serial_number_key";

-- AlterTable
ALTER TABLE "device_connection_status" ALTER COLUMN "serial_number" DROP NOT NULL,
ALTER COLUMN "mac_address" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "device_connection_status_mac_address_key" ON "device_connection_status"("mac_address");
