# Mini-Wallet App

A React-based wallet application that allows users to login, withdraw money, and view past transactions. Built using a modern monorepo architecture with Turborepo and pnpm.

## Features

- **Authentication**: Login/logout functionality with JWT token management
- **Dashboard**: View account balance and recent transactions
- **Withdrawal**: Withdraw funds with validation and real-time balance updates
- **Transaction History**: View, sort, and paginate transaction history

## Key Technologies

- [`React 19`](https://react.dev/): Latest React version for UI development
- [`TypeScript`](https://www.typescriptlang.org/): Type safety across the codebase
- [`Zustand`](https://zustand-demo.pmnd.rs/): Lightweight state management
- [`Axios`](https://axios-http.com/): API requests with interceptors
- [`MSW`](https://mswjs.io/): Mock Service Worker for API mocking
- [`Vitest`](https://vitest.dev/): Modern testing framework
- [`Zod`](https://zod.dev/): Schema validation for API payloads and form data

## Project Structure

This project uses a monorepo architecture to facilitate code sharing between platforms (web and future mobile):

## Project Structure

This project uses a monorepo architecture to facilitate code sharing between platforms (web and future mobile):

```bash

.
├── apps/
│ └── web/ # React web application
├── packages/
│ ├── api/ # API client with Axios for data fetching
│ ├── hooks/ # Shared React hooks for data & business logic
│ ├── mocks/ # Mock server implementation (MSW)
│ ├── store/ # Zustand state management
│ ├── types/ # TypeScript type definitions
│ └── utils/ # Shared utility functions
├── turbo.json # Turborepo configuration
├── package.json # Root package.json
└── pnpm-workspace.yaml # pnpm workspace configuration

```

## Setup and Installation

### Prerequisites

### Installation

```bash
# Clone the repository
git clone https://github.com/xfja/mini-wallet.git
cd mini-wallet

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Design Choices

### Architecture

The application is built using a modular, package-based architecture to maximize code sharing and maintainability:

1. **Monorepo Structure**: Using Turborepo and `pnpm` for efficient dependency management and build caching

2. **Package Separation**:

   - **Types**: Shared `TypeScript` interfaces/types ensure consistency across packages
   - **API**: Centralized API client handling auth, requests, and error management
   - **Store**: `Zustand`-based state management for a simple, hook-based approach
   - **Hooks**: Business logic hooks that can be shared between web and mobile
   - **Utils**: Common utilities for formatting, validation, etc.

3. **Mock Server**: Using `MSW` (Mock Service Worker) to simulate API interactions during development

### Technical Choices

1. **`React 19`**: Leveraging the latest React features for optimal performance
2. **`TypeScript`**: For type safety across the entire codebase
3. **`Zustand`**: Lightweight state management with a simple API that works well across platforms
4. **`Zod`**: Used for schema validation of API payloads and form data, ensuring that only valid data is processed and reducing runtime errors. `Zod` enables strong validation logic that is type-safe and easy to extend.

## Mobile App Implementation

1. **Platform-Specific UIs**: Instead of using React Native Web, we've chosen to implement completely separate UIs for web and mobile to maximize platform-specific capabilities and user experience.

2. **Benefits of Separate UIs**:

   - **Optimized Performance**: Each platform's UI can be fine-tuned for its specific runtime characteristics
   - **Native Feel**: Ability to use platform-specific components and interactions
   - **Faster Development**: No need to work around cross-platform limitations
   - **Better UX**: Tailored experiences that feel natural on each platform
   - **Independent Release Cycles**: Web and mobile can be updated independently

3. **Shared Logic**: While UIs are separate, the core business logic remains shared through our monorepo packages:
   - API clients and services
   - State management
   - Custom hooks
   - Type definitions
   - Utility functions

## Testing

- Example unit tests are provided for key hooks and utilities using `Vitest` and `@testing-library/react`.
- **Note:** Only representative tests are included. For production readiness, it is recommended to add comprehensive tests covering all components, edge cases, and error states (`apps/web`, `packages/api`, etc.).

## Improvements and Future Work

1. **Enhanced UI/UX**:

   - Add loading skeletons for better loading states
   - Implement animations for smoother transitions
   - Add form validation feedback

2. **Technical Enhancements**:

   - Implement a more sophisticated caching strategy
   - Add end-to-end tests with `Cypress` or `Playwright`
   - Improve error handling with retry mechanisms
   - Add analytics tracking
   - Add CI/CD pipelines for automated testing and deployment
   - Offer Dockerization for easy deployment

3. **Mobile App Implementation**:
   - Develop the React Native app using the shared logic
   - Optimize UI for mobile experiences
   - Add platform-specific features (biometric authentication, etc.)

## License

MIT
