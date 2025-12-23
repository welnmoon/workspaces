// Workspace Switcher — выбор рабочего пространства, роль пользователя

// Project Card — метрики проекта, прогресс/статусы

// Task Card — приоритет, дедлайн, исполнитель, статус

// Kanban Board — DnD, статусы, фильтры

// Members & Roles — OWNER/ADMIN/MEMBER (это прям важная фича)

// Invites — приглашение по email/ссылка

// Billing / Plan — Free vs Pro, ограничения, апгрейд (Stripe)

// Activity / Audit Log — кто что сделал (если есть/планируешь)

// Analytics Widget — графики “created vs completed” и т.п.

// Empty/Skeleton/Error states — покажи “качество”, а не только happy path

const ShowCase = () => {
  return (
    <section className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <h2 className="visually-hidden">Show Worknest advantages</h2>

      {/*COL #1*/}
      <aside>1</aside>
      {/*COL #2*/}
      <aside>2</aside>
      {/*COL #3*/}
      <aside>3</aside>
      {/*COL #4*/}
      <aside>4</aside>
    </section>
  );
};

export default ShowCase;
