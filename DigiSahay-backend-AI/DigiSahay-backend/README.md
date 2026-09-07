# 🏙️ Civic Platform Backend

A backend application for a Civic Platform that allows users to register, authenticate, and securely access protected resources using JWT-based authentication.

This project is built using **Java and Spring Boot** and follows a structured backend architecture using controllers, services, repositories, DTOs, and security configurations.

---

## 🚀 Features

- 👤 User Registration
- 🔐 User Login
- 🔑 JWT Authentication
- 🔒 Password Encryption using BCrypt
- 🛡️ Protected API Endpoints
- 👥 Role-based User Structure
- 📦 RESTful APIs
- 🗄️ MySQL Database Integration
- 🔄 JPA & Hibernate

---

## 🛠️ Tech Stack

- **Java**
- **Spring Boot**
- **Spring Security**
- **Spring Data JPA**
- **Hibernate**
- **MySQL**
- **JWT (JSON Web Token)**
- **Maven**
- **Lombok**

---

## 📁 Project Structure

```text
src/main/java/in/abnv/civic_platform_backend
│
├── config
│   └── SecurityConfig.java
│
├── jwt
│   ├── JwtAuthenticationFilter.java
│   └── JwtService.java
│
├── users
│   ├── controller
│   │   └── UserController.java
│   │
│   ├── dto
│   │   ├── RegisterUserRequestDto.java
│   │   ├── LoginRequestDto.java
│   │   └── LoginResponseDto.java
│   │
│   ├── entity
│   │   ├── User.java
│   │   └── Role.java
│   │
│   ├── repository
│   │   └── UserRepository.java
│   │
│   └── service
│       └── UserService.java
│
└── CivicPlatformBackendApplication.java
