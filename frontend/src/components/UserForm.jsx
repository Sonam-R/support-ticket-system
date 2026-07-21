import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ROLE, ROLE_LABELS } from '../constants/index.js';

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  role: z.enum(ROLE, { message: 'Role is required' }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  role: z.enum(ROLE, { message: 'Role is required' }),
});

function UserForm({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Save User',
  requirePassword = false,
}) {
  const schema = requirePassword ? createUserSchema : updateUserSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      role: initialData.role || 'VIEWER',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter full name"
          className={errors.name ? 'input-error' : ''}
          {...register('name')}
        />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="user@example.com"
          className={errors.email ? 'input-error' : ''}
          {...register('email')}
        />
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="role">Role</label>
        <select id="role" className={errors.role ? 'input-error' : ''} {...register('role')}>
          {ROLE.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        {errors.role && <p className="field-error">{errors.role.message}</p>}
      </div>

      {requirePassword && (
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            className={errors.password ? 'input-error' : ''}
            {...register('password')}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>
      )}

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default UserForm;
