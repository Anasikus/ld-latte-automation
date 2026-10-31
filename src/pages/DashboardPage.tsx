
import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  LogOut,
  ClipboardList,
  Clock3,
  CheckCircle2,
  Settings2,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';

import RequestCard from '../components/RequestCard';
import RequestForm from '../components/RequestForm';
import RequestFilters from '../components/RequestFilters';

import type {
  AutomationRequest,
  RequestFormData,
  RequestStatus,
} from '../types/request';

import { Link } from 'react-router-dom';
import { catalogService } from '../services/catalogService';  

import '../styles/dashboard.scss';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  const [requests, setRequests] = useState<AutomationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<RequestStatus | 'Все'>('Все');

  const [formOpen, setFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] =
    useState<AutomationRequest | null>(null);

  const [loggingOut, setLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      setLoading(true);
      setError('');

      try {
        const data = await requestService.getAll();

        if (active) {
          setRequests(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Не удалось загрузить заявки'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadRequests();

    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let active = true;

    setIsAdmin(false);

    async function checkAdmin() {
      try {
        const admin = await catalogService.isAdmin();

        if (active) {
          setIsAdmin(admin);
        }
      } catch (err) {
        console.error('Не удалось проверить права администратора', err);

        if (active) {
          setIsAdmin(false);
        }
      }
    }

    if (user) {
      void checkAdmin();
    }

    return () => {
      active = false;
    };
  }, [user?.id]);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch = request.title
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'Все' ||
        request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const stats = useMemo(() => ({
    total: requests.length,
    inProgress: requests.filter(
      (item) => item.status === 'В работе'
    ).length,
    completed: requests.filter(
      (item) => item.status === 'Завершена'
    ).length,
  }), [requests]);

  function openCreateForm() {
    setEditingRequest(null);
    setFormOpen(true);
    setNotice('');
  }

  function openEditForm(request: AutomationRequest) {
    setEditingRequest(request);
    setFormOpen(true);
    setNotice('');
  }

  function closeForm() {
    setFormOpen(false);
    setEditingRequest(null);
  }

  async function handleSave(form: RequestFormData) {
    if (!user) {
      throw new Error('Необходимо войти в аккаунт');
    }

    if (editingRequest) {
      const updated = await requestService.update(
        editingRequest.id,
        form
      );

      setRequests((previous) =>
        previous.map((item) =>
          item.id === updated.id ? updated : item
        )
      );

      setNotice('Заявка успешно обновлена');
    } else {
      const created = await requestService.create(
        user.id,
        form
      );

      setRequests((previous) => [created, ...previous]);
      setNotice('Заявка успешно создана');
    }

    closeForm();
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError('');

    try {
      await signOut();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось выйти из аккаунта'
      );
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">LD</div>
            <div>
              <strong>LD LATTE</strong>
              <span>Automation Workspace</span>
            </div>
          </div>

          <div className="header-actions">
            <span className="user-email">{user?.email}</span>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Выйти из аккаунта"
            >
              <LogOut size={18} />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="workspace">
        <div className="page-heading">
          <div>
            <span className="eyebrow">РАБОЧЕЕ ПРОСТРАНСТВО</span>
            <h1>Заявки на автоматизацию</h1>
            <p>
              Создавайте заявки и отслеживайте их выполнение
              в одном месте.
            </p>
          </div>

          <div className="dashboard-heading-actions">
            {isAdmin && (
              <Link
                to="/services"
                className="dashboard-services-link"
              >
                <Settings2 size={18} />
                Управление услугами
              </Link>
            )}

            <button
              type="button"
              className="button-primary create-button"
              onClick={openCreateForm}
            >
              <Plus size={19} />
              Новая заявка
            </button>
          </div>
        </div>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="form-success" role="status">
            {notice}
          </div>
        )}

        <section className="stats-grid" aria-label="Статистика заявок">
          <div className="stat-card">
            <div className="stat-icon stat-total">
              <ClipboardList size={21} />
            </div>
            <div>
              <span>Всего заявок</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-progress">
              <Clock3 size={21} />
            </div>
            <div>
              <span>В работе</span>
              <strong>{stats.inProgress}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-completed">
              <CheckCircle2 size={21} />
            </div>
            <div>
              <span>Завершено</span>
              <strong>{stats.completed}</strong>
            </div>
          </div>
        </section>

        <section className="requests-section">
          <div className="section-heading">
            <h2>Мои заявки</h2>
            <span>{filteredRequests.length} найдено</span>
          </div>

          <RequestFilters
            search={search}
            status={statusFilter}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
          />

          {loading ? (
            <div className="empty-state" role="status">
              Загрузка заявок...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={42} />
              <h3>
                {requests.length === 0
                  ? 'Пока нет заявок'
                  : 'Ничего не найдено'}
              </h3>
              <p>
                {requests.length === 0
                  ? 'Создайте первую заявку на автоматизацию.'
                  : 'Попробуйте изменить параметры поиска.'}
              </p>
            </div>
          ) : (
            <div className="requests-grid">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onEdit={openEditForm}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {formOpen && (
        <RequestForm
          key={editingRequest?.id ?? 'new'}
          request={editingRequest}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
