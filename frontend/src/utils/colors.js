export function getStatusColor(status) {
  const colors = {
    OPEN: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPriorityColor(priority) {
  const colors = {
    LOW: 'bg-gray-100 text-gray-700',
    MEDIUM: 'bg-blue-100 text-blue-700',
    HIGH: 'bg-orange-100 text-orange-700',
    URGENT: 'bg-red-100 text-red-700',
  };

  return colors[priority] || 'bg-gray-100 text-gray-700';
}
