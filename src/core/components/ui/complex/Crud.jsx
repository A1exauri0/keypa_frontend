import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '../buttons/Button';
import InputText from '../inputs/InputText';
import Select from '../selectors/Select';
import Checkbox from '../inputs/Checkbox';
import LoadingOverlay from '../feedback/LoadingOverlay';
import ConfirmDialog from '../overlays/ConfirmDialog';

export default function Crud({
  title,
  description,
  rows = [],
  columns = [],
  loading = false,
  getRowId = (row) => row.id,
  searchLabel = 'Buscar',
  searchPlaceholder = 'Buscar...',
  searchValue = '',
  onSearchChange,
  filterLabel,
  filterValue,
  filterOptions = [],
  onFilterChange,
  onCreate,
  onRefresh,
  onEdit,
  onDeleteOne,
  onToggleActive,
  onDeleteMany,
  createLabel = 'Agregar nuevo',
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadingActualizar, setLoadingActualizar] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    mode: null,
    row: null,
    rowId: null,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => rows.some((row) => getRowId(row) === id)));
  }, [rows, getRowId]);

  useEffect(() => {
    setPage(1);
  }, [searchValue, filterValue]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageSafe = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, pageSafe, pageSize]);

  const currentPageIds = useMemo(() => paginatedRows.map((row) => getRowId(row)), [paginatedRows, getRowId]);

  const allCurrentSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));

  const canEdit = selectedIds.length === 1;
  const canDelete = selectedIds.length > 0;

  const toggleAllCurrent = (checked) => {
    if (!checked) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
  };

  const toggleOne = (rowId, checked) => {
    setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, rowId])) : prev.filter((id) => id !== rowId)));
  };

  const handleDelete = () => {
    if (!canDelete || !onDeleteMany) {
      return;
    }
    onDeleteMany(selectedIds, () => setSelectedIds([]));
  };

  const abrirConfirmacion = ({ mode, row, rowId }) => {
    setConfirmState({
      open: true,
      mode,
      row,
      rowId,
    });
  };

  const cerrarConfirmacion = () => {
    if (confirmLoading) {
      return;
    }

    setConfirmState({
      open: false,
      mode: null,
      row: null,
      rowId: null,
    });
  };

  const confirmarAccion = async () => {
    if (!confirmState.open) {
      return;
    }

    setConfirmLoading(true);

    try {
      if (confirmState.mode === 'toggle') {
        await onToggleActive?.(confirmState.row);
      }

      if (confirmState.mode === 'delete') {
        await onDeleteOne?.(confirmState.rowId);
      }

      cerrarConfirmacion();
    } finally {
      setConfirmLoading(false);
    }
  };

  const confirmTitle =
    confirmState.mode === 'toggle'
      ? confirmState.row?.activo
        ? 'Desactivar registro'
        : 'Activar registro'
      : 'Eliminar registro';

  const confirmMessage =
    confirmState.mode === 'toggle'
      ? confirmState.row?.activo
        ? '¿Deseas desactivar este registro?'
        : '¿Deseas activar este registro?'
      : '¿Estás seguro de que deseas eliminar el registro seleccionado?';

  const confirmLabel =
    confirmState.mode === 'toggle'
      ? confirmState.row?.activo
        ? 'Desactivar'
        : 'Activar'
      : 'Eliminar';

  const confirmVariant =
    confirmState.mode === 'toggle'
      ? confirmState.row?.activo
        ? 'danger'
        : 'success'
      : 'danger';

  const handleEdit = async () => {
    setLoadingActualizar(true);

    try {
      if (onRefresh) {
        await onRefresh();
        return;
      }

      if (canEdit && onEdit) {
        await onEdit(selectedIds[0]);
      }
    } finally {
      setTimeout(() => {
        setLoadingActualizar(false);
      }, 300);
    }
  };

  return (
    <>
      <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-5">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 md:text-xl">{title}</h3>
        {description ? <p className="text-sm text-slate-600">{description}</p> : null}
      </header>

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px_auto_auto_auto] md:items-end">
        <InputText
          id={`${title}-search`}
          label={searchLabel}
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />

        {filterOptions.length > 0 ? (
          <Select
            id={`${title}-filter`}
            label={filterLabel || 'Filtro'}
            value={filterValue}
            onChange={onFilterChange}
            options={filterOptions}
          />
        ) : (
          <div className="hidden md:block" />
        )}

        <Button size="md" type="button" onClick={onCreate}>
          <Icon icon="mdi:plus" width="16" />
          {createLabel}
        </Button>

        <Button size="md" type="button" variant="secondary" onClick={handleEdit}>
          <Icon icon="tabler:reload" width="16" />
          Actualizar
        </Button>

        <Button size="md" type="button" variant="danger" onClick={handleDelete} disabled={!canDelete}>
          <Icon icon="mdi:trash-can-outline" width="16" />
          Borrar
        </Button>
      </div>

      {loading ? <p className="text-sm text-slate-500">Cargando...</p> : null}

      {!loading ? (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2 pr-3">
                    <Checkbox checked={allCurrentSelected} onChange={toggleAllCurrent} ariaLabel="Seleccionar todos" />
                  </th>
                  {columns.map((column) => (
                    <th key={column.key} className="py-2 pr-3">
                      {column.label}
                    </th>
                  ))}
                  <th className="py-2 pr-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row) => {
                  const rowId = getRowId(row);
                  const selected = selectedIds.includes(rowId);

                  return (
                    <tr key={rowId} className="border-b border-slate-100">
                      <td className="py-2 pr-3 align-top">
                        <Checkbox checked={selected} onChange={(next) => toggleOne(rowId, next)} ariaLabel={`Seleccionar ${rowId}`} />
                      </td>
                      {columns.map((column) => (
                        <td key={`${rowId}-${column.key}`} className="py-2 pr-3 text-slate-700">
                          {column.render ? column.render(row) : row[column.key]}
                        </td>
                      ))}
                      <td className="py-2 pr-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${row.activo ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                            title={row.activo ? 'Desactivar' : 'Activar'}
                            onClick={() => abrirConfirmacion({ mode: 'toggle', row, rowId })}
                          >
                            <Icon icon={row.activo ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off-outline'} width="18" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700 transition hover:bg-yellow-200"
                            title="Editar"
                            onClick={() => onEdit?.(rowId)}
                          >
                            <Icon icon="mdi:pencil" width="16" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700 transition hover:bg-violet-200"
                            title="Eliminar"
                            onClick={() => abrirConfirmacion({ mode: 'delete', row, rowId })}
                          >
                            <Icon icon="mdi:trash-can-outline" width="16" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {paginatedRows.map((row) => {
              const rowId = getRowId(row);
              const selected = selectedIds.includes(rowId);

              return (
                <div key={rowId} className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">ID: {rowId}</span>
                    <Checkbox checked={selected} onChange={(next) => toggleOne(rowId, next)} ariaLabel={`Seleccionar ${rowId}`} />
                  </div>

                  <dl className="grid gap-1">
                    {columns.map((column) => (
                      <div key={`${rowId}-mobile-${column.key}`} className="grid grid-cols-[110px_1fr] gap-2 text-sm">
                        <dt className="text-slate-500">{column.label}</dt>
                        <dd className="text-slate-800">{column.render ? column.render(row) : row[column.key]}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                      title={row.activo ? 'Desactivar' : 'Activar'}
                      onClick={() => abrirConfirmacion({ mode: 'toggle', row, rowId })}
                    >
                      <Icon icon={row.activo ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off-outline'} width="18" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700 transition hover:bg-violet-200"
                      title="Editar"
                      onClick={() => onEdit?.(rowId)}
                    >
                      <Icon icon="mdi:pencil" width="16" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700 transition hover:bg-rose-200"
                      title="Eliminar"
                      onClick={() => abrirConfirmacion({ mode: 'delete', row, rowId })}
                    >
                      <Icon icon="mdi:trash-can-outline" width="16" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-slate-500">
                {rows.length} registros · {selectedIds.length} seleccionados
              </p>

              <div className="hidden md:block md:min-w-[170px]">
                <Select
                  id={`${title}-pageSize`}
                  value={String(pageSize)}
                  onChange={(value) => {
                    setPageSize(Number(value));
                    setPage(1);
                  }}
                  options={[
                    { label: '10 por pagina', value: '10' },
                    { label: '20 por pagina', value: '20' },
                    { label: '50 por pagina', value: '50' },
                  ]}
                  containerClassName="md:min-w-[170px]"
                />
              </div>

              <div className="hidden md:flex md:items-center md:justify-end md:gap-2">
                <Button size="md" type="button" variant="ghost" className="justify-center" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={pageSafe <= 1}>
                  <Icon icon="mdi:chevron-left" width="16" />
                  <span>Anterior</span>
                </Button>

                <span className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                  Pagina {pageSafe} de {totalPages}
                </span>

                <Button
                  size="md"
                  type="button"
                  variant="ghost"
                  className="justify-center"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={pageSafe >= totalPages}
                >
                  <span>Siguiente</span>
                  <Icon icon="mdi:chevron-right" width="16" />
                </Button>
              </div>

              <div className="grid w-full grid-cols-3 items-center gap-2 md:hidden">
                <Button size="md" type="button" variant="ghost" className="w-full justify-center md:w-auto" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={pageSafe <= 1}>
                  <Icon icon="mdi:chevron-left" width="16" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>

                <span className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                  Pagina {pageSafe} de {totalPages}
                </span>

                <Button
                  size="md"
                  type="button"
                  variant="ghost"
                  className="w-full justify-center"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={pageSafe >= totalPages}
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <Icon icon="mdi:chevron-right" width="16" />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
      </article>

      <LoadingOverlay show={loadingActualizar} message="Actualizando informacion..." />
      <ConfirmDialog
        open={confirmState.open}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel={confirmLabel}
        confirmVariant={confirmVariant}
        loading={confirmLoading}
        onConfirm={confirmarAccion}
        onCancel={cerrarConfirmacion}
      />
    </>
  );
}
