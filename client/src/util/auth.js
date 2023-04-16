import axiosInstance from "./axios";

export const setSession = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  }
};

export const getSession = () => {
  const token = localStorage.getItem("token");
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  return token;
};

export const clearSession = () => {
  localStorage.clear();
  console.log("SESSION CLEARED");
};
