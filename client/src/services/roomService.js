import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

export const createRoom = async (roomData, token) =>{
    const response = await axios.post(
        `${API_URL}/api/room`,
        roomData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
}

export const getRooms = async (token) => {
  const response = await axios.get(
    `${API_URL}/api/room`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteRoom = async(roomId,token) =>{
  const response = await axios.delete(
    `${API_URL}/api/room/${roomId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
 return response.data;
} 

export const updateRoom = async (roomId, roomData, token) => {
  const response = await axios.put(
    `${API_URL}/api/room/${roomId}`,
    roomData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};