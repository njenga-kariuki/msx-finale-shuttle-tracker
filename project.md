MSx Finale Shuttle Tracker
Project Overview
The MSx Finale Shuttle Tracker is a web application designed to coordinate transportation for the Stanford GSB MSx 2025 graduation celebration at Rosewood Sand Hill on May 16th. The application allows guests to register for shuttle rides between Stanford GSB and Rosewood Sand Hill, helping to streamline the transportation logistics for this special event.
Key Features

Shuttle Registration

Users can select from predefined shuttle departure times
Registration form collects guest name and number of additional guests
Visual indicators show shuttle capacity and availability
Confirmation message appears after successful registration


Current Registrations Overview

Real-time display of all current shuttle registrations
Grouped by shuttle time
Shows registered passenger names and guest counts
Displays total passenger count for each shuttle
Timestamp showing when each registration was made


Registration Management

Users can remove their registrations if plans change
Confirmation dialog prevents accidental deletions


Responsive Design

Mobile-friendly layout adapts to different screen sizes
Stanford GSB branded interface
Clean, elegant design appropriate for a formal event



Technical Details
The application is built using:

React with TypeScript for type safety
Context API for state management
Local storage for data persistence
Tailwind CSS for styling
Lucide React for icons

Core Components

ShuttleContext

Central state management for shuttle data
Tracks all shuttles and their registrations
Provides methods to add and remove registrations
Persists data to local storage


ShuttleRegistration

Main component for the shuttle registration flow
Displays available shuttles and registration form
Manages the registration deletion confirmation


ShuttleCard

Displays individual shuttle information
Shows capacity visualization
Triggers registration form when selected


RegistrationForm

Collects passenger details
Validates and submits registration information
Shows success confirmation


Layout

Provides consistent page structure
Includes Stanford GSB branding
Responsive header and footer



Data Structure
typescriptinterface Registration {
  id: string;
  name: string;
  guests: number;
  timestamp: number;
}

interface Shuttle {
  id: string;
  time: string;
  registrations: Registration[];
}
State Management
The application uses React Context to manage the shuttle data and make it available throughout the component tree. Data is persisted to local storage to maintain registrations even if the browser is closed.
User Flow

User visits the application and sees available shuttle times
User selects a shuttle by clicking the corresponding shuttle card
Registration form appears, prompting for name and number of guests
After submission, a confirmation message appears
User is returned to the shuttle selection view
The "Current Registrations" section updates to show the new registration
User can remove their registration if needed by hovering over it and clicking the delete icon 