interface CreateTaskFormProps {
  onCreate: (title: string) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateTaskForm({ onCreate, isSubmitting }: CreateTaskFormProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();

    if (!title) {
      return;
    }

    await onCreate(title);
    form.reset();
  };

  return (
    <form className="card create-form" onSubmit={handleSubmit}>
      <h2>Create Task</h2>
      <div className="form-row">
        <input
          name="title"
          type="text"
          placeholder="Task title"
          disabled={isSubmitting}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}
