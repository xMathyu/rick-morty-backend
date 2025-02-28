<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

# Rick & Morty Backend API

This is the **rick-morty-backend** application built with the [NestJS](https://nestjs.com/) framework. It provides a scalable and efficient API to manage data and functionalities related to the Rick and Morty universe. The application integrates with cloud services to enable automated deployments, high availability, and optimal performance—leveraging Cloud Run/Cloud Functions, API Gateway, caching configurations, and automated deployment pipelines.

> **Note:** You can also view this documentation on a public Notion page.

---

## Table of Contents

- [Overview](#overview)
- [Project Setup](#project-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running and Testing](#running-and-testing)
- [Deployment](#deployment)
  - [Cloud Run/Cloud Functions and API Gateway](#cloud-runcloud-functions-and-api-gateway)
  - [Caching Configuration](#caching-configuration)
  - [Automated Deployment](#automated-deployment)
- [Notes and Considerations](#notes-and-considerations)
- [Resources](#resources)
- [Support](#support)
- [License](#license)

---

## Overview

This API serves as the backend for an application exploring the Rick and Morty universe, providing RESTful endpoints to query characters, episodes, and locations. It includes caching mechanisms to enhance performance and is deployed on cloud platforms to ensure scalability and robustness.

---

## Project Setup

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your_username/rick-morty-backend.git

Install dependencies:
bash
Copy
npm install
Configure environment variables:
Copy the .env.example file to .env and adjust the values according to your environment:
bash
Copy
cp .env.example .env
Start the server in development mode:
bash
Copy
npm run start:dev
Frontend Setup
If you have a frontend interacting with this API, please follow the instructions in its respective repository. Ensure the API base URL is correctly configured for seamless communication.

Running and Testing
To compile and run the project, use the following commands:

bash
Copy
# Development mode
npm run start

# Watch mode (for development)
npm run start:dev

# Production mode
npm run start:prod
To run tests:

bash
Copy
# Unit tests
npm run test

# End-to-end tests (E2E)
npm run test:e2e

# Test coverage
npm run test:cov
Deployment
Cloud Run/Cloud Functions and API Gateway
The API can be deployed on Google Cloud using Cloud Run or Cloud Functions. It is also recommended to use an API Gateway to manage and secure access to the API.

Deploying on Cloud Run
Build the Docker image:

docker build -t gcr.io/your_project_id/rick-morty-backend .
Push the image to Google Container Registry:

docker push gcr.io/your_project_id/rick-morty-backend
Deploy to Cloud Run:

gcloud run deploy rick-morty-backend --image gcr.io/your_project_id/rick-morty-backend --platform managed --region your_region
Deploying on Cloud Functions
Adapt the code to be compatible with a cloud function and deploy with:


gcloud functions deploy rickMortyBackend --runtime nodejs20 --trigger-http --allow-unauthenticated
Caching Configuration
To enhance API performance, it is recommended to use caching solutions (e.g., Redis or Google Cloud's built-in caching). Configure your application to cache responses from high-traffic endpoints, reducing latency and database load.

Automated Deployment
Integration with Cloud Build and Google Cloud Deploy simplifies automating the deployment cycle. Below is a basic example:

Cloud Build
Create a cloudbuild.yaml file with the following steps to build, test, and package the application:

# Steps:
- name: 'node:20'
  entrypoint: 'npm'
  args: ['install']
- name: 'node:20'
  entrypoint: 'npm'
  args: ['run', 'test']
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', 'gcr.io/$PROJECT_ID/rick-morty-backend', '.']
images:
- 'gcr.io/$PROJECT_ID/rick-morty-backend'

# Google Cloud Deploy
Set up a deployment pipeline to promote the application to different environments (e.g., staging and production). Refer to the official documentation for advanced configurations.

Notes and Considerations
Environment Variables: Ensure all required variables for database connections and external services are properly configured.
Quotas and Limits: Check Google Cloud quotas to avoid unexpected costs.
Monitoring and Logging: Implement monitoring and logging solutions to track performance and detect issues early.
Updates: Keep dependencies up-to-date to ensure security and stability.
Documentation: Consider maintaining this documentation on a public Notion page for easier access and collaboration.
