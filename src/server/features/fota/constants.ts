export const CHIP_TYPES = [
	'MASTER_DSP',
	'SLAVE_DSP',
	'CSB',
	'DCDC_DSP',
	'AFCI',
	'BMS1',
	'BMS2',
	'LCD',
] as const;

export const UPDATE_TYPES = ['NORMAL', 'FORCE'] as const;

export const FOTA_JOB_STATUSES = [
	'PENDING',
	'SENDING_INFORMATION',
	'LINK_SAVED',
	'DOWNLOADING',
	'DOWNLOAD_COMPLETED',
	'FLASHING',
	'RESTARTING',
	'COMPLETED',
	'FAILED',
] as const;

export const COMMAND_LOG_STATUSES = ['PENDING', 'SUCCESS', 'FAILED', 'TIMEOUT'] as const;

export const DEFAULT_STEP_TIMEOUT_SECONDS = 240;

// GUI status message mapping — coding_action/batch_task_database_plan_api.md Section 3.
export const FOTA_JOB_STATUS_MESSAGES: Record<string, string> = {
	PENDING: 'Pending',
	SENDING_INFORMATION: 'Sending firmware information',
	LINK_SAVED: 'Firmware information saved',
	DOWNLOADING: 'Downloading firmware',
	DOWNLOAD_COMPLETED: 'Firmware downloaded',
	FLASHING: 'Installing firmware',
	RESTARTING: 'Inverter is restarting',
	COMPLETED: 'Firmware updated successfully',
	FAILED: 'Firmware update failed',
};
