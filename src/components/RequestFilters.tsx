
import { Search } from 'lucide-react';
import {
  REQUEST_STATUSES,
  type RequestStatus,
} from '../types/request';

interface Props {
  search: string;
  status: RequestStatus | 'Все';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: RequestStatus | 'Все') => void;
}

export default function RequestFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="request-filters">
      <div className="search-field">
        <Search size={19} />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по названию..."
          aria-label="Поиск заявок"
        />
      </div>

      <select
        aria-label="Фильтр по статусу"
        value={status}
        onChange={(e) =>
          onStatusChange(
            e.target.value as RequestStatus | 'Все'
          )
        }
      >
        <option value="Все">Все статусы</option>
        {REQUEST_STATUSES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
