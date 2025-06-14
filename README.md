# Hero of the Day Frontend

A minimal SPA (Single Page Application) built with modern React technologies.

## Tech Stack

- ⚛️ **React 19** - Latest React with modern features
- ⚡ **Vite** - Fast development and building
- 🛣️ **React Router** - Client-side routing
- 🗃️ **Zustand** - Lightweight state management
- 🌐 **Axios** - HTTP client for API requests
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📝 **TypeScript** - Type safety and better DX

## Features

- 🚀 **Fast Development** - Hot module replacement with Vite
- 📱 **Responsive Design** - Mobile-first with Tailwind CSS
- 🔄 **State Management** - Global state with Zustand
- 🌍 **API Integration** - HTTP requests with Axios
- 🛣️ **Client-side Routing** - Navigation with React Router
- 🎯 **Type Safety** - Full TypeScript support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Start development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Main layout with navigation
│   ├── pages/
│   │   ├── Home.tsx            # Home page with examples
│   │   └── About.tsx           # About page
│   ├── stores/
│   │   └── counterStore.ts     # Zustand store example
│   ├── services/
│   │   └── api.ts              # Axios API service
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles with Tailwind
├── public/                     # Static assets
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

## Key Features Demonstrated

### State Management (Zustand)
- Global counter state
- Actions for increment, decrement, and reset
- Reactive updates across components

### API Integration (Axios)
- HTTP client with interceptors
- Error handling and logging
- Example API call to JSONPlaceholder

### Routing (React Router)
- Client-side navigation
- Nested routes with layout
- Link components for navigation

### Styling (Tailwind CSS)
- Utility-first CSS classes
- Responsive design
- Modern UI components

## Development

The project uses:
- **Vite** for fast development and building
- **ESLint** for code linting
- **TypeScript** for type safety
- **Tailwind CSS** for styling

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

## Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing. 