# GistMe 💬

> Real conversations. Real people. Just you and your people — anytime, anywhere.

GistMe is a minimal, frontend-only chat web app built for friends to connect and gist. It uses localStorage for auth and message persistence — no backend required.

---

## Live Demo

> _Add your live URL here_

---

## Screenshots

> _Add screenshots here_

---

## Features

- 🔐 User registration and login with localStorage
- 💬 Real-time-style messaging with sender/receiver bubbles
- 👤 Profile avatar generated from username initials
- 📱 Fully responsive — mobile, tablet, and desktop
- 🍔 Animated hamburger menu for mobile nav
- 🔒 Auth-protected chat page — redirects unauthenticated users
- 🚪 Logout clears session only, registered accounts stay intact

---

## Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Page structure |
| Tailwind CSS v4 | Styling and layout |
| Vanilla JavaScript | Auth logic, chat rendering, routing |
| localStorage | User accounts and chat persistence |
| Google Fonts | DM Mono + Instrument Serif |

---

## Project Structure

```
gistme/
│
├── index.html          # Landing page
├── login.html          # Login page
├── register.html       # Register page
├── chat.html           # Chat app (protected)
│
├── js/
│   ├── login.js        # Login logic + auth guard
│   ├── register.js     # Register logic + auth guard
│   └── chat.js         # Chat logic + auth check + logout
│
└── src/
    ├── input.css       # Tailwind source CSS
    ├── output.css      # Tailwind compiled CSS
    └── public/         # Static assets (images, icons)
```

---

## Getting Started

### Prerequisites

- Node.js installed
- Tailwind CSS v4 CLI

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/gistme.git
cd gistme

# 2. Install Tailwind CSS v4
npm install tailwindcss@^4 @tailwindcss/cli@latest

# 3. Start Tailwind watch
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```

### Running the App

Open `index.html` in your browser directly, or use a local dev server:

```bash
# Using VS Code Live Server extension (recommended)
# Right-click index.html → Open with Live Server

# Or using npx serve
npx serve .
```

---

## localStorage Schema

GistMe stores two keys in the browser's localStorage:

### `registered_users` — array of all accounts
```json
[
  {
    "username": "amara",
    "email": "amara@example.com",
    "password": "secret123"
  }
]
```

### `current_user` — the active session
```json
{
  "username": "amara",
  "email": "amara@example.com"
}
```

### `chats` — all messages
```json
[
  {
    "id": 1,
    "message": "hey! you online?",
    "sender": "amara",
    "date": 1718000000000
  }
]
```

---

## Page Auth Flow

| Page | Logged in | Not logged in |
|---|---|---|
| `index.html` | → `chat.html` | Show landing |
| `login.html` | → `chat.html` | Show login form |
| `register.html` | → `chat.html` | Show register form |
| `chat.html` | Show app | → `login.html` |

---

## Known Limitations

- Messages are stored in localStorage — they are device and browser specific
- No real-time sync between different users or devices
- Passwords are stored in plain text in localStorage — not suitable for production
- No message deletion or editing

---

## Roadmap

- [ ] Dark mode
- [ ] Message timestamps grouped by date
- [ ] Emoji picker
- [ ] User avatar upload
- [ ] Backend integration (Node.js + MongoDB)
- [ ] Real-time sync with WebSockets

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

<p align="center">Built with intention · © 2026 GistMe</p>