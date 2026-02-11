export type FormStatusLabels = {
  error: string;
  saving: string;
  success: string;
  idle: string;
};

export type FormStatusState = {
  isError?: boolean;
  isSaving?: boolean;
  isSuccess?: boolean;
};

export const getFormStatusLabel = (
  state: FormStatusState,
  labels: FormStatusLabels
) => {
  if (state.isError) return labels.error;
  if (state.isSaving) return labels.saving;
  if (state.isSuccess) return labels.success;
  return labels.idle;
};

export const getFormStatusTone = (state: FormStatusState) => {
  if (state.isError) return 'admin-form-status-dot--error';
  if (state.isSaving) return 'admin-form-status-dot--warning';
  if (state.isSuccess) return 'admin-form-status-dot--success';
  return 'admin-form-status-dot--muted';
};
