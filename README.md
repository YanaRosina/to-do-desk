# To-Do Task Management SPA

A single-page application (SPA) for managing tasks (To-Do).

## Features

- **Create, delete, and edit cards** with the following fields:
    - Title
    - Status
    - Priority
    - Description
    - Creation time
- **Display cards in two modes:**
    - List view
    - Kanban board view
- **List view:**  
    - Filter cards by:
        - Creation date
        - Alphabetical order
        - Priority
- **Kanban board view:**  
    - Drag-and-drop support between categories (task statuses) and within columns
    - Ability to create and delete columns (statuses)
- **Persistence:**  
    - Cards are saved and remain after page reload

## Areas for Improvement

- Use React Context for event handling
- Improve code readability
- Refine the design

## Getting Started

1. Clone this repository
2. Install dependencies
3. Run `npm run dev`
