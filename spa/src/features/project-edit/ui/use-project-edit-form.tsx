import { FormProvider } from 'react-hook-form';
import { Button } from '../../../shared/ui/button';
import AdminFormShell, {
  AdminFormSection,
} from '../../../shared/ui/form/admin-form-shell';
import FormInput from '../../../shared/ui/form/form-input';
import { cn } from '../../../shared/lib/utils';
import {
  getFormStatusLabel,
  getFormStatusTone,
} from '../../../shared/lib/form-status';
import { useProjectEdit } from '../model/use-project-edit';
import type { EditProjectType } from '../../../entities/projects/model/schema';

type Props = {
  pId: number;
  initialValues: EditProjectType;
  onSuccess?: () => void;
  isFetching?: boolean;
};

const ProjectEditForm = ({
  pId,
  initialValues,
  onSuccess,
  isFetching,
}: Props) => {
  const { form, onSubmit, updateState } = useProjectEdit({
    pId,
    initialValues,
    onSuccess,
  });

  const isSaving = form.formState.isSubmitting || updateState.isLoading;
  const statusLabel = getFormStatusLabel(
    {
      isError: updateState.isError,
      isSaving,
      isSuccess: updateState.isSuccess,
    },
    {
      error: 'Ошибка',
      saving: 'Сохранение',
      success: 'Сохранено',
      idle: 'Черновик',
    }
  );
  const statusTone = getFormStatusTone({
    isError: updateState.isError,
    isSaving,
    isSuccess: updateState.isSuccess,
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="admin-form">
        <AdminFormShell
          title="Проект"
          description="Обновите основные сведения и статус проекта."
          eyebrow="Проекты"
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
                <span className="admin-form-meta__label">ID проекта</span>
                <span className="admin-form-meta__id">{pId}</span>
              </div>
            </div>
          }
        >
          <AdminFormSection
            title="Данные проекта"
            description="Название, описание и дата завершения."
            contentClassName="admin-form-section__content--two"
          >
            <FormInput
              disabled={isFetching}
              name="name"
              label="Название"
              placeholder="Например, Worknest MVP"
            />
            {/* <FormInput
              name="endedAt"
              label="Дата завершения"
              placeholder="YYYY-MM-DD"
              type="date"
            /> */}
            <FormInput
              disabled={isFetching}
              name="description"
              label="Описание"
              placeholder="Коротко о проекте"
              containerClassName="admin-form-field--full"
              isTextarea
            />
          </AdminFormSection>
        </AdminFormShell>
      </form>
    </FormProvider>
  );
};

export default ProjectEditForm;
