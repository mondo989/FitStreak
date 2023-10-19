# Health Metrics Tracker

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [File Structure](#file-structure)
- [Usage](#usage)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Introduction
FirStreak is way to tracking and monitoring your fitness activities and weight via a Telegram Bot. Whether you want to log your pushups for the day or check your weight trends, this bot makes it seamless. All data is stored securely in Firebase and can be visualized through a local Node.js application.

## Features
- Initialize user profile with `/start`
- Log various fitness activities such as pushups, squats, and runs
- Special command for gym visits
- Clear metrics for a specific activity
- Summary of today's activities with `/today`
- Track weight
- Visualize metrics through a local Node.js app using D3.js

## Tech Stack
- Telegram Bot: Telegraf
- Backend: Node.js, Express
- Database: Firebase (Firestore/Realtime Database)
- Frontend: D3.js for data visualization, SASS for styling (Not yet implemnted)

## Prerequisites
- Node.js v14.x or higher
- Firebase account
- Telegram Bot Token

## Installation

... (Same as before)

## File Structure
Refer to the [technical spec](link-to-spec) for the detailed file structure.

## Usage
- Initialize the bot with `/start`
- Log pushups: `/pushups 50`
- Log weight: `/weight 200`
- Clear pushups for the day: `/clear pushups`
- View today's activities: `/today`

## Error Handling
- The bot has built-in error handling and will guide the user with a fallback message for invalid commands.

## Deployment
- The application is designed to be deployment-friendly and can be easily deployed to platforms like Heroku, AWS, or any other cloud-based services.
- More details on the deployment process will be added as the project progresses.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
