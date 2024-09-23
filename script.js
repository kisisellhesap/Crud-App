import { v4 as uuidv4 } from "https://cdn.jsdelivr.net/npm/uuid@9.0.0/dist/esm-browser/index.js";

const allClearBtn = document.querySelector(".clear-btn");
const submitBtn = document.querySelector(".submit-btn");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");

const alertContent = document.querySelector(".alert");

let editMode = false;
let dataList = JSON.parse(localStorage.getItem("dataList")) || [];
let editId = null;

const saveLs = () => {
  localStorage.setItem("dataList", JSON.stringify(dataList));
};

const addItem = (e) => {
  e.preventDefault();
  let id = uuidv4();
  let value = input.value.trim();

  if (value !== "" && !editMode) {
    dataList.push({ id: id, value: value });
    alertError("Add Item", "success");
  } else if (value !== "" && editMode) {
    // console.log(editId);

    dataList.map((item) => {
      if (item.id === editId) {
        item.value = value;
      }
    });

    submitBtn.textContent = "Add";
    editMode = false;
    alertError("Update Item", "edit");
  }

  // console.log(editMode);

  input.value = "";
  getData();
};

const createItem = (id, value) => {
  let item = `
      <div class="items-list-item" data-id=${id}>
              <p class="item-name">${value}</p>
              <div class="btn-container">
                <button class="edit-btn">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="delete-btn">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
      `;

  return item;
};

const clearBtnDisplay = () => {
  if (dataList.length == 0) {
    allClearBtn.style.display = "none";
  } else {
    allClearBtn.style.display = "block";
  }
};

const getData = () => {
  itemList.innerHTML = "";
  for (const item of dataList) {
    const itemDiv = createItem(item.id, item.value);
    itemList.insertAdjacentHTML("beforeend", itemDiv);
  }

  addClickToDeleteBtn();
  addClickToEditBtn();
  clearBtnDisplay();
  saveLs();

  console.log(dataList);
};

const deleteItem = (e) => {
  let itemId =
    e.target.parentElement.parentElement.parentElement.getAttribute("data-id");

  dataList.forEach((item, index) => {
    if (itemId == item.id) {
      dataList.splice(index, 1);
    }
  });
  alertError("Remove Item", "danger");
  getData();
};

const addClickToDeleteBtn = () => {
  const deleteBtns = document.querySelectorAll(".delete-btn");

  for (const deleteBtn of deleteBtns) {
    deleteBtn.addEventListener("click", deleteItem);
  }
};

const alertError = (message, color) => {
  alertContent.textContent = message;
  alertContent.classList.add(`alert-${color}`);
  submitBtn.disabled = true;
  setTimeout(() => {
    alertContent.textContent = "";
    alertContent.classList.remove(`alert-${color}`);
    submitBtn.disabled = false;
  }, 1000);
};

const addClickToEditBtn = () => {
  const editBtns = document.querySelectorAll(".edit-btn");

  for (const editBtn of editBtns) {
    editBtn.addEventListener("click", editItem);
  }
};

const editItem = (e) => {
  editMode = true;
  if (editMode) {
    let itemId =
      e.target.parentElement.parentElement.parentElement.getAttribute(
        "data-id"
      );

    editId = itemId;

    for (const item of dataList) {
      if (itemId == item.id) {
        input.value = item.value;
        // console.log(item);
      }
    }
  }
  submitBtn.textContent = "Edit";
  // console.log(editMode);
};
const clearFonction = () => {
  if (dataList.length !== 0) {
    dataList = [];
  }
  alertError("Clear All Items", "danger");
  getData();
};
submitBtn.addEventListener("click", addItem);

allClearBtn.addEventListener("click", clearFonction);

getData();
