import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import {
  CATEGORY,
  PRIORITY,
  TICKET_STATUS,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '../../constants/index.js';

const createSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
  createdById: z.string().min(1, 'Created by is required'),
});

const editSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
  status: z.string().min(1, 'Status is required'),
});

function TicketForm({
  mode = 'create',
  initialData = {},
  users = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const isEdit = mode === 'edit';
  const schema = isEdit ? editSchema : createSchema;

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
      priority: initialData.priority || '',
      status: initialData.status || '',
      createdById: initialData.createdById || '',
    },
  });

  const categoryOptions = CATEGORY.map((cat) => ({
    value: cat,
    label: CATEGORY_LABELS[cat],
  }));

  const priorityOptions = PRIORITY.map((p) => ({
    value: p,
    label: PRIORITY_LABELS[p],
  }));

  const statusOptions = TICKET_STATUS.map((s) => ({
    value: s,
    label: STATUS_LABELS[s],
  }));

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.name} (${user.role})`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Title"
        placeholder="Enter ticket title"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe the issue..."
          className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Category"
          options={categoryOptions}
          error={errors.category?.message}
          {...register('category')}
        />

        <Select
          label="Priority"
          options={priorityOptions}
          error={errors.priority?.message}
          {...register('priority')}
        />
      </div>

      {isEdit ? (
        <Select
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />
      ) : (
        <Select
          label="Created By"
          options={userOptions}
          error={errors.createdById?.message}
          {...register('createdById')}
        />
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Ticket' : 'Create Ticket'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default TicketForm;
