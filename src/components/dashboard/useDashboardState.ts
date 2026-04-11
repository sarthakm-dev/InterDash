import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import type { SortOrder, UseDashboardStateOptions, Post } from '../../lib/types';



export const useDashboardState = ({
  posts,
  todos,
  users,
  comments,
  photos,
  albums,
  setTodos,
  addToast,
}: UseDashboardStateOptions) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterText, setFilterText] = useState('');
  const [selectedItems, setSelectedItems] = useState<unknown[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<unknown>(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const toggleTimeoutsRef = useRef<number[]>([]);
  const itemsPerPage = 10;

  const openModal = (content: unknown) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddTodo = (text: string) => {
    const newTodo = { id: todos.length + 1, title: text, completed: false, userId: 1 };
    setTodos((currentTodos) => [...currentTodos, newTodo]);
  };

  const handleEditTodo = (id: number, text: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === id ? { ...todo, title: text } : todo)),
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = (id: number) => {
    const timeoutId = window.setTimeout(() => {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    }, 500);

    toggleTimeoutsRef.current.push(timeoutId);
  };

  const handleSelectItem = (item: unknown) => {
    setSelectedItems((currentItems) => [...currentItems.slice(-50), item]);
  };

  const getSortedAndFilteredPosts = () => {
    let filteredPosts = posts;

    if (filterText) {
      const normalizedFilter = filterText.toLowerCase();
      filteredPosts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(normalizedFilter) ||
          post.body.toLowerCase().includes(normalizedFilter),
      );
    }

    return _.orderBy(filteredPosts, ['id'], [sortOrder]);
  };

  const getPaginatedData = (data: Post[]) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  };

  const totalPages = (data: Post[]) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const handleFormChange = (field: string, value: unknown) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.profileName || formData.profileName.trim().length < 2) {
      errors.profileName = 'Name must be at least 2 characters';
    }

    if (!formData.profileEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.profileEmail)) {
      errors.profileEmail = 'Enter a valid email address';
    }

    if (!formData.profileBio || formData.profileBio.length > 200) {
      errors.profileBio = 'Bio must be between 1 and 200 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSave = () => {
    const isValid = validateForm();

    if (isValid) {
      addToast('Profile saved!', 'success');
      return;
    }

    addToast('Please fix the errors', 'error');
  };

  useEffect(() => {
    return () => {
      toggleTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    const dashboardState = {
      todos,
      posts,
      users,
      comments,
      photos,
      albums,
      activeTab,
      page,
      filterText,
      sortOrder,
      selectedItems,
      formData,
    };

    localStorage.setItem('dashboardState', JSON.stringify(dashboardState));
  }, [
    todos,
    posts,
    users,
    comments,
    photos,
    albums,
    activeTab,
    page,
    filterText,
    sortOrder,
    selectedItems,
    formData,
  ]);

  return {
    activeTab,
    setActiveTab,
    sortOrder,
    setSortOrder,
    filterText,
    setFilterText,
    modalOpen,
    modalContent,
    openModal,
    closeModal,
    page,
    setPage,
    formData,
    validationErrors,
    handleAddTodo,
    handleEditTodo,
    handleDeleteTodo,
    handleToggleTodo,
    handleSelectItem,
    getSortedAndFilteredPosts,
    getPaginatedData,
    totalPages,
    handleFormChange,
    handleProfileSave,
  };
};
