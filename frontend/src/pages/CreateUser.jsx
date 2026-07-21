import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserManagement } from '../hooks/useUserManagement.js';
import UserForm from '../components/UserForm.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function CreateUser() {
  const navigate = useNavigate();
  const { createUser, loading, error } = useUserManagement();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data) {
    setIsSubmitting(true);

    try {
      await createUser(data);
      navigate('/users');
    } catch {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create User</h1>
          <p className="page-subtitle">Add a new user to the system</p>
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="panel">
        <UserForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/users')}
          isSubmitting={isSubmitting || loading}
          submitLabel="Create User"
          requirePassword
        />
      </div>
    </div>
  );
}

export default CreateUser;
