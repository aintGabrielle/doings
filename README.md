# Doings

Doings is a simple web-based project management system built using Next.js, React, Tailwind CSS, Xata, and Supabase.

## Description

Doings is a comprehensive project management solution designed to streamline and enhance the efficiency of project handling. By harnessing the power of modern web technologies, it offers a seamless and intuitive interface for organizing, tracking, and managing tasks and projects.

This platform provides a range of functionalities, including task creation, editing, and deletion, enabling users to categorize tasks within projects for more efficient management. The user-centric design ensures ease of navigation and a smooth workflow, making project management an effortless and enjoyable experience.

Doings emphasizes not only functionality but also aesthetics, leveraging Tailwind CSS and Radix UI to deliver a visually appealing and responsive interface. The integration of Xata and Supabase enhances data handling and secure authentication, ensuring reliability and scalability for large-scale project management.

## Features

- **Task Management:** Create, edit, and delete tasks.
- **Project Tracking:** Organize tasks within projects for better management.
- **User-friendly Interface:** Intuitive design for easy navigation and usage.

## Technologies Used

- **Next.js:** Framework for building React applications.
- **React:** JavaScript library for building user interfaces.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Radix UI:** Primitive and unstyled React components
- **Shadcn UI:** Themeable and customizeable React components with TailwindCSS integration
- **Xata:** Cloud postgresql database provider
- **Supabase:** Backend service provider

## Installation

To run this project locally, follow these steps:

1. Clone this repository.

   ```bash
   git clone https://github.com/aintGabrielle/doings
   ```

1. Install dependencies.

   ```bash
   npm install
   or
   yarn install
   or
   pnpm install
   ```

1. Install Xata CLI (if not yet installed)

   ```bash
   npm i npm install --location=global @xata.io/cli@latest
   or
   yarn global add @xata.io/cli@latest
   or
   pnpm install -g @xata.io/cli@latest
   ```

1. Initialize Xata to the project

   ```bash
   xata auth login
   xata init
   ```

1. Sign in to Supabase and create a project (if not yet created)

1. Get the Supabase Anon Key and the Project URL

1. Make sure that your `.env.local` or `.env` file has this set of keys. Do take in mind that these keys are NOT to be shared to just anyone.

   ```.env
   XATA_BRANCH = <Current Xata Branch>
   XATA_API_KEY = <Xata Key>

   NEXT_PUBLIC_SUPABASE_URL = <Supabase Project URL>
   NEXT_PUBLIC_SUPABASE_KEY = <Supabase Anon Key>
   ```

1. Start the development server.

   ```bash
   npm run dev
   or
   yarn dev
   or
   pnpm dev
   ```

1. Open your browser and visit `http://localhost:3214` to view the application.

## Developers

- **Domino, Isaac Gabrielle**
- **Mella, Jasper S.**
- **Lozada, Merwin John L.**
