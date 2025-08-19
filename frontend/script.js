const API = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");
const headers = { "Content-Type": "application/json" };

const setLoading = (isLoading) => {
  const loading = document.getElementById("loading");
  loading.style.display = isLoading ? "block" : "none";
};

const setButtonState = (buttonId, disabled) => {
  const button = document.getElementById(buttonId);
  button.disabled = disabled;
};

document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    setButtonState("registerBtn", true);
    const body = {
      username: regUsername.value,
      email: regEmail.value,
      password: regPassword.value,
      firstName: firstName.value,
      lastName: lastName.value,
    };
    try {
      const res = await fetch(`${API}/auth/register/register`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      alert(data.message || (res.ok ? "Registered!" : "Registration failed"));
    } catch (error) {
      alert("Error: Could not connect to server");
    } finally {
      setButtonState("registerBtn", false);
      document.getElementById("registerForm").reset();
    }
  });

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  setButtonState("loginBtn", true);
  const body = {
    username: loginUsername.value,
    password: loginPassword.value,
  };
  try {
    const res = await fetch(`${API}/auth/login/validateCredentials`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok && data.result?.accessToken) {
      localStorage.setItem("token", data.result.accessToken);
      localStorage.setItem("username", data.result.username);
      alert("Logged in!");
      document.getElementById("loginForm").reset();
      loadTasks();
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    alert("Error: Could not connect to server");
  } finally {
    setButtonState("loginBtn", false);
  }
});

document.getElementById("verifyBtn").addEventListener("click", async () => {
  setButtonState("verifyBtn", true);
  try {
    const res = await fetch(`${API}/auth/login/`, {
      method: "POST",
      headers: { ...headers, "access-token": token() },
      body: JSON.stringify({ username: localStorage.getItem("username") }),
    });
    const data = await res.json();
    alert(data.message || (res.ok ? "Token OK" : "Token invalid"));
  } catch (error) {
    alert("Error: Could not connect to server");
  } finally {
    setButtonState("verifyBtn", false);
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  alert("Logged out");
  document.getElementById("taskList").innerHTML = "";
});

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  setButtonState("addTaskBtn", true);
  const body = {
    title: taskTitle.value,
    description: taskDescription.value,
    category: taskCategory.value,
    status: "pending",
  };
  try {
    const res = await fetch(`${API}/tasks/create`, {
      method: "POST",
      headers: { ...headers, "access-token": token() },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      document.getElementById("taskForm").reset();
      loadTasks();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to add task");
    }
  } catch (error) {
    alert("Error: Could not connect to server");
  } finally {
    setButtonState("addTaskBtn", false);
  }
});

document.getElementById("statusFilter").addEventListener("change", loadTasks);

async function loadTasks() {
  setLoading(true);
  try {
    const res = await fetch(`${API}/tasks`, {
      headers: { "access-token": token() },
    });
    const tasks = await res.json();
    const statusFilter = document.getElementById("statusFilter").value;
    const filteredTasks =
      statusFilter === "all"
        ? tasks
        : tasks.filter((t) => t.status === statusFilter);
    const ul = document.getElementById("taskList");
    ul.innerHTML = "";
    filteredTasks.forEach((t) => {
      const li = document.createElement("li");
      li.className = t.status === "completed" ? "completed" : "";
      li.innerHTML = `
        <div>
          <strong>Title:</strong> ${t.title} <br>
          <strong>Description:</strong> ${t.description || "—"} <br>
          <strong>Status:</strong> ${t.status} <br>
          <strong>Category:</strong> ${t.category || "—"}
        </div>
        <span>
          <input type="checkbox" ${
            t.status === "completed" ? "checked" : ""
          } onchange="toggleTaskStatus('${t._id}', this.checked)">
          <button onclick="updateTask('${t._id}')">Edit</button>
          <button onclick="deleteTask('${t._id}')">Delete</button>
        </span>`;
      ul.appendChild(li);
    });
  } catch (error) {
    alert("Error: Could not load tasks");
  } finally {
    setLoading(false);
  }
}

async function toggleTaskStatus(id, isChecked) {
  try {
    const newStatus = isChecked ? "completed" : "pending";
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: { ...headers, "access-token": token() },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      loadTasks();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to update status");
    }
  } catch (error) {
    alert("Error: Could not connect to server");
  }
}

async function updateTask(id) {
  const newTitle = prompt("New title:");
  const newDescription = prompt("New description:");
  if (!newTitle && !newDescription) return;
  try {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: { ...headers, "access-token": token() },
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    });
    if (res.ok) {
      loadTasks();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to update task");
    }
  } catch (error) {
    alert("Error: Could not connect to server");
  }
}

async function deleteTask(id) {
  try {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
      headers: { "access-token": token() },
    });
    if (res.ok) {
      loadTasks();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to delete task");
    }
  } catch (error) {
    alert("Error: Could not connect to server");
  }
}

if (token()) {
  loadTasks();
}
