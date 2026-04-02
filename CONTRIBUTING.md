# Contributing to the Affiliate Panel Framework

First, thank you for contributing! To keep the project maintainable and consistent, please follow these guidelines.

---

## 🏗️ Technical Standards

- **Language**: Use **TypeScript** for everything (backend and frontend).
- **Indentation**: 2 spaces (Use the provided `.editorconfig`).
- **Prisma**: If you modify `schema.prisma`, always run `npx prisma generate` and `npx prisma migrate dev --name <description>`.
- **Naming Conventions**:
  - Components: PascalCase (e.g., `StatCard.tsx`)
  - Utilities/Services: camelCase (e.g., `auth.service.ts`)
  - Interfaces: Prefix with `I` or use descriptive naming (e.g., `StatCardProps`).

---

## 🛠️ Development Workflow

1. **Branch Management**:
   - `main`: Production-ready code (Protected).
   - `develop`: Stable development version (Primary target for PRs).
   - `feature/<name>`: New features.
   - `fix/<name>`: Bug fixes.

2. **Pull Requests**:
   - Ensure `npm run build` passes for both backend and frontend.
   - Provide a clear description and screenshot if the UI is affected.
   - Request review from at least one other team member.

3. **Commits**:
   Follow conventional commit standards:
   - `feat: add new kpi card`
   - `fix: resolve jwt expiry bubble`
   - `refactor: modularize auth routes`

---

## 🧪 Testing

- Before pushing, verify your changes against the **Postman Collection** provided in the root.
- Check the console for any React warnings or errors.

## 📦 Deployment Prep

If your change requires a new environment variable:
1. Update `.env.example` in the respective directory.
2. Update the `docker-compose.yml` if necessary.

---

Thank you for helping us build a better affiliate ecosystem!
