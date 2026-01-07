
# Role & Permission Model for Internal Communication System

## 1. Overview

This document defines the **roles and permissions** for the Internal Communication System.  
It clarifies the difference between **Job Titles**, **System Roles**, and **Chat Roles**, and how they map to each other.

The goal is to ensure proper access control, sidebar menu customization, and scalable permission management.

---

## 2. Definitions

### 2.1 Job Titles
Represents the **organizational positions** in the company.

| Job Title           | Description |
|--------------------|------------|
| CEO / Director      | Head of the organization |
| Deputy Director     | Second-in-command |
| Secretary           | Administrative support |
| Program Director    | Oversees programs and initiatives |
| Project Manager     | Manages individual projects |
| Department Head     | Leads a department |
| Employee            | Regular staff |
| Visitor             | External or guest user |

---

### 2.2 System Roles
Technical roles used in the **administrative system** for internal permission management.

| System Role             | Description |
|-------------------------|------------|
| BOSS                    | Full system access (CEO / Director) |
| HR_MANAGER              | Department-level administrative access |
| HR_DEPUTY               | Program-level administrative access |
| HR_EMPLOYEE_MANAGER     | Project-level administrative access |
| HR_EMPLOYEE             | Regular employee access |
| VISITOR                 | Limited access for guests or external users |

---

### 2.3 Chat Roles
Roles used in the **internal communication system** (chat, sidebar access, notifications).

| Chat Role   | Description |
|------------|------------|
| OWNER      | Full access to all communication channels |
| ADMIN      | Administrative access to teams or departments |
| SUPERVISOR | Can oversee projects, teams, or channels |
| USER       | Standard user with restricted channels |
| VISITOR    | Read-only or limited access |

---

## 3. Mapping Between Job Titles, System Roles, and Chat Roles

| Job Title           | System Role             | Chat Role   | Scope          |
|--------------------|------------------------|------------|----------------|
| CEO / Director      | BOSS                   | OWNER      | Global         |
| Deputy Director     | HR_MANAGER             | ADMIN      | Global         |
| Secretary           | HR_EMPLOYEE            | USER       | Department     |
| Department Head     | HR_MANAGER             | ADMIN      | Department     |
| Program Director    | HR_DEPUTY              | SUPERVISOR | Program        |
| Project Manager     | HR_EMPLOYEE_MANAGER    | SUPERVISOR | Project        |
| Employee            | HR_EMPLOYEE            | USER       | Personal       |
| Visitor             | VISITOR                | VISITOR    | Limited Access |

> **Scope** defines the level at which the role operates:
> - `Global` → entire organization
> - `Department` → specific department
> - `Program` → specific program
> - `Project` → specific project
> - `Personal` → only own tasks/data

---

## 4. Examples

### 4.1 Sidebar Links Based on Chat Role

```js
const sidebarLinks = {
  OWNER: [
    { name: "Dashboard", icon: "bi bi-grid-fill", link: "/dashboard" },
    { name: "User Management", icon: "bi bi-people-fill", link: "/users" },
    { name: "Settings", icon: "bi bi-gear-fill", link: "/settings" },
  ],
  ADMIN: [
    { name: "Dashboard", icon: "bi bi-grid-fill", link: "/dashboard" },
    { name: "Reports", icon: "bi bi-file-earmark-text-fill", link: "/reports" },
  ],
  SUPERVISOR: [
    { name: "Dashboard", icon: "bi bi-grid-fill", link: "/dashboard" },
    { name: "Team Chat", icon: "bi bi-chat-dots-fill", link: "/chat" },
  ],
  USER: [
    { name: "Dashboard", icon: "bi bi-grid-fill", link: "/dashboard" },
    { name: "My Tasks", icon: "bi bi-check2-square", link: "/tasks" },
  ],
  VISITOR: [
    { name: "Home", icon: "bi bi-house-fill", link: "/" },
    { name: "Contact", icon: "bi bi-envelope-fill", link: "/contact" },
  ],
};
```

### 4.2 Example User Assignment

```js
const user1 = {
  name: "Alice",
  jobTitle: "Program Director",
  systemRole: "HR_DEPUTY",
  chatRole: "SUPERVISOR",
  scope: "Program",
  programIds: ["prog123", "prog124"],
};

const user2 = {
  name: "Bob",
  jobTitle: "Employee",
  systemRole: "HR_EMPLOYEE",
  chatRole: "USER",
  scope: "Personal",
};
```

---

## 5. Key Notes

1. **Job Titles do not directly translate to System or Chat Roles**.  
   Always check the mapping table before assigning permissions.

2. **Roles are scalable**: One System Role can cover multiple Job Titles depending on scope.

3. **Future Proof**: Adding new Job Titles or Programs requires only updating the mapping, not creating new roles for every position.

4. **Security Principle**: Follow `Least Privilege` — give users the minimal permissions needed for their responsibilities.

---

## 6. Next Steps

1. Implement **middleware** in the backend to determine user roles and sidebar links dynamically.
2. Update **sidebar rendering logic** in EJS templates to use `sidebarLinks[chatRole]`.
3. Define **scope-based restrictions** for actions (e.g., project-level, department-level).
4. Maintain **documentation** when adding new roles or Job Titles.

---

*Document Version: 1.0*  
*Prepared by: IT & System Architecture Team*  
*Date: 2026-01-07*
