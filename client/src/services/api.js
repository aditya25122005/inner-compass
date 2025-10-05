import axios from "axios";

// This is the configured axios instance, correctly named API
const API = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;

export const journalAPI = {
  // Existing function to create an entry
  createEntry: async (content, mood) => {
    // FIX: Changed 'api' to 'API' (uppercase) to match the instance name
    const response = await API.post('/journal', { content, mood });
    return response.data;
  },

  // NEW FUNCTION: Fetch all journal entries (or last few)
  getAllEntries: async () => {
    // FIX: Changed 'api' to 'API' (uppercase) to match the instance name
    const response = await API.get('/journal'); 
    return response.data; // Expecting an array of entries
  },
  
 
};