<!-- Original filename: README.md -->
# Frontend Directory

This directory contains the frontend code for the MCHIGM platform.

## Technology Stack

- **HTML/CSS**: Structure and styling
- **TypeScript**: Main development language
- **JavaScript**: Minimal usage for legacy support

## Directory Structure

```
frontend/
├── src/                # Source code
�?  ├── components/     # Reusable UI components
�?  ├── pages/          # Page components
�?  ├── styles/         # CSS/SCSS files
�?  ├── utils/          # Utility functions
�?  ├── types/          # TypeScript type definitions
�?  └── main.ts         # Application entry point
├── public/             # Static assets
�?  ├── images/
�?  ├── fonts/
�?  └── index.html
├── dist/               # Build output (generated)
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js >= 14.x
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The development server will start at `http://localhost:3000`

### Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Testing

```bash
npm test
```

## Features to Implement

- [ ] Responsive layout (PC + Mobile)
- [ ] User authentication UI
- [ ] Demand posting interface
- [ ] Resource browsing interface
- [ ] Progress tracking dashboard
- [ ] Group collaboration board
- [ ] Notification center
- [ ] User profile management
- [ ] Search and filter functionality
- [ ] Data visualization charts

## Code Style

Please follow the project's TypeScript and CSS coding standards.

---

To be developed...
