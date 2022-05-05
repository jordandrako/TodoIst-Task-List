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
    const state = hass.states[entityId].state;

    if (state == 'off') {
      this.content.innerHTML = '<strong>All clear</strong>';
    }
    else{
      const tasksList = hass.states[entityId].attributes.all_tasks;

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
          font-size: 1.2em;
          border-left: 2px solid var(--accent-color);
          margin-bottom: 0.75em;
          padding: 0.25em 0.75em;
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
