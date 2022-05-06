class TodoistTaskList extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement("ha-card");
      card.header = this.config.title;
      this.content = document.createElement("div");
      this.content.style.padding = "16px 16px 16px";

      card.appendChild(this.content);
      this.appendChild(card);
    }

    const entityId = this.config.entity;
    const allTasks = hass.states[entityId].attributes.all_tasks || [];
    const priority = allTasks
      .filter((t) => t.indexOf("p1") >= 0)
      .map((t) => t.replace(/\s?p1\s?/g, ""))
      .sort();
    const normal = allTasks.filter((t) => t.indexOf("p1") < 0).sort();

    if (allTasks.length == 0) {
      this.content.innerHTML = "<strong>All clear</strong>";
    } else {
      this.updateHtml(priority, normal);
    }
  }

  formatTask(task, priority) {
    const className = priority ? "priority-task" : "task";
    return (this.content.innerHTML += `<div class="${className}">${task}</div>`);
  }

  updateHtml(priority, normal) {
    this.content.innerHTML = `
      <style>
        .task,
        .priority-task {
          color: var(--text-color);
          font: "var(--primary-font-family)";
          font-size: 1em;
          border-left: 2px solid var(--primary-color);
          margin-bottom: 0.5em;
          padding: 0.25em 1em;
        }
        .priority-task {
          border-left-color: var(--accent-color);
          font-weight: bold;
        }
      </style>
    `;

    priority.forEach((task) => {
      this.content.innerHTML = this.formatTask(task, true);
    });
    normal.forEach((task) => {
      this.content.innerHTML = this.formatTask(task);
    });
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }
}

customElements.define("todoist-task-list", TodoistTaskList);
