const MAX_IN_PROGRESS = 3;
const columns = ["To do", "In progress", "Done"];
const priorityNames = ["", "Low", "Medium", "High"];

const tasks = [
  { id: 1, title: "Plan page structure", tag: "HTML", priority: 3, status: "Done", required: true, steps: ["Choose sections", "Draw a small sketch"] },
  { id: 2, title: "Write HTML sections", tag: "HTML", priority: 3, status: "In progress", required: true, steps: ["Add headings", "Check the page order"] },
  { id: 3, title: "Add navigation links", tag: "HTML", priority: 2, status: "To do", required: true, steps: ["Link the pages", "Mark the current page"] },
  { id: 4, title: "Style the header", tag: "CSS", priority: 2, status: "Done", required: false, steps: ["Choose colors", "Set the spacing"] },
  { id: 5, title: "Make cards responsive", tag: "CSS", priority: 3, status: "In progress", required: true, steps: ["Use a grid", "Check small screens"] },
  { id: 6, title: "Practice DOM selectors", tag: "JavaScript", priority: 1, status: "To do", required: false, steps: ["Find an element", "Change its text"] },
  { id: 7, title: "Add button events", tag: "JavaScript", priority: 3, status: "To do", required: true, steps: ["Add a listener", "Handle a click"] },
  { id: 8, title: "Validate the form", tag: "JavaScript", priority: 3, status: "To do", required: true, steps: ["Check each field", "Show clear errors"] },
  { id: 9, title: "Test on mobile", tag: "CSS", priority: 2, status: "To do", required: true, steps: ["Check 375 pixels", "Look for overflow"] },
  { id: 10, title: "Write the report", tag: "HTML", priority: 1, status: "To do", required: true, steps: ["Take screenshots", "Explain the code"] }
];

const board = document.getElementById("board");
const searchInput = document.getElementById("task-search");
const tagFilter = document.getElementById("tag-filter");
const sortSelect = document.getElementById("priority-sort");
const progressBar = document.getElementById("board-progress");
const summary = document.getElementById("board-summary");
const message = document.getElementById("board-message");
const emptyMessage = document.getElementById("board-empty");
let feedback = "Use Back and Next to move a task. The progress bar counts every task, including hidden ones.";
let feedbackType = "is-neutral";

// Read the tags from the data so new tags also appear in the filter.
const tags = [""];
for (const task of tasks) {
  if (!tags.includes(task.tag)) {
    tags.push(task.tag);
  }
}
for (const tag of tags) {
  const option = document.createElement("option");
  option.value = tag;
  option.textContent = tag === "" ? "All tags" : tag;
  tagFilter.append(option);
}

function countTasks(status) {
  let count = 0;
  for (const task of tasks) {
    if (task.status === status) {
      count++;
    }
  }
  return count;
}

function makeButton(task, action, label, disabled) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button button-secondary";
  button.textContent = label;
  button.dataset.id = task.id;
  button.dataset.action = action;
  button.disabled = disabled;
  button.setAttribute("aria-label", label + ": " + task.title);
  return button;
}

// Rebuild the board from the current array after each change.
function render(focusId, focusAction) {
  board.replaceChildren();
  const search = searchInput.value.trim().toLowerCase();
  const visibleTasks = tasks.filter(function (task) {
    const matchesTag = tagFilter.value === "" || task.tag === tagFilter.value;
    const text = task.title + " " + task.steps.join(" ");
    return matchesTag && text.toLowerCase().includes(search);
  });
  visibleTasks.sort(function (first, second) {
    if (sortSelect.value === "low") {
      return first.priority - second.priority;
    }
    return second.priority - first.priority;
  });

  for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
    const status = columns[columnIndex];
    const column = document.createElement("section");
    column.className = "board-column";
    const heading = document.createElement("h2");
    heading.textContent = status + " (" + countTasks(status) + ")";
    column.append(heading);
    let visibleInColumn = 0;

    for (const task of visibleTasks) {
      if (task.status !== status) {
        continue;
      }
      visibleInColumn++;
      const card = document.createElement("article");
      card.className = "task-card";
      card.dataset.cardId = task.id;
      if (task.status === "Done") {
        card.classList.add("is-done");
      }
      const title = document.createElement("h3");
      title.textContent = task.title;
      const meta = document.createElement("div");
      meta.className = "card-meta";
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = task.tag;
      const priority = document.createElement("span");
      priority.className = "priority priority-" + task.priority;
      priority.textContent = priorityNames[task.priority] + " priority";
      meta.append(tag, priority);
      const details = document.createElement("p");
      details.className = "task-details";
      details.textContent = task.steps.join("; ") + ".";
      const required = document.createElement("p");
      required.className = "task-required";
      required.textContent = task.required ? "Required" : "Extra practice";
      const actions = document.createElement("div");
      actions.className = "card-actions";
      actions.append(
        makeButton(task, "back", "Back", columnIndex === 0),
        makeButton(task, "next", "Next", columnIndex === columns.length - 1)
      );
      card.append(title, meta, details, required, actions);
      column.append(card);
    }

    if (visibleInColumn === 0) {
      const empty = document.createElement("p");
      empty.className = "column-empty";
      empty.textContent = "No matching tasks in this column.";
      column.append(empty);
    }
    board.append(column);
  }

  const done = countTasks("Done");
  progressBar.max = tasks.length || 1;
  progressBar.value = done;
  summary.textContent = done + " of " + tasks.length + " tasks finished. " + countTasks("In progress") + " of " + MAX_IN_PROGRESS + " in-progress places used.";
  message.textContent = feedback;
  message.className = "message " + feedbackType;
  emptyMessage.hidden = visibleTasks.length !== 0;
  emptyMessage.textContent = "No tasks match your search and tag. Try another word or choose All tags.";

  // Keep keyboard focus on the same card after its buttons are rebuilt.
  if (focusId !== undefined) {
    const card = board.querySelector('[data-card-id="' + focusId + '"]');
    if (card) {
      let button = card.querySelector('[data-action="' + focusAction + '"]');
      if (!button || button.disabled) {
        button = card.querySelector("button:not(:disabled)");
      }
      if (button) {
        button.focus();
      }
    }
  }
}

// One listener handles the buttons on every card.
board.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button || !board.contains(button) || button.disabled) {
    return;
  }
  const task = tasks.find(function (item) {
    return item.id === Number(button.dataset.id);
  });
  const action = button.dataset.action;
  if (!task || (action !== "back" && action !== "next")) {
    feedback = "That task or move is not available.";
    feedbackType = "is-error";
    render();
    return;
  }

  const currentIndex = columns.indexOf(task.status);
  let nextIndex = currentIndex + 1;
  if (action === "back") {
    nextIndex = currentIndex - 1;
  }
  if (nextIndex < 0 || nextIndex >= columns.length) {
    feedback = "This task cannot move beyond the first or last column.";
    feedbackType = "is-error";
  } else if (columns[nextIndex] === "In progress" && countTasks("In progress") >= MAX_IN_PROGRESS) {
    feedback = "In progress is full. Move one of its three tasks before adding another.";
    feedbackType = "is-error";
  } else {
    task.status = columns[nextIndex];
    feedback = task.title + " moved to " + task.status + ".";
    feedbackType = "is-success";
  }
  render(task.id, action);
});

function updateFilters() {
  feedback = "The view has changed. The counts and progress bar still include every task.";
  feedbackType = "is-neutral";
  render();
}

searchInput.addEventListener("input", updateFilters);
tagFilter.addEventListener("change", updateFilters);
sortSelect.addEventListener("change", updateFilters);
render();
