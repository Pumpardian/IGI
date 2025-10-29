let formElements = [];

//Checkbox
const toggleLabel = document.createElement("label");
toggleLabel.textContent = "Show element creation";
toggleLabel.htmlFor = "creation-toggle";

const toggleInput = document.createElement("input");
toggleInput.type = "checkbox";
toggleInput.id = "creation-toggle";
toggleInput.addEventListener("change", function()
{
  panel.style.display = this.checked ? "block" : "none";
});

document.body.appendChild(toggleLabel);
document.body.appendChild(toggleInput);

const form = document.createElement("form");

//Div for creation
const panel = document.createElement("div");
panel.id = "creation-panel";
panel.style.display = "none";

//name
const nameLabel = document.createElement("label");
nameLabel.textContent = "name:";
nameLabel.htmlFor = "name-field";

const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.id = "name-field";

panel.appendChild(nameLabel);
panel.appendChild(nameInput);

//placeholder
const placeholderLabel = document.createElement("label");
placeholderLabel.textContent = "placeholder:";
placeholderLabel.htmlFor = "placeholder-field";

const placeholderInput = document.createElement("input");
placeholderInput.type = "text";
placeholderInput.id = "placeholder-field";

panel.appendChild(placeholderLabel);
panel.appendChild(placeholderInput);

//maxLength
const maxLengthLabel = document.createElement("label");
maxLengthLabel.textContent = "maxLength:";
maxLengthLabel.htmlFor = "maxLength-field";

const maxLengthInput = document.createElement("input");
maxLengthInput.type = "number";
maxLengthInput.id = "maxLength-field";
maxLengthInput.min = 1;
maxLengthInput.max = 100;
maxLengthInput.value = 1;
maxLengthInput.addEventListener("change", function()
{
  valueInput.maxLength = this.value;
  valueInput.value = valueInput.value.slice(0, this.value);
});

panel.appendChild(maxLengthLabel);
panel.appendChild(maxLengthInput);

//value
const valueLabel = document.createElement("label");
valueLabel.textContent = "value:";
valueLabel.htmlFor = "value-field";

const valueInput = document.createElement("input");
valueInput.type = "text";
valueInput.id = "value-field";
valueInput.value = "A";
valueInput.maxLength = maxLengthInput.value;

panel.appendChild(valueLabel);
panel.appendChild(valueInput);

//readonly
const readonlyLabel = document.createElement("label");
readonlyLabel.textContent = "readonly:";
readonlyLabel.htmlFor = "readonly-field";

const readonlyInput = document.createElement("input");
readonlyInput.type = "checkbox";
readonlyInput.id = "readonly-field";

panel.appendChild(readonlyLabel);
panel.appendChild(readonlyInput);

//disabled
const disabledLabel = document.createElement("label");
disabledLabel.textContent = "disabled:";
disabledLabel.htmlFor = "disabled-field";

const disabledInput = document.createElement("input");
disabledInput.type = "checkbox";
disabledInput.id = "disabled-field";

panel.appendChild(disabledLabel);
panel.appendChild(disabledInput);

//create button
const createButton = document.createElement("button");
createButton.type = "button";
createButton.textContent = "Create form element";
createButton.addEventListener("click", function()
{
  let newFormElement = document.createElement("input");
  newFormElement.setAttribute("type", "text");
  newFormElement.setAttribute("name", nameInput.value);
  newFormElement.setAttribute("placeholder", placeholderInput.value);
  newFormElement.setAttribute("maxLength", maxLengthInput.value);
  newFormElement.setAttribute("value", valueInput.value);
  if (disabledInput.checked)
  {
    newFormElement.setAttribute("disabled", "true");
  }
  if (readonlyInput.checked)
  {
    newFormElement.setAttribute("readonly", "true");
  }

  form.appendChild(newFormElement);
  formElements.push(newFormElement.outerHTML);

  alert(newFormElement.outerHTML);
  alert(newFormElement.innerHTML);
  localStorage.setItem("formElements", formElements.join("@,@"));
});
panel.appendChild(createButton);

//Add panel & form
document.body.appendChild(panel);
document.body.appendChild(form);

alert(localStorage.getItem("formElements"));
if (localStorage.getItem("formElements"))
{
  localStorage.getItem("formElements").split("@,@").forEach((element) =>
  {
    elementNode = document.createElement("input");
    form.appendChild(elementNode);
    elementNode.outerHTML = element;
    formElements.push(element);
  });

  localStorage.setItem("formElements", formElements.join("@,@"));
}