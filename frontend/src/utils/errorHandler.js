export const handleApiError = (error) => {
    if (error.response) {
      // Server responded with error
      return error.response.data.message || 'An error occurred';
    } else if (error.request) {
      // Request made but no response
      return 'Could not connect to server';
    } else {
      // Error in request setup
      return 'An error occurred';
    }
  };