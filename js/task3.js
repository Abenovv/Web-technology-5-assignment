const TOTAL_POINTS = 20;
const MAIN_SKILL_MINIMUM = 6;
const takenNames = ["Atlas", "Luna", "Shadow"];

const form = document.getElementById("character-form");
const nameInput = document.getElementById("character-name");
const classInput = document.getElementById("character-class");
const colorInput = document.getElementById("character-color");
const strengthInput = document.getElementById("strength");
const defenseInput = document.getElementById("defense");
const magicInput = document.getElementById("magic");
const speedInput = document.getElementById("speed");
const summary = document.getElementById("form-summary");
const preview = document.getElementById("character-preview");
const pointsCounter = document.getElementById("points-counter");
const result = document.getElementById("character-result");

const fields = [nameInput, classInput, colorInput, strengthInput, defenseInput, magicInput, speedInput];
const skillInputs = [strengthInput, defenseInput, magicInput, speedInput];
const skillNames = ["Strength", "Defense", "Magic", "Speed"];
let touched = {};
let submitted = false;

// Keep HTML rules, but show our own messages instead of browser popups.
form.noValidate = true;

function getTotalPoints() {
  let total = 0;
  for (const input of skillInputs) {
    if (!Number.isNaN(input.valueAsNumber)) {
      total += input.valueAsNumber;
    }
  }
  return total;
}

function getMainSkill() {
  if (classInput.value === "warrior") {
    return strengthInput;
  } else if (classInput.value === "mage") {
    return magicInput;
  } else if (classInput.value === "ranger") {
    return speedInput;
  }
  return null;
}

function getClassName() {
  if (classInput.value === "warrior") {
    return "Warrior";
  } else if (classInput.value === "mage") {
    return "Mage";
  } else if (classInput.value === "ranger") {
    return "Ranger";
  }
  return "Choose a class";
}

function addCustomError(field, message) {
  if (field.validity.customError) {
    field.setCustomValidity(field.validationMessage + " " + message);
  } else {
    field.setCustomValidity(message);
  }
}

function validateFields() {
  // Remove old custom errors before checking the current values.
  for (const field of fields) {
    field.setCustomValidity("");
  }

  const name = nameInput.value.trim();
  if (name.length === 0) {
    nameInput.setCustomValidity("Enter a character name.");
  } else if (name.length < 2) {
    nameInput.setCustomValidity("Use at least 2 characters for the name.");
  } else {
    for (const takenName of takenNames) {
      if (name.toLowerCase() === takenName.toLowerCase()) {
        nameInput.setCustomValidity("This name is already taken. Choose another name.");
      }
    }
  }

  let allSkillsValid = true;
  for (const input of skillInputs) {
    if (!input.checkValidity()) {
      allSkillsValid = false;
    }
  }

  const mainSkill = getMainSkill();
  if (mainSkill !== null && mainSkill.validity.valid) {
    if (mainSkill.valueAsNumber < MAIN_SKILL_MINIMUM) {
      addCustomError(mainSkill, getClassName() + " needs at least " + MAIN_SKILL_MINIMUM + " points in " + mainSkill.name + ".");
    }

    if (allSkillsValid) {
      let anotherSkillIsHigher = false;
      for (const input of skillInputs) {
        if (input.valueAsNumber > mainSkill.valueAsNumber) {
          anotherSkillIsHigher = true;
        }
      }
      if (anotherSkillIsHigher) {
        addCustomError(mainSkill, "The main skill cannot be lower than another skill.");
      }
    }
  }

  // Put the total-points message under the last skill so it has a focus target.
  const total = getTotalPoints();
  if (allSkillsValid && total !== TOTAL_POINTS) {
    addCustomError(speedInput, "Use exactly " + TOTAL_POINTS + " skill points. Your total is " + total + ".");
  }
}

function getErrorMessage(field) {
  if (field.validity.customError) {
    return field.validationMessage;
  }
  if (field.validity.badInput || field.validity.rangeUnderflow || field.validity.rangeOverflow || field.validity.stepMismatch) {
    return "Enter a whole number from 1 to 10.";
  }
  if (field.validity.valueMissing) {
    return "Complete this field.";
  }
  if (field.validity.tooShort) {
    return "Use at least 2 characters.";
  }
  return field.validationMessage;
}

function showErrors() {
  let errorCount = 0;
  for (const field of fields) {
    const error = document.getElementById(field.id + "-error");
    const showError = touched[field.id] && !field.validity.valid;
    field.setAttribute("aria-invalid", showError ? "true" : "false");
    field.classList.toggle("is-invalid", Boolean(showError));
    error.textContent = showError ? getErrorMessage(field) : "";
    if (!field.validity.valid) {
      errorCount += 1;
    }
  }

  summary.hidden = !submitted || errorCount === 0;
  if (submitted && errorCount > 0) {
    const word = errorCount === 1 ? "field" : "fields";
    summary.textContent = "Please fix " + errorCount + " " + word + " before creating your character.";
  } else {
    summary.textContent = "";
  }
}

function updatePreview() {
  const name = nameInput.value.trim();
  document.getElementById("preview-name").textContent = name === "" ? "Your character" : name;
  document.getElementById("preview-class").textContent = getClassName();
  preview.classList.remove("color-blue", "color-green", "color-red");
  if (colorInput.value !== "") {
    preview.classList.add("color-" + colorInput.value);
  }

  for (const input of skillInputs) {
    document.getElementById("preview-" + input.id).textContent = input.value === "" ? "-" : input.value;
  }

  const total = getTotalPoints();
  const pointsLeft = TOTAL_POINTS - total;
  if (pointsLeft >= 0) {
    pointsCounter.textContent = "Points used: " + total + " / " + TOTAL_POINTS + ". Points left: " + pointsLeft + ".";
  } else {
    pointsCounter.textContent = "Points used: " + total + " / " + TOTAL_POINTS + ". Remove " + Math.abs(pointsLeft) + " points.";
  }
  pointsCounter.classList.toggle("is-error", total !== TOTAL_POINTS);
}

function updateForm() {
  validateFields();
  showErrors();
  updatePreview();
}

function createResult() {
  result.replaceChildren();
  const heading = document.createElement("h2");
  heading.textContent = "Character created";
  result.appendChild(heading);

  const message = document.createElement("p");
  message.classList.add("message", "is-success");
  message.textContent = "Your character is ready.";
  result.appendChild(message);

  const card = document.createElement("article");
  card.classList.add("character-card", "color-" + colorInput.value);
  const name = document.createElement("h3");
  name.textContent = nameInput.value.trim();
  card.appendChild(name);
  const characterClass = document.createElement("p");
  characterClass.textContent = getClassName();
  card.appendChild(characterClass);

  const skills = document.createElement("div");
  skills.classList.add("skill-grid");
  for (let index = 0; index < skillInputs.length; index += 1) {
    const skill = document.createElement("p");
    const label = document.createElement("span");
    label.textContent = skillNames[index];
    const value = document.createElement("strong");
    value.textContent = skillInputs[index].value;
    skill.appendChild(label);
    skill.appendChild(value);
    skills.appendChild(skill);
  }
  card.appendChild(skills);
  result.appendChild(card);
  result.hidden = false;
}

function resetForm() {
  form.reset();
  touched = {};
  submitted = false;
  for (const field of fields) {
    field.setCustomValidity("");
    field.setAttribute("aria-invalid", "false");
    field.classList.remove("is-invalid");
    document.getElementById(field.id + "-error").textContent = "";
  }
  summary.textContent = "";
  summary.hidden = true;
  updatePreview();
}

// Avoid moving a clicked button when leaving a field reveals an error.
for (const button of form.querySelectorAll("button")) {
  button.addEventListener("pointerdown", function (event) {
    event.preventDefault();
  });
}

for (const field of fields) {
  field.addEventListener("blur", function () {
    touched[field.id] = true;
    updateForm();
  });
  field.addEventListener("input", updateForm);
  field.addEventListener("change", updateForm);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  submitted = true;
  for (const field of fields) {
    touched[field.id] = true;
  }
  updateForm();

  if (!form.checkValidity()) {
    for (const field of fields) {
      if (!field.validity.valid) {
        field.focus();
        break;
      }
    }
    return;
  }

  createResult();
  takenNames.push(nameInput.value.trim());
  document.getElementById("taken-names").textContent = takenNames.join(", ");
  result.focus();
  resetForm();
});

document.getElementById("reset-character").addEventListener("click", function () {
  resetForm();
  nameInput.focus();
});

updatePreview();
