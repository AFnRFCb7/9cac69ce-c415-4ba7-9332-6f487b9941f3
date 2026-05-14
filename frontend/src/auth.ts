import { reactive } from "vue";

const ws = new WebSocket(`${import.meta.env.VITE_SOCKET_BASE}`);

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "USER_UPDATED") {
    if (auth.user?.id === msg.user.id) {
      auth.user = msg.user;
    }
  }
};
export type User = {
    displayName : string,
  id: string,
  email: string | null,
  photo: string | null,
  locale: string | null,
  magicNumber : number
};

const saved = localStorage.getItem("user");

export const auth = reactive({
  user: saved ? JSON.parse(saved) : null,
});


export async function logout() {
  auth.user = null ;
}

export async function loadUser() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/me`, {
    credentials: "include",
  });

  auth.user = await res.json();
}

export async function updateMagicNumber(value) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/me/magic-number`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      magicNumber: value
    })
  });

  const updatedUser = await res.json();
  auth.user = updatedUser;
}