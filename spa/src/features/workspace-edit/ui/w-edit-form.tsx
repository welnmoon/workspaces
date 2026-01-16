import { FormProvider } from 'react-hook-form';
import { Button } from '../../../shared/ui/button';
import AdminFormShell, {
  AdminFormSection,
} from '../../../shared/ui/form/admin-form-shell';
import FormInput from '../../../shared/ui/form/form-input';
import { cn } from '../../../shared/lib/utils';
import { useWorkspaceEdit } from '../model/use-workspace-edit';
import type { EditWorkspace } from '../../../entities/workspace/model/schema';

const WorkspaceEditForm = (props: {
  wId: string;
  initialValues?: EditWorkspace;
}) => {
  const { form, onSubmit, updateState } = useWorkspaceEdit({
    wId: props.wId,
    initialValues: props.initialValues,
  });

  const isSaving = form.formState.isSubmitting || updateState.isLoading;
  const statusLabel = updateState.isError
    ? 'Ошибка'
    : isSaving
      ? 'Сохранение'
      : updateState.isSuccess
        ? 'Сохранено'
        : 'Черновик';
  const statusTone = updateState.isError
    ? 'admin-form-status-dot--error'
    : isSaving
      ? 'admin-form-status-dot--warning'
      : updateState.isSuccess
        ? 'admin-form-status-dot--success'
        : 'admin-form-status-dot--muted';

  return (
    <FormProvider {...form}>
      {JSON.stringify(updateState.error)}
      <form onSubmit={onSubmit} className="admin-form">
        <AdminFormShell
          title="Настройки воркспейса"
          description="Обновите название, описание и визуальные атрибуты."
          eyebrow="Воркспейсы"
          badge={`ID ${props.wId.slice(0, 8)}`}
          actions={
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          }
          aside={
            <div className="admin-form-meta">
              <div className="admin-form-meta__title">Сессия</div>
              <div className="admin-form-meta__row">
                <span className="admin-form-meta__label">Статус</span>
                <span className="admin-form-meta__value">
                  <span className={cn('admin-form-status-dot', statusTone)} />
                  {statusLabel}
                </span>
              </div>
              <div className="admin-form-meta__row">
                <span className="admin-form-meta__label">ID воркспейса</span>
                <span className="admin-form-meta__id">{props.wId}</span>
              </div>
            </div>
          }
        >
          <AdminFormSection
            title="Данные воркспейса"
            description="Название, описание и изображение."
            contentClassName="admin-form-section__content--two"
          >
            <FormInput
              name="name"
              label="Название"
              placeholder="Например, Worknest"
            />
            <FormInput
              name="avatarUrl"
              label="Аватар (URL)"
              placeholder="https://..."
            />
            <FormInput
              name="description"
              label="Описание"
              placeholder="Коротко о воркспейсе"
              containerClassName="admin-form-field--full"
              isTextarea
            />
          </AdminFormSection>
        </AdminFormShell>
      </form>
    </FormProvider>
  );
};

export default WorkspaceEditForm;
