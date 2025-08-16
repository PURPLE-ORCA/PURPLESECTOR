# Purple Sector 🏎️💨

*Cut through the F1 scheduling bullshit.*

Purple Sector is a sleek, no-nonsense web application for Formula 1 fans. It delivers clear, accurate race weekend timings, standings, and essential info without the clutter. Built by a fan, for the fans, especially those of us who are tired of converting timezones and digging through confusing websites.

## Live Demo

[Link to Live Demo (Coming Soon!)](#)

## Key Features

*   **Real-time Countdowns:** Dynamic countdowns to upcoming race sessions.
*   **Comprehensive Race Schedules:** Detailed schedules for current and historical F1 seasons.
*   **Driver and Constructor Standings:** Up-to-date championship standings.
<!-- *   **Circuit Information:** Details about various Formula 1 circuits. -->
*   **Latest Race Results:** Quick access to the most recent race outcomes.

### 💜 Philosophy & Open Data

This project was built with a simple idea: F1 data should be accessible and easy to consume. In that spirit, Purple Sector is powered exclusively by free and open-source APIs. A huge thank you to the creators and maintainers of:

-   **[f1api.dev](https://f1api.dev/):** For providing a fantastic, free API for current season data.
-   **[OpenF1 API](https://openf1.org/):** For detailed driver and session data.
-   **[Ergast API](http://ergast.com/mrd/):** The long-standing source for historical F1 data.

This app wouldn't be possible without them.

## Technology Stack

### Frontend
*   **React 19:** A declarative, component-based JavaScript library for building user interfaces.
*   **Vite:** A fast development build tool that provides a lightning-fast development experience.
*   **Tailwind CSS 4:** A utility-first CSS framework for rapidly building custom designs.
*   **shadcn/ui:** A collection of re-usable components built with Radix UI and Tailwind CSS.
*   **Framer Motion:** A production-ready motion library for React.

### Backend
*   **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
*   **External APIs:** Integrates with `f1api.dev`, `OpenF1 API`, and `Ergast API` for comprehensive F1 data.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js installed on your system.

*   Node.js (LTS version recommended)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file:**
    Copy the `.env.example` file and rename it to `.env`. You might need to fill in API keys or other configuration details if required by the external APIs.
    ```bash
    cp .env.example .env
    ```
4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The backend server will typically run on `http://localhost:3001`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application will typically run on `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

The project is divided into `frontend` and `backend` directories:

*   `backend/`: Contains the Node.js (Express.js) API services.
    *   `routes/`: Defines API endpoints.
    *   `services/`: Handles data fetching from external F1 APIs and caching.
*   `frontend/`: Contains the React application.
    *   `src/components/`: Reusable React components, organized by feature (e.g., `home`, `schedule`, `standings`) and utility (`ui`, `layout`).
    *   `src/pages/`: Top-level components representing different views/pages of the application.
    *   `src/services/`: Frontend services for interacting with the backend API.
    *   `public/`: Static assets like images.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes and commit them (`git commit -m 'Add new feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## License

This project is open-source and available under the MIT License.