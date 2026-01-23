# Cursor Rules - Booking Platform Web

This directory contains project rules to guide AI-assisted development in Cursor.

---

## Quick Search

| Question | Rule | Priority |
|----------|------|----------|
| **How should I work on this project?** | [`project-approach.mdc`](./project-approach.mdc) | ⚠️ **READ FIRST** |
| **Where does my file go?** | [`folder-structure.mdc`](./folder-structure.mdc) | 🔴 High |
| **Can I import from here?** | [`dependencies.mdc`](./dependencies.mdc) | 🔴 High |
| **Is it mobile-first?** | [`mobile-first.mdc`](./mobile-first.mdc) | 🔴 High |
| **Does it follow Clean Architecture?** | [`clean-architecture.mdc`](./clean-architecture.mdc) | 🔴 High |
| **Is it in English?** | [`language-conventions.mdc`](./language-conventions.mdc) | 🔴 High |
| **Does it follow SOLID?** | [`solid-principles.mdc`](./solid-principles.mdc) | 🟡 Medium |
| **Is it too complex?** | [`kiss-principle.mdc`](./kiss-principle.mdc) | 🟡 Medium |
| **Does it follow conventions?** | [`code-conventions.mdc`](./code-conventions.mdc) | 🟡 Medium |
| **Is it an anti-pattern?** | [`anti-patterns.mdc`](./anti-patterns.mdc) | 🟡 Medium |
| **How do I structure the component?** | [`component-patterns.mdc`](./component-patterns.mdc) | 🟡 Medium |
| **Which state to use?** | [`state-management.mdc`](./state-management.mdc) | 🟡 Medium |
| **How do I integrate the API?** | [`api-integration.mdc`](./api-integration.mdc) | 🟡 Medium |
| **Is it good TypeScript?** | [`typescript-standards.mdc`](./typescript-standards.mdc) | 🟡 Medium |
| **How do I style this?** | [`styling-guidelines.mdc`](./styling-guidelines.mdc) | 🟡 Medium |
| **How do I build the form?** | [`forms-validation.mdc`](./forms-validation.mdc) | 🟡 Medium |
| **Is it accessible?** | [`accessibility.mdc`](./accessibility.mdc) | 🟢 Low |
| **Is it optimized?** | [`performance.mdc`](./performance.mdc) | 🟢 Low |

---

## Rules Summary

### 🏗️ Architecture & Structure

| Rule | Description | Applies |
|------|-------------|---------|
| `project-approach.mdc` | Project context and principles | Always |
| `folder-structure.mdc` | Where to place each file type | Always |
| `dependencies.mdc` | Import rules between modules | Always |
| `clean-architecture.mdc` | Layers and data flow | Always |
| `language-conventions.mdc` | English-only codebase | Always |

### 📱 Design & UX

| Rule | Description | Applies |
|------|-------------|---------|
| `mobile-first.mdc` | Mobile-first responsive design | Always |
| `styling-guidelines.mdc` | Tailwind CSS and shadcn/ui | `*.tsx`, `*.css` |
| `accessibility.mdc` | Basic accessibility | `*.tsx` |

### 💻 Code

| Rule | Description | Applies |
|------|-------------|---------|
| `solid-principles.mdc` | SOLID for React/TypeScript | `*.ts`, `*.tsx` |
| `kiss-principle.mdc` | Keep it simple | Always |
| `code-conventions.mdc` | Naming and code style | `*.ts`, `*.tsx` |
| `typescript-standards.mdc` | TypeScript best practices | `*.ts`, `*.tsx` |
| `anti-patterns.mdc` | Patterns to avoid | `*.ts`, `*.tsx` |

### ⚛️ React

| Rule | Description | Applies |
|------|-------------|---------|
| `component-patterns.mdc` | Component patterns | `*.tsx` |
| `state-management.mdc` | State management | `*.ts`, `*.tsx` |
| `forms-validation.mdc` | Forms with react-hook-form + zod | `*.tsx` |

### 🔌 Integration

| Rule | Description | Applies |
|------|-------------|---------|
| `api-integration.mdc` | React Query and API client | `*.ts`, `*.tsx` |
| `performance.mdc` | Performance optimization | `*.ts`, `*.tsx` |

---

## How to Use Rules

### For Developers

1. **Before starting**: Read `project-approach.mdc`
2. **Creating new file**: Check `folder-structure.mdc`
3. **Importing module**: Verify in `dependencies.mdc`
4. **Styling component**: Follow `mobile-first.mdc` + `styling-guidelines.mdc`

### For Cursor AI

Rules apply automatically based on their configuration:
- **`alwaysApply: true`**: Applies to every conversation
- **`globs: "**/*.tsx"`**: Applies when working with `.tsx` files

---

## Rule File Structure

```markdown
---
description: Brief description (shown in rule picker)
globs: **/*.tsx    # Optional: file pattern
alwaysApply: true  # Optional: if always applies
---

# Title

Rule content...
```

---

## Keep Updated

- Add new rules when common patterns emerge
- Update existing rules when practices change
- Remove obsolete rules
- Keep each rule under 50 lines (ideally)

---

## Quick Decision Matrix

```
Where does it go?       → folder-structure.mdc
How do I import it?     → dependencies.mdc  
Is it responsive?       → mobile-first.mdc
Which pattern to use?   → component-patterns.mdc / state-management.mdc
Is it simple?           → kiss-principle.mdc
Is it correct?          → anti-patterns.mdc / solid-principles.mdc
Is it in English?       → language-conventions.mdc
```
