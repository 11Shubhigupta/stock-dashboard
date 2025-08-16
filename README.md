<img width="1355" height="762" alt="image" src="https://github.com/user-attachments/assets/cd830e42-3ccd-4b57-b890-738c7a642a9d" />
<img width="1365" height="732" alt="Screenshot 2025-08-16 192718" src="https://github.com/user-attachments/assets/85c1f598-34b8-4cbb-8781-4cf4cd3e902b" />
Development Approach

The Stock Market Dashboard was developed with a focus on simplicity, interactivity, and responsiveness. I designed the layout with a left panel containing a scrollable list of companies and a main panel for dynamic stock price charts. My approach was to separate concerns by keeping the frontend purely for visualization and interaction, while the backend handled data and predictions. Smooth animations, a black-blue theme, and responsive styling were added to ensure a professional user experience.

Technologies Used

Frontend: React.js for component-based UI, Recharts for chart visualization, and CSS for styling and animations.

Backend: Node.js with Express.js to build REST APIs, manage company data from JSON, and provide stock predictions.

Data Handling: A regression-based approach was implemented for basic stock price prediction.

Tools: Postman for API testing, npm for dependency management.

Challenges

One major challenge was integrating the frontend with the backend while handling asynchronous API requests. Initially, charts did not update correctly when switching companies, which required careful debugging of React state management. Another difficulty was setting up and configuring the project environment, especially with npm scripts and dependency errors. These issues were resolved step by step by checking API responses, fixing routes, and ensuring proper communication between client and server.
