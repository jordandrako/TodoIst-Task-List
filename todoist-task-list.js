class TodoistTaskList extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      card.header = this.config.title;
      this.content = document.createElement('div');
      this.content.style.padding = '16px 16px 16px';

      card.appendChild(this.content);
      this.appendChild(card);
    }

    const entityId = this.config.entity;
    const allTasks = hass.states[entityId].attributes.all_tasks || [];
    const priority = allTasks.filter((t) => t.indexOf("p1") >= 0).sort();
    const normal = allTasks.filter((t) => t.indexOf("p1") < 0).sort();
    const taskList = [...priority, ...normal];

    if (tasksList.length == 0) {
      this.content.innerHTML = '<strong>All clear</strong>';
    }
    else {
      this.updateHtml(tasksList);
    }
  }

  formatTask(task) {
    return this.content.innerHTML += `<div class=task>${task}</div>`;
  }

  updateHtml(tasksList) {
    this.content.innerHTML = `
      <style>
        .task {
          margin-bottom: 10px;
          color: var(--text-color);
          font: "var(--primary-font-family)";
          font-size: 1em;
          border-left: 2px solid var(--accent-color);
          margin-bottom: 0.5em;
          padding: 0.25em 1em;
        }
      </style>
    `;

    tasksList.forEach((task) => {
      this.content.innerHTML = this.formatTask(task);
    });
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;

  }

}

customElements.define('todoist-task-list', TodoistTaskList);
