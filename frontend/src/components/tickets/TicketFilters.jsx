import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import { TICKET_STATUS, PRIORITY } from '../../constants/index.js';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../constants/index.js';

function TicketFilters({ filters, onChange }) {
  const statusOptions = [
    { value: 'ALL', label: 'All' },
    ...TICKET_STATUS.map((status) => ({
      value: status,
      label: STATUS_LABELS[status],
    })),
  ];

  const priorityOptions = [
    { value: 'ALL', label: 'All' },
    ...PRIORITY.map((priority) => ({
      value: priority,
      label: PRIORITY_LABELS[priority],
    })),
  ];

  function handleChange(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Search"
          placeholder="Search tickets..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
        />
        <Select
          label="Status"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
          placeholder="All statuses"
        />
        <Select
          label="Priority"
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          options={priorityOptions}
          placeholder="All priorities"
        />
      </div>
    </div>
  );
}

export default TicketFilters;
