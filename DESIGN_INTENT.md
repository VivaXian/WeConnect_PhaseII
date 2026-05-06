# DESIGN INTENT

## 1. Project Overview
This project is a design-led prototype built using VS Code, GitHub Copilot, and MCP.
It explores user experience flows through executable UI, not static design deliverables.

The goal is to validate interaction clarity, information hierarchy, and task completion
by generating real, runnable interfaces.

---

## 2. Product Context
- Product: WeConnect
- Phase: Phase II
- Audience: Customer-facing users
- Platform: Mobile mini-program (responsive by default)

## Platform constraints:
- WeChat Mini Program
- Mobile-first by definition
- No heavy navigation or deep hierarchies
- Page transitions should be lightweight
- Design should align with existing mini-program interaction patterns

This project focuses on **incremental UX value on top of Phase I**, not redefining
overall product positioning.

---

## 3. Scope & Boundaries
### In scope
- One primary user flow at a time
- Core task completion (not feature completeness)
- UX structure, hierarchy, and interaction feedback

### Out of scope
- Visual polish beyond design system defaults
- Custom styling or brand experimentation
- Backend integration or production-level logic
- Multi-role system simulations unless explicitly stated

---

## 4. Design System Alignment

Phase I was not implemented with strictly pure design-system components.
This Phase II project aims to **align with Filament in structure and behavior**,
not enforce pixel-perfect or component-exclusive usage.

Guidelines:
- Prefer Filament components and patterns where applicable
- Maintain consistency with existing Phase I interaction patterns
- Do not refactor or redesign established UI purely for system purity
- Consistency with launched experience has higher priority than DS idealism

---

## 5. Interaction Principles
- One clear primary action per screen
- Minimize cognitive load
- Progressive disclosure over information stacking
- Task-focused, not dashboard-style density
- Clear system feedback for every user action

---

## 6. MCP & AI Collaboration Mode
AI is treated as:
- A design execution assistant
- A Filament-aware UI generator
- A structure-preserving collaborator

AI should:
- Respect all constraints in this document
- Prioritize clarity and simplicity
- Generate components aligned with existing project structure

AI should NOT:
- Make product scope decisions
- Introduce features not explicitly described
- Optimize for aesthetics at the cost of usability

---

## 7. Definition of “Good Enough”
A generated screen is considered successful when:
- The primary user task is immediately clear
- Navigation and next actions are unambiguous
- The UI feels consistent with Filament standards
- The screen can be reasonably shown to stakeholders
  as an **executable UX proposal**

---

## 8. Usage Note
This document represents the **stable design intent of the project**.
All prompts, code generation, and iterations should align with this intent
unless the document is explicitly updated.

## Phase I UX DNA (Experience Baseline)

Phase I established a highly constrained, task-first experience model:
- Users are guided through a single dominant task rather than browsing features
- The system makes most decisions automatically to reduce user effort
- Information is revealed only when it directly supports an action
- Navigation choices are intentionally limited
- The UI avoids presenting the product structure to users

Phase II must **evolve within this model**, not replace it.
