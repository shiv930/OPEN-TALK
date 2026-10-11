# ✦ OpenTalk — Anti-Gravity UI

> A modern communication and community platform frontend powered by a bespoke **Anti-Gravity Design Philosophy**.

Built strictly with:
- **React.js + Vite (JavaScript + JSX)** — No TypeScript.
- **Tailwind CSS v4 + Design Tokens** (`src/styles/themes.css`, `animations.css`, `globals.css`).
- **Redux Toolkit** — Strictly for Client/UI state management.
- **TanStack Query v5** — For server state caching, queries, and optimistic mutations.
- **Axios** — Centralized client with JWT & HTTP-only cookies (`withCredentials: true`), and `react-toastify` response interceptors.
- **React Hook Form** — Clean form validation across all modals and auth pages.
- **Lucide React** — Minimalist futuristic iconography.
- **Socket.IO Client** — Real-time event streaming (`newMessage`, `joinChannel`, `leaveChannel`) directly updating query caches.

---

## 🌌 Visual Design Philosophy

- **Suspended Surfaces**: Navigation docks and viewport cards hover with generous breathing room (`glass-dock`, `glass-card`).
- **Atmospheric Radiance**: Subtle radial cyan (`#06B6D4`) and violet (`#8B5CF6`) nebular gradients over a deep obsidian base (`#07090E`).
- **Theme Flexibility**: Full dark and light theme support with a global `ThemeToggle` (`Dark`, `Light`, `System`) persisted to `localStorage`.
- **Lightweight Communication**: Messages emphasize whitespace and typography, revealing floating action docks (`😊`, `↩`, `📌`, `⋯`) on hover rather than boxy chat bubbles.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🔗 Backend Connection Points

The frontend is configured to consume the existing Node.js + Express backend running at `http://localhost:3000`:
- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/forget-password`, `/api/auth/verify-otp`, `/api/auth/resetPassword`
- **Servers**: `/api/server/get-server`, `/api/server/create-server`, `/api/server/update-server/:id`, `/api/server/delete-server/:id`, `/api/server/join/:code`
- **Channels**: `/api/channel/getAllChannel/:serverId`, `/api/channel/createChannel/:serverId`
- **Messages**: `/api/message/get-all-channel-message/:channelId`, `/api/message/create-message/:channelId` (supports Multer multipart attachments)
- **Members**: `/api/serverMember/get-server-member/:serverId`
- **User**: `/api/user/get-me`, `/api/user/update-profile`
- **WebSockets**: Syncs with backend rooms via `joinChannel` and listens to `newMessage` broadcasts.
