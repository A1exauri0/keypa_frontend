import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../components/ui/feedback/Toast';

export default function useCrudBase({
  listFn,
  createFn,
  updateFn,
  deleteManyFn,
  loadExtras,
  getId,
  initialFilterValue = 'todos',
  filterFn,
  messages,
}) {
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [extras, setExtras] = useState({});
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState(initialFilterValue);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('crear');
  const [currentItem, setCurrentItem] = useState(null);
  const listFnRef = useRef(listFn);
  const loadExtrasRef = useRef(loadExtras);
  const requestSeqRef = useRef(0);

  useEffect(() => {
    listFnRef.current = listFn;
  }, [listFn]);

  useEffect(() => {
    loadExtrasRef.current = loadExtras;
  }, [loadExtras]);

  const resolveId = useCallback(
    (item) => {
      if (typeof getId === 'function') {
        return getId(item);
      }

      const idKey = getId || 'id';
      return item?.[idKey];
    },
    [getId],
  );

  const loadData = useCallback(async () => {
    const requestId = ++requestSeqRef.current;
    setLoading(true);
    try {
      const currentListFn = listFnRef.current;
      const currentLoadExtras = loadExtrasRef.current;
      const [rowsData, extrasData] = await Promise.all([
        currentListFn(),
        typeof currentLoadExtras === 'function' ? currentLoadExtras() : Promise.resolve({}),
      ]);

      if (requestId !== requestSeqRef.current) {
        return;
      }

      setRows(Array.isArray(rowsData) ? rowsData : []);
      setExtras(extrasData || {});
    } catch (error) {
      if (requestId !== requestSeqRef.current) {
        return;
      }

      toast({
        title: messages.loadErrorTitle,
        message: error.response?.data?.message || messages.loadErrorMessage,
        variant: 'danger',
      });
    } finally {
      if (requestId === requestSeqRef.current) {
        setLoading(false);
      }
    }
  }, [messages.loadErrorTitle, messages.loadErrorMessage, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRows = useMemo(() => {
    if (typeof filterFn !== 'function') {
      return rows;
    }

    const q = search.trim().toLowerCase();
    return rows.filter((item) => filterFn(item, { q, filterValue, extras }));
  }, [rows, search, filterValue, extras, filterFn]);

  const openCreate = useCallback(() => {
    setModalMode('crear');
    setCurrentItem(null);
    setModalOpen(true);
  }, []);

  const openEditById = useCallback(
    (id) => {
      const item = rows.find((row) => resolveId(row) === id);
      if (!item) {
        return;
      }

      setModalMode('editar');
      setCurrentItem(item);
      setModalOpen(true);
    },
    [rows, resolveId],
  );

  const openEdit = useCallback((item) => {
    if (!item) {
      return;
    }

    setModalMode('editar');
    setCurrentItem(item);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const saveItem = useCallback(
    async (payload) => {
      if (!createFn || !updateFn) {
        return;
      }

      setSaving(true);
      try {
        if (modalMode === 'editar' && currentItem) {
          await updateFn(resolveId(currentItem), payload);
          toast({ title: messages.updatedTitle, variant: 'success' });
        } else {
          await createFn(payload);
          toast({ title: messages.createdTitle, variant: 'success' });
        }

        setModalOpen(false);
        await loadData();
      } catch (error) {
        toast({
          title: messages.saveErrorTitle,
          message: error.response?.data?.message || messages.saveErrorMessage,
          variant: 'danger',
        });
      } finally {
        setSaving(false);
      }
    },
    [
      createFn,
      updateFn,
      modalMode,
      currentItem,
      resolveId,
      toast,
      messages.updatedTitle,
      messages.createdTitle,
      messages.saveErrorTitle,
      messages.saveErrorMessage,
      loadData,
    ],
  );

  const deleteMany = useCallback(
    async (ids, onDone) => {
      if (!deleteManyFn) {
        return;
      }

      try {
        await deleteManyFn(ids);
        toast({ title: messages.deletedManyTitle, variant: 'warning' });
        if (typeof onDone === 'function') {
          onDone();
        }
        await loadData();
      } catch (error) {
        toast({
          title: messages.deleteErrorTitle,
          message: error.response?.data?.message || messages.deleteErrorMessage,
          variant: 'danger',
        });
      }
    },
    [deleteManyFn, toast, messages.deletedManyTitle, messages.deleteErrorTitle, messages.deleteErrorMessage, loadData],
  );

  const deleteOne = useCallback(
    async (id) => {
      if (!deleteManyFn) {
        return;
      }

      try {
        await deleteManyFn([id]);
        toast({ title: messages.deletedOneTitle, variant: 'warning' });
        await loadData();
      } catch (error) {
        toast({
          title: messages.deleteErrorTitle,
          message: error.response?.data?.message || messages.deleteErrorMessage,
          variant: 'danger',
        });
      }
    },
    [deleteManyFn, toast, messages.deletedOneTitle, messages.deleteErrorTitle, messages.deleteErrorMessage, loadData],
  );

  const toggleActive = useCallback(
    async (item) => {
      if (!updateFn || !item) {
        return;
      }

      try {
        await updateFn(resolveId(item), { activo: !item.activo });
        toast({ title: item.activo ? messages.deactivatedTitle : messages.activatedTitle, variant: 'success' });
        await loadData();
      } catch (error) {
        toast({
          title: messages.toggleErrorTitle,
          message: error.response?.data?.message || messages.toggleErrorMessage,
          variant: 'danger',
        });
      }
    },
    [updateFn, resolveId, toast, messages.deactivatedTitle, messages.activatedTitle, messages.toggleErrorTitle, messages.toggleErrorMessage, loadData],
  );

  return {
    rows,
    extras,
    filteredRows,
    search,
    setSearch,
    filterValue,
    setFilterValue,
    loading,
    saving,
    modalOpen,
    modalMode,
    currentItem,
    setCurrentItem,
    loadData,
    openCreate,
    openEdit,
    openEditById,
    closeModal,
    saveItem,
    deleteMany,
    deleteOne,
    toggleActive,
  };
}
