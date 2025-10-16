# Paz & Bem Academy - Online Course Platform

A futuristic and feature-rich online course platform with a stunning landing page, user dashboard, and a comprehensive admin management system. Built on Cloudflare Workers and Durable Objects for a scalable, serverless architecture.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/automacoescomerciaisintegradas/Academy-pazebem)

## ✨ Key Features

*   **Stunning Futuristic UI:** A "Dribbble-worthy" public-facing site with neon green accents, dynamic gradients, glassmorphism, and interactive animations powered by Framer Motion.
*   **User Authentication:** Simple and secure social login integration (mocked Google/GitHub) for user access.
*   **Personalized User Dashboard:** A private space for logged-in users to manage their personal course notes and track progress.
*   **Comprehensive Admin Panel:** A powerful, multi-level administrative area for platform management.
*   **Full CRUD Functionality:** Admins can create, read, update, and delete courses, modules, and individual lessons.
*   **User Access Management:** Secure tools for inviting users and managing permissions within the admin panel.
*   **Fully Responsive:** A seamless experience across all devices, from mobile phones to desktops.
*   **Serverless Architecture:** Built on Hono for Cloudflare Workers with state persisted in a single, powerful Cloudflare Durable Object.

## 🚀 Technology Stack

*   **Frontend:** React, React Router, TypeScript
*   **Backend:** Hono on Cloudflare Workers
*   **State Management:** Zustand (Client), Cloudflare Durable Objects (Server)
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Animation:** Framer Motion
*   **Forms:** React Hook Form, Zod
*   **Icons:** Lucide React

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Bun](https://bun.sh/) installed on your machine.
*   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
*   Wrangler CLI installed and configured: `bun install -g wrangler`.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd pazebem_academy
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

### Running Locally

To start the development server, which includes the Vite frontend and the Wrangler server for the backend worker, run:

```sh
bun dev
```

The application will be available at `http://localhost:3000`.

## 🛠️ Development

The project is structured into three main parts:

*   `src/`: Contains the React frontend application, including pages, components, hooks, and utility functions.
*   `worker/`: Contains the Hono backend application running on a Cloudflare Worker. All API logic and Durable Object interactions are handled here.
*   `shared/`: Contains TypeScript types and interfaces shared between the frontend and the backend to ensure type safety.

### Adding API Endpoints

To add new API routes, modify the `worker/user-routes.ts` file. The application uses an entity-based abstraction over the Durable Object for cleaner data management.

## ☁️ Deployment

This project is designed for easy deployment to Cloudflare's global network.

1.  **Build the project:**
    ```sh
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    ```sh
    bun run deploy
    ```

This command will build the application and deploy the worker and static assets to your Cloudflare account.

Alternatively, deploy directly from your GitHub repository with a single click:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/automacoescomerciaisintegradas/Academy-pazebem)