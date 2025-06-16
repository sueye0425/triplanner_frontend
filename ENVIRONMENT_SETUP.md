# Environment Setup Guide

## API URL Configuration

This application uses the `VITE_API_URL` environment variable to configure the backend API URL for both local development and production environments.

## Setup Instructions

### 1. Local Development

Create a `.env` file in the root directory with:

```bash
# Local Development
VITE_API_URL=http://localhost:8000
```

### 2. Production Deployment

For production, update your `.env` file to:

```bash
# Production
VITE_API_URL=https://tripaibuddy-backend-850428903067.us-central1.run.app
```

### 3. Netlify Deployment

For Netlify production deployment, set the environment variable in your Netlify dashboard:

1. Go to Site settings > Environment variables
2. Add: `VITE_API_URL = https://tripaibuddy-backend-850428903067.us-central1.run.app`

## Files Using Environment Variables

The following files correctly use the `VITE_API_URL` environment variable:

- `src/services/tripService.ts` - Main API service
- `src/components/RestaurantCard.tsx` - Restaurant photo URLs
- `src/components/ItineraryBlockCard.tsx` - Itinerary photo URLs
- `vite.config.ts` - Development proxy configuration

## Switching Between Environments

To switch between local development and production:

1. **For Local Development:**
   ```bash
   # In .env file
   VITE_API_URL=http://localhost:8000
   ```

2. **For Production Testing:**
   ```bash
   # In .env file
   VITE_API_URL=https://tripaibuddy-backend-850428903067.us-central1.run.app
   ```

3. **Restart your development server** after changing the `.env` file:
   ```bash
   npm run dev
   ```

## Verification

To verify the correct API URL is being used, check the browser console logs. The application logs all API requests with the full URL.

## Security Note

The `.env` file is already properly excluded from version control via `.gitignore` to protect sensitive configuration. 