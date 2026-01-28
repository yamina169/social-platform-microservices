# Social Platform Microservices

## Description

Social Platform Microservices is a **simplified social platform** built using a **microservices architecture**:

- **Auth Service**: User registration, login, JWT authentication, roles, and security.
- **Profile Service**: User profile management, follow/unfollow functionality.
- **Blog Service**: CRUD articles, file uploads, automatic AI-generated article summaries.
- **Notifications Worker**: Asynchronous notifications using queues (BullMQ / RabbitMQ).
- **API Gateway**: Single entry point for the frontend with routing to microservices.
- **Frontend**: React Web or React Native client interacting with the API.

The project is **dockerized** and includes **unit and e2e tests**, ready for **CI/CD and scalability**.

---

## Table of Contents

1. [Installation](#installation)
2. [Services](#services)
3. [Docker](#docker)
4. [Tests](#tests)
5. [Usage](#usage)
6. [Technologies](#technologies)
7. [Architecture](#architecture)

---

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/social-platform-microservices.git
cd social-platform-microservices
```
