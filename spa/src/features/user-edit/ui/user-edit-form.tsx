import { FormProvider } from 'react-hook-form';
import { Button } from '../../../shared/ui/button';
import AdminFormShell, {
  AdminFormSection,
} from '../../../shared/ui/form/admin-form-shell';
import FormInput from '../../../shared/ui/form/form-input';
import { cn } from '../../../shared/lib/utils';
import { useUserEdit } from '../model/use-user-edit';
import FormSelect from '../../../shared/ui/form/form-select';
import type { EditUserSchemaType } from '../../../entities/user/model/schema';

const tariffItems = [
  { label: 'pro', value: 'PRO' },
  { label: 'business', value: 'BUSINESS' },
  { label: 'free', value: 'FREE' },
];

const UserEditForm = (props: {
  userId: string;
  initialValues?: EditUserSchemaType;
}) => {
  const { form, onSubmit, updateState } = useUserEdit({
    userId: props.userId,
    initialValues: props.initialValues,
  });

  const isSaving = form.formState.isSubmitting || updateState.isLoading;
  const statusLabel = updateState.isError
    ? 'Error'
    : isSaving
      ? 'Saving'
      : updateState.isSuccess
        ? 'Saved'
        : 'Draft';
  const statusTone = updateState.isError
    ? 'admin-form-status-dot--error'
    : isSaving
      ? 'admin-form-status-dot--warning'
      : updateState.isSuccess
        ? 'admin-form-status-dot--success'
        : 'admin-form-status-dot--muted';

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="admin-form">
        <AdminFormShell
          title="User profile"
          description="Manage identity details and account access from a single panel."
          eyebrow="Users"
          actions={
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          }
          aside={
            <div className="admin-form-meta">
              <div className="admin-form-meta__title">Session</div>
              <div className="admin-form-meta__row">
                <span className="admin-form-meta__label">Status</span>
                <span className="admin-form-meta__value">
                  <span className={cn('admin-form-status-dot', statusTone)} />
                  {statusLabel}
                </span>
              </div>
              <div className="admin-form-meta__row">
                <span className="admin-form-meta__label">User ID</span>
                <span className="admin-form-meta__id">{props.userId}</span>
              </div>
            </div>
          }
        >
          <AdminFormSection
            title="Profile"
            description="Basic identity and contact details."
            contentClassName="admin-form-section__content--two"
          >
            <FormInput
              name="firstName"
              label="First name"
              placeholder="Add first name"
            />
            <FormInput
              name="lastName"
              label="Last name"
              placeholder="Add last name"
            />
            <FormInput
              name="email"
              label="Email"
              placeholder="name@company.com"
              containerClassName="admin-form-field--full"
            />
            <FormSelect items={tariffItems} name="currentTariff" />
          </AdminFormSection>
          <AdminFormSection
            title="Security"
            description="Reset credentials and keep access secure."
          >
            <FormInput
              name="password"
              label="Password"
              placeholder="Set a new password"
              isPassword
            />
            <FormInput
              name="confirmPassword"
              label="Confirm password"
              placeholder="Confirm password"
              isPassword
            />
          </AdminFormSection>
        </AdminFormShell>
      </form>
    </FormProvider>
  );
};

export default UserEditForm;
