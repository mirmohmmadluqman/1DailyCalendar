// Directory: 1DailyCalender/scripts/calendar.js

const currentDate = new Date();
let notesData = {};
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
const calendarContainer = document.getElementById("calendar");

function generateCalendar(month, year) {
  calendarContainer.innerHTML = "";
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    calendarContainer.appendChild(emptyDiv);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${month + 1}-${day}`;
    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;
    dayDiv.dataset.date = dateKey;
    dayDiv.addEventListener("click", () => openPopup(dateKey));
    calendarContainer.appendChild(dayDiv);
  }
}

document.getElementById("prevMonth").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentMonth, currentYear);
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentMonth, currentYear);
});

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

function openPopup(dateKey) {
  const popup = document.getElementById("notePopup");
  const titleInput = document.getElementById("noteTitle");
  const bodyInput = document.getElementById("noteBody");

  titleInput.value = notesData[dateKey]?.title || "";
  bodyInput.value = notesData[dateKey]?.body || "";

  popup.classList.remove("hidden");

  document.getElementById("saveNote").onclick = () => {
    notesData[dateKey] = {
      title: titleInput.value,
      body: bodyInput.value
    };
    saveNotes();
    popup.classList.add("hidden");
  };

  document.getElementById("closePopup").onclick = () => {
    popup.classList.add("hidden");
  };
}

function saveNotes() {
  localStorage.setItem("calendarNotes", JSON.stringify(notesData));
}

function loadNotes() {
  const saved = localStorage.getItem("calendarNotes");
  if (saved) {
    notesData = JSON.parse(saved);
  }
}

function importNotes(jsonString) {
  try {
    const imported = JSON.parse(jsonString);
    notesData = { ...notesData, ...imported };
    saveNotes();
    alert("Notes imported successfully.");
  } catch {
    alert("Invalid data format.");
  }
}

document.getElementById("exportBtn").addEventListener("click", () => {
  const data = JSON.stringify(notesData);
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "calendar-notes.json";
  link.click();
});

document.getElementById("importBtn").addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      importNotes(reader.result);
    };
    reader.readAsText(file);
  };
  fileInput.click();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const results = Object.keys(notesData).filter(dateKey => {
    return (
      notesData[dateKey].title.toLowerCase().includes(query) ||
      notesData[dateKey].body.toLowerCase().includes(query)
    );
  });
  console.log("Search Results:", results);
  // You can create a search result UI here if needed
});

(function init() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") document.body.classList.add("dark");
  loadNotes();
  generateCalendar(currentMonth, currentYear);
})();
