import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CATEGORY,
  PRIORITY,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
} from '../constants/index.js';

const createSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
  createdById: z.string().min(1, 'Created by is required'),
  assignedTo: z.string().optional(),
});

const editSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
  assignedTo: z.string().optional(),
});

function TicketForm({
  mode = 'create',
  initialData = {},
  users = [],
  assignableUsers,
  createdById,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const isEdit = mode === 'edit';
  const schema = isEdit ? editSchema : createSchema;
  const assignees = assignableUsers ?? users;
  const useFixedCreator = Boolean(createdById);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      category: initialData.category || '',
      priority: initialData.priority || 'MEDIUM',
      createdById: createdById || initialData.createdById || '',
      assignedTo: initialData.assignedTo?.id || '',
    },
  });

  function handleFormSubmit(data) {
    const payload = { ...data };

    if (useFixedCreator) {
      payload.createdById = createdById;
    }

    if (payload.assignedTo === '') {
      payload.assignedTo = null;
    }

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {useFixedCreator && <input type="hidden" {...register('createdById')} />}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter ticket title"
          className={errors.title ? 'input-error' : ''}
          {...register('title')}
        />
        {errors.title && <p className="field-error">{errors.title.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe the issue..."
          className={errors.description ? 'input-error' : ''}
          {...register('description')}
        />
        {errors.description && (
          <p className="field-error">{errors.description.message}</p>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className={errors.category ? 'input-error' : ''}
            {...register('category')}
          >
            <option value="">Select category</option>
            {CATEGORY.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="field-error">{errors.category.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            className={errors.priority ? 'input-error' : ''}
            {...register('priority')}
          >
            {PRIORITY.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
          {errors.priority && (
            <p className="field-error">{errors.priority.message}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="assignedTo">Assign To</label>
        <select id="assignedTo" {...register('assignedTo')}>
          <option value="">Unassigned</option>
          {assignees.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
      </div>

      {!isEdit && !useFixedCreator && (
        <div className="form-group">
          <label htmlFor="createdById">Created By</label>
          <select
            id="createdById"
            className={errors.createdById ? 'input-error' : ''}
            {...register('createdById')}
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
          {errors.createdById && (
            <p className="field-error">{errors.createdById.message}</p>
          )}
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Ticket' : 'Create Ticket'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TicketForm;
