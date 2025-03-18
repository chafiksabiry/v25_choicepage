# Choice Page Application - Simplified

A simplified React application that runs directly in the browser with no build step.

## Features

- React with JSX using Babel transformation in the browser
- React Router for client-side routing
- Single HTML file containing all application code
- Simple Express server to serve the application

## Getting Started

### Prerequisites

- Node.js (v12 or later)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Access the application at: http://localhost:5173/choicepage

## Development

For development with automatic server restarts on changes:

```bash
npm run dev
```

## How It Works

This application takes a simplified approach:

1. All React code is directly embedded in the `index.html` file
2. Babel transforms JSX to JavaScript in the browser
3. No build step or complex bundling required
4. React and React Router are loaded from CDN

## Customizing

To add your own components or expand the application:

1. Modify the React code within the `<script type="text/babel">` section of `index.html`
2. Add styles in the `<style>` section or link external stylesheets
3. Additional dependencies can be added via CDN links in the `<head>` section

## Benefits

- Simple to understand and maintain
- No complex build tooling or configuration
- Fast iterations during development
- Easy to deploy (just copy two files: index.html and server.js) 