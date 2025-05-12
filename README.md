# Freelance Platform Backend API

## Overview

This is a comprehensive backend API for a freelance platform, built with NestJS, TypeScript, and PostgreSQL. The platform enables clients to post projects, freelancers to bid on them, and both parties to collaborate through contracts with milestone-based payments.

## Features

- **User Management**: Registration, login, profile management
- **JWT Authentication**: Secure access and refresh token implementation
- **Role-Based Access Control**: Client, Freelancer, and Admin roles
- **Project Management**: Create, view, update, and delete projects
- **Bidding System**: Allow freelancers to place bids on open projects
- **Contract System**: Multi-stage contracts with proposal, approval, and payment stages
- **Milestone Tracking**: Break projects into milestones with individual payment requests
- **Messaging System**: Secure communication between clients and freelancers
- **Email Service**: Password reset functionality with email notifications
- **API Documentation**: Complete Swagger documentation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Configure environment variables in `.env` file (see `.env.example`)
4. Start the server:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

The API documentation is available via Swagger at `/api` when the server is running.

## Authentication

The API uses JWT for authentication with the following features:
- Access tokens with configurable expiration
- Refresh tokens for obtaining new access tokens
- Role-based access control
- Password reset via email

## Database Schema

The application uses TypeORM to interact with a PostgreSQL database with the following main tables:
- Users
- Projects
- Bids
- Contracts
- Milestones
- Messages

## Main Workflows

### Client Workflow
1. Register/login as a client
2. Create a project
3. Review received bids
4. Shortlist promising bids
5. Create a contract with selected freelancer
6. Define milestones
7. Review and approve completed milestones
8. Process payments
9. Close the contract

### Freelancer Workflow
1. Register/login as a freelancer
2. Browse available projects
3. Submit bids
4. Receive contract proposals
5. Accept contracts
6. Work on milestones
7. Submit milestones for review
8. Receive payments
9. Complete the contract

## Security

This API implements various security measures:
- Secure password hashing with bcrypt
- JWT authentication
- Role-based access control
- Input validation
- Request rate limiting
- Secure cookie options