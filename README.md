# NeuroForm.Ai

## Description

**NeuroForm.Ai** is an intelligent, form-generating chatbot that uses **Natural Language Processing (NLP)** to dynamically create interactive forms based on user input. Built using **React**, **Compromise.js**, and **Firebase**, this application interprets user queries and generates appropriate input fields in real time—creating a conversational form-filling experience.

This project was designed to demonstrate how NLP can be used to enhance UX by turning unstructured user language into structured data collection.

### Example Use Case

- **User**: "> "Create a form with name as text, age as number, and date of birth as date""
- **Response: ** "> " ![image](https://github.com/user-attachments/assets/676b199f-90ae-4376-a66b-26c045f90e96)


## Key Features

- ✨ **Dynamic Form Generation** based on user intent.
- 🧠 **NLP using Compromise.js** to extract entities like date, time, name, etc.
- ⚛️ **React.js** frontend for a seamless UI.
- 🔥 **Firebase** as a real-time backend database.
- ⚡ Easily extensible for more form types and inputs.

## How Compromise.js Is Used

[**Compromise.js**](https://github.com/spencermountain/compromise) is a lightweight NLP library for JavaScript. In this project, it's used to:

- Detect and extract entities (e.g., date, time, names) from user input.
- Understand intent from free-form text.
- Translate language into structured form schemas.

### Prerequisites

Before running this project, ensure that you have **Node.js**, **npm**, and **Firebase** CLI installed on your system.

- Download and install **Node.js** from [https://nodejs.org/](https://nodejs.org/).
- Check the installation by running:
  ```bash
  node -v
  npm -v
