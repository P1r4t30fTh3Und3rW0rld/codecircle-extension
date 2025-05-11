const BACKEND_URL = 'http://localhost:5000';

// -----------------------------
// Link LeetCode Account
// -----------------------------
document.getElementById("link-account").addEventListener("click", async () => {
  const username = document.getElementById("leetcode-username").value.trim();
  if (!username) return alert("Please enter your LeetCode username");

  try {
    const response = await fetch(`${BACKEND_URL}/api/users/link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leetcodeUsername: username })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("username").textContent = data.leetcodeUsername;
      document.getElementById("problems-solved").textContent = `${data.problemsSolved} problems solved`;
      document.getElementById("stats-container").style.display = "block";

      chrome.storage.local.set({ leetcodeUsername: data.leetcodeUsername, userId: data.userId });

      await loadAllAccounts();
    } else {
      throw new Error(data.message || "Failed to link account");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to connect to backend. Is the server running?");
  }
});

// -----------------------------
// Group Creation & Join Logic
// -----------------------------
document.getElementById("createBtn").addEventListener("click", async () => {
  const name = document.getElementById("groupName").value.trim();
  if (!name) return showMessage("Group name is required");

  const { userId } = await chrome.storage.local.get("userId");

  const res = await fetch(`${BACKEND_URL}/api/groups/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupName: name, userId })
  });

  const data = await res.json();
  showMessage(data.message + (data.code ? ` | Code: ${data.code}` : ''));
});

document.getElementById("joinBtn").addEventListener("click", async () => {
  const code = document.getElementById("groupCode").value.trim().toUpperCase();
  if (!code) return showMessage("Group code is required");

  const { userId } = await chrome.storage.local.get("userId");

  const res = await fetch(`${BACKEND_URL}/api/groups/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, userId })
  });

  const data = await res.json();
  showMessage(data.message);
});

function showMessage(msg) {
  document.getElementById("msg").innerText = msg;
}

// -----------------------------
// Load All Linked Accounts with Delete Option
// -----------------------------
async function loadAllAccounts() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/accounts`);
    const users = await res.json();

    const list = document.getElementById('linked-accounts');
    list.innerHTML = '';

    users.forEach(user => {
      const card = document.createElement("div");
      card.className = "account-card";
      card.innerHTML = `
        <strong>${user.leetcodeUsername}</strong><br>
        ID: ${user._id}<br>
        Problems Solved: ${user.problemsSolved}
        <span class="delete-icon" title="Delete Account" data-user-id="${user._id}" data-username="${user.leetcodeUsername}">delete</span>
      `;
      list.appendChild(card);
    });

    // Handle delete actions
    document.querySelectorAll(".delete-icon").forEach(icon => {
      icon.addEventListener("click", async (e) => {
        const idToDelete = e.target.dataset.userId; // Changed to data-user-id
        const username = e.target.dataset.username;
        console.log("Deleting ID:", idToDelete); // Add this for debugging
        if (confirm(`Remove ${username} (ID: ${idToDelete})?`)) {
          if (idToDelete) { // Ensure idToDelete has a value
            const deleteResponse = await fetch(`${BACKEND_URL}/api/users/${idToDelete}`, {
              method: "DELETE"
            });
            if (deleteResponse.ok) {
              loadAllAccounts(); // Reload after successful deletion
            } else {
              const errorData = await deleteResponse.json();
              console.error('Failed to delete account:', errorData);
              alert(`Failed to delete ${username}: ${errorData.message || 'Unknown error'}`);
            }
          } else {
            console.error("Error: User ID to delete is undefined.");
            alert("Error: Could not determine the user ID to delete.");
          }
        }
      });
    });

  } catch (err) {
    console.error('Failed to load accounts:', err);
  }
}

// Load accounts on popup open
document.addEventListener("DOMContentLoaded", loadAllAccounts);
