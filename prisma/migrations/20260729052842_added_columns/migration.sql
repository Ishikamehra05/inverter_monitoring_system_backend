-- AlterTable
ALTER TABLE "fota_job" ADD COLUMN     "claimed_at" TIMESTAMPTZ(6),
ADD COLUMN     "last_heartbeat_at" TIMESTAMPTZ(6),
ADD COLUMN     "worker_id" VARCHAR(100);
