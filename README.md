<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


## Project Description
# 🏥 Clinic Management System – Backend (NestJS + PostgreSQL)

A full-featured backend for a clinic management system, supporting role-based user access (Doctor, Admin, Patient), appointment scheduling with Google Calendar integration, secure authentication, and email notifications.

---

## 📦 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer (SMTP)
- **Google Integration**: Google Calendar API (OAuth2)

---

## 🎯 Features

### 🔐 Authentication

- **JWT-based login/logout**
- **Password hashing**
- **Account activation via email**
- **Password reset with tokenized email**
- **Role-based access control**

### 👥 User Roles

| Role     | Description                                                                 |
|----------|-----------------------------------------------------------------------------|
| Doctor   | Registers self, manages admins/patients, manages appointments and checkups |
| Admin    | Created by doctor, can login/logout and delete any user                    |
| Patient  | Created by doctor, activates via email, manages/view appointments/checkups |

---

## 📚 Entity Structure

### 📌 Profile Table (Base info for all roles)

| Field        | Type   |
|--------------|--------|
| id           | Int   |
| role         | Enum (DOCTOR, PATIENT, ADMIN) |
| fullName     | String |
| phoneNumber  | String |
| createdAt    | Date   |
| updatedAt    | Date   |

### 🧑 Patient Table

| Field             | Type   |
|------------------|--------|
| id               | Int   |
| profileId (FK)   | Int   |
| age              | Int    |
| gender           | String |
| address          | String |
| medicalHistory   | Text (optional) |
| emergencyContact | String (optional) |
| createdAt        | Date   |
| updatedAt        | Date   |

### 🧑‍⚕️ Doctor Table

| Field           | Type   |
|----------------|--------|
| id             | Int   |
| profileId (FK) | Int   |
| specialization | String |
| licenseNumber  | String |
| clinicName     | String |
| createdAt      | Date   |
| updatedAt      | Date   |

### 🧑‍💼 Admin Table

| Field           | Type   |
|----------------|--------|
| id             | UUID   |
| profileId (FK) | UUID   |
| department     | String |
| accessLevel    | String |
| createdAt      | Date   |
| updatedAt      | Date   |

### 🩺 CheckUp Table

| Field            | Type   |
|------------------|--------|
| id               | Int   |
| patientProfileId | Int   |
| doctorProfileId  | Int   |
| title            | String |
| notes            | Text   |
| diagnosis        | Text   |
| prescription     | Text   |
| checkUpDate      | Date   |
| createdAt        | Date   |
| updatedAt        | Date   |

### 📅 Appointment Table

| Field                 | Type   |
|-----------------------|--------|
| id                    | Int   |
| patientProfileId      | Int   |
| doctorProfileId       | Int   |
| appointmentDateTime   | DateTime |
| location              | String |
| status                | Enum (SCHEDULED, CANCELLED, COMPLETED) |
| googleCalendarEventId | String |
| description           | Text   |
| createdAt             | Date   |
| updatedAt             | Date   |

---

## 📧 Email Notifications

### ✅ Activation Email

- Sent when a **doctor** creates a **patient**
- Contains a secure token and password setup link

### ✅ Reset Password

- Patient or doctor requests by email
- Tokenized link sent for reset form

### ✅ Appointment Created

- Triggered on appointment creation
- Email with date, time, location sent to doctor and patient

---

## 🔐 Authentication & Authorization

| Feature             | Role   |
|---------------------|--------|
| Self-registration   | Doctor |
| Create Admin/Patient| Doctor |
| Login/Logout        | All    |
| Password Reset      | All    |
| See appointments    | All    |
| Manage checkups     | Doctor |
| Delete any user     | Admin  |

---

## 📅 Google Calendar Integration

- **OAuth2 flow** with Google Calendar scope
- On appointment creation:
  - Event created in doctor's calendar
  - `googleCalendarEventId` saved
  - Both patient & doctor added as attendees
  - Invitation email sent via Google

---

## 📁 Project Structure

```
src/
├── auth/               # Authentication (JWT, login, activation, reset)
├── common/             # Interceptors, Guards, Filters
├── doctor/             # Doctor entity, service, controller
├── patient/            # Patient logic
├── admin/              # Admin logic
├── profile/            # Shared profile entity
├── appointment/        # Appointments & Google Calendar
├── checkup/            # Medical checkups
├── mail/               # Email service
├── google/             # Google OAuth setup
├── main.ts             # Entry point
└── app.module.ts
```

---

## ✅ Best Practices Followed

- DTOs for request/response shaping
- Separation of concerns via modules
- JWT Authentication system and Authorization
- NestJS decorators and lifecycle hooks
- Global exception handling & response formatting
- Guards, and Interceptors
- ENV config with `@nestjs/config`

---

## 📜 Setup Instructions

```bash
# 1. Clone repository
git clone https://github.com/your-org/clinic-management-system

# 2. Install dependencies
npm install

# 3. Set up PostgreSQL database

# 4. Set environment variables
cp .env.example .env

# 5. Run the server
npm run start:dev
```

---

