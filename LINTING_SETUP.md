# Linting and TypeScript Setup Guide

## 🎯 What's Been Added

### ESLint Configuration
- **`.eslintrc.js`** - Main ESLint configuration with TypeScript support
- **`.eslintignore`** - Files to ignore during linting
- **Rules**: Enforces code quality, catches common errors, and integrates with Prettier

### Prettier Configuration
- **`.prettierrc`** - Code formatting rules
- **Consistent formatting** across the entire codebase

### TypeScript Configuration
- **`tsconfig.json`** - Main TypeScript configuration
- **`tsconfig.node.json`** - Node.js specific configuration
- **Type safety** and better IDE support

## 📦 Installation

Run these commands in each project directory:

### CrossyRoad Project
```bash
cd /Users/dave/Development/_Smarlify/Play.Smarlify.co/CrossyRoad
npm install
```

### TrafficRun Project
```bash
cd /Users/dave/Development/_Smarlify/Play.Smarlify.co/TrafficRun
npm install
```

## 🚀 Available Scripts

After installation, you can use these commands:

### Linting Commands
```bash
# Auto-fix linting issues
npm run lint

# Check for linting issues (without fixing)
npm run lint:check
```

### Formatting Commands
```bash
# Format all files
npm run format

# Check formatting (without changing files)
npm run format:check
```

### TypeScript Commands
```bash
# Type check without emitting files
npm run type-check

# Build with TypeScript compilation
npm run build
```

## 🔧 Next Steps

1. **Install dependencies** using the commands above
2. **Run the linter** to see current issues:
   ```bash
   npm run lint:check
   ```
3. **Auto-fix issues** where possible:
   ```bash
   npm run lint
   ```
4. **Format all files**:
   ```bash
   npm run format
   ```

## 📝 Converting to TypeScript

The projects are now ready for TypeScript conversion:

1. **Rename files** from `.js` to `.ts` (or `.jsx` to `.tsx` for React components)
2. **Add type annotations** gradually
3. **Run type checking** to catch issues:
   ```bash
   npm run type-check
   ```

## 🎨 IDE Integration

Most modern IDEs will automatically:
- Show linting errors/warnings
- Format on save (if configured)
- Provide TypeScript IntelliSense
- Auto-import types

## 🔍 Configuration Details

### ESLint Rules
- **Prettier integration** - No conflicts between ESLint and Prettier
- **TypeScript support** - Full TypeScript linting
- **React support** - JSX/TSX linting for CrossyRoad
- **Warnings for**:
  - Unused variables
  - Console statements
  - Debugger statements
  - Any types (warnings, not errors)

### Prettier Settings
- **Single quotes** for strings
- **Semicolons** required
- **2 spaces** for indentation
- **80 character** line width
- **Trailing commas** in ES5-compatible locations

## 🚨 Troubleshooting

### Common Issues
1. **"Command not found: npm"** - Make sure Node.js is installed and in PATH
2. **Type errors** - Run `npm run type-check` to see specific issues
3. **Formatting conflicts** - Run `npm run format` to fix

### VS Code Setup
Add to your VS Code settings:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 📊 Benefits

- **Code Quality**: Consistent, readable code
- **Type Safety**: Catch errors at compile time
- **Developer Experience**: Better IDE support and autocomplete
- **Maintainability**: Easier to refactor and debug
- **Team Collaboration**: Consistent code style across the team
