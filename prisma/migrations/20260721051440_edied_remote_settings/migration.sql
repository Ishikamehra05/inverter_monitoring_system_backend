-- DropForeignKey
ALTER TABLE "device_remote_setting_tasks" DROP CONSTRAINT "device_remote_setting_tasks_device_inverter_id_fkey";

-- DropForeignKey
ALTER TABLE "device_remote_settings" DROP CONSTRAINT "device_remote_settings_device_inverter_id_fkey";
