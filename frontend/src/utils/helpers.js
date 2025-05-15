export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  export const calculateTotalCalories = (ingredients) => {
    return ingredients.reduce((total, ing) => {
      return total + (ing.calories_per_100g * ing.amount_in_grams / 100);
    }, 0).toFixed(2);
  };
  
  export const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  };