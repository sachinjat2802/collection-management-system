# Collection Management System

This project is a NestJS application that manages case data. It includes functionality to import case data from a CSV file hosted on Google Drive and provides an API endpoint to aggregate case data.

## Setup

### Prerequisites

- Node.js
- npm
- MongoDB

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/collection-management-system.git
    cd collection-management-system
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root of the project and add the following environment variables:
    ```env
    MONGODB_URI=mongodb://localhost/nest
    GOOGLE_DRIVE_FILE_URL=https://drive.google.com/uc?export=download&id=YOUR_FILE_ID
    ```

4. Start the MongoDB server:
    ```bash
    mongod
    ```

5. Run the application:
    ```bash
    npm run start
    ```

## Features

### Data Import

The application imports case data from a CSV file hosted on Google Drive. The import job runs at 10:00 AM and 5:00 PM every day.

#### Data Import Service

The `DataImportService` fetches the CSV file from Google Drive, processes it, and inserts the data into the MongoDB collection. It avoids inserting duplicate documents based on specific fields.

#### Data Import Job

The `DataImportJob` schedules the data import using a cron job.

### Aggregation Endpoint

The application provides an API endpoint to aggregate case data based on the city and date range.

#### Endpoint

- **GET /cases/aggregate**

#### Query Parameters

- `startDate`: The start date for the aggregation (optional).
- `endDate`: The end date for the aggregation (optional).

#### Example cURL Command

```bash
curl -X GET "http://localhost:3000/cases/aggregate?startDate=2023-01-01&endDate=2023-12-31"