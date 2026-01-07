import axios from "axios";

const API_URL = "http://localhost:4000/api/chat";

export const fetchChatsApi = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.get(API_URL, config);
  return data;
};

export const accessChatApi = async (userId, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(
    API_URL,
    { userId },
    config
  );

  return data;
};
