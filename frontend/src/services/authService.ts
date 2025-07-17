// src/services/authService.ts

import apiClient from "./apiclient"

// Define the types for user and login responses
export type SignupData = {
  name: string
  email: string
  password: string
}

export type LoginData = {
  email: string
  password: string
}

export type AuthResponse = {
  token: string
  user: {
    _id: string
    name: string
    email: string
  }
}

// Sign up a new user
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/signup", data)
  return response.data
}

// Log in an existing user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/login", data)
  return response.data
}

// Optionally, add a logout function (for FE only)
export const logout = () => {
  // Remove token from storage (if used)
  localStorage.removeItem("token")
}
