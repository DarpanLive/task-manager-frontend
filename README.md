# Team Task Manager
### Full-Stack Project Management & Task Tracking Application

## 1. Overview
The Team Task Manager is a full-stack web application designed to help teams efficiently manage projects, assign tasks, and track progress with role-based access control (Admin & Member). This project is built as part of the technical assessment and fulfills all required features including authentication, project management, task tracking, and deployment.

## 2. Technology Stack
| Category | Technology                            |
| :--- |:--------------------------------------|
| **Backend** | Java 11, Spring Boot, Hibernate / JPA |
| **Frontend** | React (Vite), Tailwind CSS, Axios     |
| **Security** | Spring Security + JWT Authentication  |
| **Database** |  PostgreSQL                           |
| **Build Tool** | Maven                                 |
| **Deployment** | Railway (Backend + DB)                |

## 3. Architecture & Design Approach
The backend follows a layered architecture that separates concerns clearly:

`Controller` → `ControllerImpl` → `Service` → `ServiceImpl` → `Repository` → `Database`

### Key Design Principles
* Separation of concerns
* DTO-based communication
* Clean service layer logic
* Scalable structure

## 4. Role-Based Access Control
The system relies on strict Role-Based Access Control (RBAC) to manage permissions:

### Admin
* Create projects
* Assign tasks
* Manage users

### Member
* View assigned tasks
* Update task status

## 5. Task Management & Dashboard
Task tracking allows state changes and provides real-time status updates via the dashboard.

### Task Statuses:
* Pending
* In Progress
* Completed

### Dashboard Analytics Overview:
* Total tasks
* Completed tasks
* Pending tasks
* Overdue tasks

## 6. Security & Validation
All incoming requests undergo strict validation and security checks:
* Input validations using annotations
* Exception handling (Global Exception Handler)
* JWT-based secure endpoints
* Role-based authorization

## 7. Data Model

### Entities & Relationships
| Entity | Relationships |
| :--- | :--- |
| `User` | One User → Many Tasks, Many Users ↔ Many Projects |
| `Role` | Defines system privileges (Admin/Member) |
| `Project` | One Project → Many Tasks |
| `Task` | Linked to specific users and projects |



## 8. Submission Details
The application is deployed using Railway (mandatory as per assignment). It was completed within 1–2 days (8–12 hours) as per constraints.

* **Live Backend**
* **Live Frontend**
* **GitHub Repository:** `[LINK]`
* **README file:** Included

## 9. Conclusion & Author
**Darpan Patil**
*Full Stack Developer (Java + React)*

This project demonstrates full-stack development skills, clean architecture design, secure authentication & authorization, and real-world project management functionality.
