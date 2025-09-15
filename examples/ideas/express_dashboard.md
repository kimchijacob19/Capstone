# Express Dashboard

## Overview

When the user starts their Express server, a separate server starts up and renders a
collection of real-time interactive visualizations.

## Core Features

- Apply the custom middleware to an existing application
  `app.use(expressDashboard(opts))`
- See a chart of incoming requests over time
- Filter outgoing responses by status code
- Visualize the response time for each request

## Stretch Goals

- See a map of where requests are coming from (by IP address)
- Visualize database performance, such as database read/writes over time
