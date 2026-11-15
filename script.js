document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.querySelector('[data-year]');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');

  if (taskForm && taskInput && taskList) {
    const storageKey = 'studentPlannerTasks';
    const defaultTasks = [
      { id: 1, text: 'Review calculus notes and prepare quiz revision', completed: true },
      { id: 2, text: 'Finish UI design draft for web assignment', completed: false },
      { id: 3, text: 'Submit software engineering lab report', completed: false }
    ];

    function getStoredTasks() {
      try {
        const savedTasks = JSON.parse(localStorage.getItem(storageKey));
        return Array.isArray(savedTasks) && savedTasks.length ? savedTasks : defaultTasks;
      } catch (error) {
        return defaultTasks;
      }
    }

    let tasks = getStoredTasks();

    function saveTasks() {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    }

    function renderTasks() {
      taskList.innerHTML = '';

      if (!tasks.length) {
        emptyState.style.display = 'block';
        return;
      }

      emptyState.style.display = 'none';

      tasks.forEach((task) => {
        const item = document.createElement('li');
        item.className = `task-item ${task.completed ? 'completed' : ''}`;

        const main = document.createElement('div');
        main.className = 'task-main';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', `Mark ${task.text} as complete`);

        const text = document.createElement('span');
        text.className = 'task-text';
        text.textContent = task.text;

        main.appendChild(checkbox);
        main.appendChild(text);

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const completeBtn = document.createElement('button');
        completeBtn.type = 'button';
        completeBtn.className = 'icon-btn complete';
        completeBtn.textContent = task.completed ? 'Undo' : 'Done';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'icon-btn delete';
        deleteBtn.textContent = 'Delete';

        checkbox.addEventListener('change', () => {
          toggleTask(task.id);
        });

        completeBtn.addEventListener('click', () => {
          toggleTask(task.id);
        });

        deleteBtn.addEventListener('click', () => {
          deleteTask(task.id);
        });

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(main);
        item.appendChild(actions);
        taskList.appendChild(item);
      });
    }

    function addTask(text) {
      const trimmedText = text.trim();
      if (!trimmedText) {
        return;
      }

      tasks.unshift({
        id: Date.now(),
        text: trimmedText,
        completed: false
      });

      saveTasks();
      renderTasks();
    }

    function toggleTask(id) {
      tasks = tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });

      saveTasks();
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks();
    }

    taskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      addTask(taskInput.value);
      taskForm.reset();
      taskInput.focus();
    });

    renderTasks();
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const formStatus = document.getElementById('form-status');
    const fields = {
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      phone: document.getElementById('phone'),
      message: document.getElementById('message')
    };

    function markError(fieldName, valid) {
      const field = fields[fieldName];
      if (!field) return;
      field.classList.toggle('input-error', !valid);
    }

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let isValid = true;

      Object.entries(fields).forEach(([name, field]) => {
        const value = field.value.trim();
        const empty = !value;

        if (empty) {
          isValid = false;
          markError(name, false);
          return;
        }

        markError(name, true);

        if (name === 'email') {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const validEmail = emailPattern.test(value);
          if (!validEmail) {
            isValid = false;
            markError(name, false);
          }
        }

        if (name === 'phone') {
          const digitsOnly = /^\d+$/;
          if (!digitsOnly.test(value)) {
            isValid = false;
            markError(name, false);
          }
        }
      });

      if (isValid && formStatus) {
        formStatus.textContent = 'Your message has been sent successfully!';
        contactForm.reset();
      } else if (formStatus) {
        formStatus.textContent = 'Please correct the highlighted fields and try again.';
        formStatus.style.color = '#dc2626';
      }
    });
  }
});
