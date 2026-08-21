-- CreateEnum
CREATE TYPE "ChipType" AS ENUM ('MASTER_DSP', 'SLAVE_DSP', 'CSB', 'DCDC_DSP', 'AFCI', 'BMS1', 'BMS2', 'LCD');

-- CreateEnum
CREATE TYPE "UpdateType" AS ENUM ('NORMAL', 'FORCE');

-- CreateEnum
CREATE TYPE "FotaJobStatus" AS ENUM ('PENDING', 'SENDING_INFORMATION', 'LINK_SAVED', 'DOWNLOADING', 'DOWNLOAD_COMPLETED', 'FLASHING', 'RESTARTING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "CommandLogStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'TIMEOUT');

-- CreateTable
CREATE TABLE "firmware" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "chip_type" "ChipType",
    "version" VARCHAR(255) NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',
    "file_path" TEXT NOT NULL,
    "file_size" BIGINT,
    "created_by" BIGINT,
    "created_time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_time" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "firmware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upgrade_task" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "created_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "upgrade_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_job" (
    "task_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,

    CONSTRAINT "task_job_pkey" PRIMARY KEY ("task_id","job_id")
);

-- CreateTable
CREATE TABLE "fota_job" (
    "job_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "plant_id" BIGINT NOT NULL,
    "logger_imei" VARCHAR(20) NOT NULL,
    "inverter_serial_no" VARCHAR(50) NOT NULL,
    "current_firmware" VARCHAR(255),
    "new_firmware_version" VARCHAR(255) NOT NULL,
    "firmware_id" UUID,
    "chipType" "ChipType" NOT NULL,
    "update_type" "UpdateType" NOT NULL,
    "firmware_url" TEXT NOT NULL,
    "status" "FotaJobStatus" NOT NULL DEFAULT 'PENDING',
    "failure_reason" TEXT,
    "step_timeout_seconds" INTEGER NOT NULL DEFAULT 240,
    "step_deadline_at" TIMESTAMPTZ(6) NOT NULL,
    "started_by" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "fota_job_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "fota_config" (
    "id" SMALLINT NOT NULL DEFAULT 1,
    "step_timeout_seconds" INTEGER NOT NULL DEFAULT 240,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fota_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fota_command_log" (
    "id" BIGSERIAL NOT NULL,
    "job_id" UUID NOT NULL,
    "step_sequence" SMALLINT NOT NULL,
    "command_sent" TEXT NOT NULL,
    "raw_response" TEXT,
    "parsed_result" VARCHAR(100),
    "status" "CommandLogStatus" NOT NULL DEFAULT 'PENDING',
    "sent_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMPTZ(6),

    CONSTRAINT "fota_command_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_firmware_name" ON "firmware"("name");

-- CreateIndex
CREATE INDEX "idx_firmware_version" ON "firmware"("version");

-- CreateIndex
CREATE INDEX "idx_firmware_chip_type" ON "firmware"("chip_type");

-- CreateIndex
CREATE INDEX "idx_fota_job_deadline_watch" ON "fota_job"("step_deadline_at");

-- CreateIndex
CREATE INDEX "idx_fota_command_log_job_id" ON "fota_command_log"("job_id");

-- CreateIndex
CREATE INDEX "idx_fota_command_log_status" ON "fota_command_log"("status");

-- AddForeignKey
ALTER TABLE "firmware" ADD CONSTRAINT "firmware_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upgrade_task" ADD CONSTRAINT "upgrade_task_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_job" ADD CONSTRAINT "task_job_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "upgrade_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_job" ADD CONSTRAINT "task_job_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "fota_job"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fota_job" ADD CONSTRAINT "fota_job_plant_id_fkey" FOREIGN KEY ("plant_id") REFERENCES "plants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fota_job" ADD CONSTRAINT "fota_job_firmware_id_fkey" FOREIGN KEY ("firmware_id") REFERENCES "firmware"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fota_job" ADD CONSTRAINT "fota_job_started_by_fkey" FOREIGN KEY ("started_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fota_command_log" ADD CONSTRAINT "fota_command_log_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "fota_job"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;
