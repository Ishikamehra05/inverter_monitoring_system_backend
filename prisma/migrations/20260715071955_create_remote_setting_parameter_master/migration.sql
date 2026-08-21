-- CreateTable
CREATE TABLE "remote_setting_parameter_master" (
    "id" BIGSERIAL NOT NULL,
    "tab" VARCHAR(40) NOT NULL,
    "tab_label" VARCHAR(60) NOT NULL,
    "field_key" VARCHAR(60) NOT NULL,
    "label" VARCHAR(150) NOT NULL,
    "data_type" VARCHAR(20) NOT NULL,
    "unit_or_options" VARCHAR(200),
    "endpoint_path" VARCHAR(120) NOT NULL,
    "display_order" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "register_address" VARCHAR(20),
    "register_type" VARCHAR(20),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "remote_setting_parameter_master_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "remote_setting_parameter_master_tab_idx" ON "remote_setting_parameter_master"("tab");

-- CreateIndex
CREATE UNIQUE INDEX "remote_setting_parameter_master_tab_field_key_key" ON "remote_setting_parameter_master"("tab", "field_key");
