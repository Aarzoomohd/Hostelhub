import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createHostel = async(hostelData,token) =>{
     const response = await axios.post(
        `${API_URL}/api/hostel`,
        hostelData,
        {
             headers: {
             Authorization: `Bearer ${token}`,
            },
        }
     );

     return response.data;
}

export const getHostelDetails = async(token) => {
     const response = await axios.get(
          `${API_URL}/api/hostel`,
          {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          }
     );

     return response.data;
}

export const updateHostel = async(hostelData, token) => {
     const response = await axios.put(
          `${API_URL}/api/hostel/update`,
          hostelData,
          {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          }
     );

     return response.data;
}
