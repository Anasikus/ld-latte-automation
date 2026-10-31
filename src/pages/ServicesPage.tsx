
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Check,
  X,
  Power,
  LoaderCircle,
  Layers3,
} from 'lucide-react';

import {
  catalogService,
  type CatalogService,
} from '../services/catalogService';

import { getErrorMessage } from '../utils/getErrorMessage';

import '../styles/services.scss';

export default function ServicesPage() {
  const [services, setServices] = useState<CatalogService[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const admin = await catalogService.isAdmin();
        if (!active) return;

        setIsAdmin(admin);

        if (admin) {
          const data = await catalogService.getAll();
          if (active) setServices(data);
        }
      } catch (err) {
        if (active) {
          setError(
            getErrorMessage(err, 'Не удалось загрузить каталог')
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  function clearMessages() {
    setError('');
    setNotice('');
  }

  async function addService() {
    const trimmed = name.trim();

    if (!trimmed || saving) return;

    setSaving(true);
    clearMessages();

    try {
      const created = await catalogService.create(trimmed);

      setServices((previous) =>
        [...previous, created].sort((a, b) => a.id - b.id)
      );

      setName('');
      setNotice('Услуга успешно добавлена');
    } catch (err) {
      setError(
        getErrorMessage(err, 'Не удалось добавить услугу')
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditing(service: CatalogService) {
    clearMessages();
    setEditingId(service.id);
    setEditingName(service.name);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingName('');
  }

  async function updateService(
    id: number,
    changes: Partial<Pick<CatalogService, 'name' | 'active'>>
  ): Promise<boolean> {
    if (saving) return false;

    setSaving(true);
    clearMessages();

    try {
      const updated = await catalogService.update(id, changes);

      setServices((previous) =>
        previous.map((item) =>
          item.id === id ? updated : item
        )
      );

      setNotice('Изменения сохранены');
      return true;
    } catch (err) {
      setError(
        getErrorMessage(err, 'Не удалось сохранить изменения')
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function saveEditing(id: number) {
    const trimmed = editingName.trim();
    if (!trimmed || saving) return;

    const original = services.find((service) => service.id === id);

    if (original?.name === trimmed) {
      cancelEditing();
      return;
    }

    const success = await updateService(id, { name: trimmed });

    if (success) cancelEditing();
  }

  async function toggleService(service: CatalogService) {
    await updateService(service.id, {
      active: !service.active,
    });
  }

  const activeCount = services.filter((service) => service.active).length;

  if (loading) {
    return (
      <div className="loading-screen">
        <LoaderCircle className="services-spin" size={22} />
        Загрузка каталога...
      </div>
    );
  }

  if (!isAdmin && !error) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-layout">
      <main className="workspace services-workspace">
        <Link to="/" className="services-back">
          <ArrowLeft size={18} />
          Вернуться к заявкам
        </Link>

        <div className="services-heading">
          <div>
            <span className="eyebrow">УПРАВЛЕНИЕ КАТАЛОГОМ</span>
            <h1>Услуги LD LATTE</h1>
            <p>
              Добавляйте и редактируйте услуги.
              Telegram-бот автоматически обновит меню
              при следующей команде /start.
            </p>
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

        {isAdmin && (
          <>
            <section className="services-overview">
              <div className="services-overview-icon">
                <Layers3 size={24} />
              </div>
              <div>
                <span>Всего услуг</span>
                <strong>{services.length}</strong>
              </div>
              <div>
                <span>Активных</span>
                <strong>{activeCount}</strong>
              </div>
              <div>
                <span>Отключённых</span>
                <strong>{services.length - activeCount}</strong>
              </div>
            </section>

            <section className="services-panel">
              <div className="services-panel-heading">
                <div>
                  <h2>Добавить услугу</h2>
                  <p>Новая услуга сразу станет доступна в Telegram.</p>
                </div>
              </div>

              <form
                className="services-create"
                onSubmit={(event) => {
                  event.preventDefault();
                  void addService();
                }}
              >
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Например, автоматизация отчётов"
                  aria-label="Название новой услуги"
                  maxLength={120}
                  disabled={saving}
                  required
                />

                <button
                  type="submit"
                  className="button-primary"
                  disabled={saving || !name.trim()}
                >
                  <Plus size={18} />
                  Добавить
                </button>
              </form>
            </section>

            <section className="services-panel">
              <div className="services-panel-heading">
                <div>
                  <h2>Каталог услуг</h2>
                  <p>{services.length} услуг в базе данных</p>
                </div>
              </div>

              <div className="services-list">
                {services.length === 0 && (
                  <div className="services-empty">
                    Пока нет услуг. Добавьте первую выше.
                  </div>
                )}

                {services.map((service) => {
                  const editing = editingId === service.id;

                  return (
                    <article
                      className={`service-item ${
                        !service.active ? 'service-item-disabled' : ''
                      }`}
                      key={service.id}
                    >
                      <div className="service-main">
                        <div className="service-avatar">
                          <Layers3 size={19} />
                        </div>

                        <div className="service-details">
                          <span className="service-id">
                            УСЛУГА #{service.id}
                          </span>

                          {editing ? (
                            <form
                              className="service-edit-form"
                              onSubmit={(event) => {
                                event.preventDefault();
                                void saveEditing(service.id);
                              }}
                            >
                              <input
                                autoFocus
                                value={editingName}
                                onChange={(event) =>
                                  setEditingName(event.target.value)
                                }
                                maxLength={120}
                                aria-label="Новое название услуги"
                                disabled={saving}
                                required
                              />

                              <button
                                type="submit"
                                className="service-icon-button save"
                                disabled={saving || !editingName.trim()}
                                title="Сохранить"
                                aria-label="Сохранить название"
                              >
                                <Check size={18} />
                              </button>

                              <button
                                type="button"
                                className="service-icon-button"
                                onClick={cancelEditing}
                                disabled={saving}
                                title="Отмена"
                                aria-label="Отменить редактирование"
                              >
                                <X size={18} />
                              </button>
                            </form>
                          ) : (
                            <h3>{service.name}</h3>
                          )}

                          <span
                            className={`service-status ${
                              service.active ? 'active' : 'inactive'
                            }`}
                          >
                            <span className="service-status-dot" />
                            {service.active ? 'Активна' : 'Отключена'}
                          </span>
                        </div>
                      </div>

                      {!editing && (
                        <div className="service-actions">
                          <button
                            type="button"
                            className="service-action-button"
                            disabled={saving}
                            onClick={() => startEditing(service)}
                          >
                            <Pencil size={16} />
                            Изменить
                          </button>

                          <button
                            type="button"
                            className={`service-action-button ${
                              service.active ? 'danger' : 'enable'
                            }`}
                            disabled={saving}
                            onClick={() => void toggleService(service)}
                          >
                            <Power size={16} />
                            {service.active ? 'Отключить' : 'Включить'}
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}