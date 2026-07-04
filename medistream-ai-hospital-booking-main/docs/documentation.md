# MediStream AI — Project Documentation

## 1. Introduction

MediStream AI is an intelligent hospital triage and appointment management platform designed to assist patients in identifying the correct medical department and urgency level before booking a consultation.

The system integrates an AI-powered symptom analysis engine using Google Gemini to evaluate patient-reported symptoms and classify medical urgency. Based on the analysis, patients are routed to the appropriate department and can schedule appointments accordingly.

The platform also provides an administrative dashboard that allows hospital staff to monitor patient queues and prioritize cases based on urgency.

---

## 2. Problem Statement

Traditional hospital appointment systems require patients to manually select departments when booking consultations.

This approach introduces several challenges:

• Patients may choose the wrong department due to lack of medical knowledge  
• Urgent cases may be delayed because the system does not prioritize severity  
• Hospital staff must manually triage patients after arrival  
• Inefficient routing increases waiting time and congestion  

These limitations reduce operational efficiency and can delay critical medical attention.

---

## 3. Proposed Solution

MediStream AI introduces an AI-assisted triage workflow that evaluates symptoms before appointment booking.

The system performs the following steps:

1. Patients describe their symptoms in natural language.
2. The backend sends the symptoms to Google Gemini for analysis.
3. The AI determines the appropriate medical department.
4. The AI classifies urgency into one of three categories:
   
   - Emergency
   - Priority
   - Normal

5. The patient books an appointment based on the AI recommendation.
6. The administrative dashboard displays appointments ordered by urgency.

This approach helps ensure that patients are directed to the correct department while allowing hospitals to prioritize critical cases.

---

## 4. System Overview

The platform follows a layered architecture composed of three primary layers.

### Client Layer

The client layer provides the user interfaces for interacting with the system.

Components:

• Patient Web Application  
• Administrative Dashboard  

Patients use the web application to perform symptom checks and book appointments, while administrators monitor and manage the patient queue.

---

### Application Layer

The backend is implemented using FastAPI and acts as the central system responsible for authentication, AI integration, and appointment management.

Key services include:

• Authentication Service (JWT-based login and authorization)  
• Appointment Management Engine  
• AI Triage Integration  
• Priority Queue Logic for urgent cases  

The backend exposes REST APIs that are consumed by the frontend applications.

---

### External Services

The system integrates external services for AI processing and data storage.

Components:

• MongoDB Database — stores users, appointments, and symptom data  
• Google Gemini API — performs natural language symptom analysis and urgency classification  

---

### Notification System

The platform also supports browser-based reminders that notify patients about upcoming appointments.

Available reminder intervals:

• 15 minutes before appointment  
• 1 hour before appointment  
• 24 hours before appointment  

These notifications help reduce missed consultations.

---

## 5. Core Features

### AI Symptom Analysis

The system uses a structured prompt sent to Google Gemini to analyze symptoms and generate triage results.

The AI returns:

- Suggested department
- Urgency level
- Reasoning for the classification

---

### Priority-Based Scheduling

Appointments are automatically ordered by urgency level in the administrative dashboard.

Priority order:

Emergency → Priority → Normal

This allows hospital staff to quickly identify and address critical cases.

---

### Role-Based Access Control

The platform supports two types of users:

Patient  
Administrator  

Role-based authorization ensures that administrative functionality is accessible only to authorized users.

---

### Appointment Management

Patients can perform the following actions:

• Book appointments  
• Cancel existing bookings  
• Reschedule consultations  
• View past appointment history  

Each appointment stores AI-generated triage information along with scheduling details.

---

## 6. Technology Stack

Frontend  
React  
TypeScript  
TailwindCSS  
Vite  

Backend  
FastAPI  
Python  
JWT Authentication  

Database  
MongoDB  

AI Integration  
Google Gemini API  

Deployment  
Frontend: Vercel  
Backend: Render  

---

## 7. Future Improvements

Potential enhancements for the platform include:

• More advanced AI triage models  
• Real-time queue updates using WebSockets  
• SMS or email appointment reminders  

---

## 8. Conclusion

MediStream AI demonstrates how artificial intelligence can be integrated into healthcare workflows to improve patient routing and triage efficiency.

By analyzing symptoms before appointment booking, the system helps guide patients to the appropriate department while enabling hospitals to prioritize urgent cases more effectively.