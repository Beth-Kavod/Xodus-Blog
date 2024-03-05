"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of the user object
const UserContext = createContext({
  user: {
    username: "",
    id: ""
  },
  login: (userData) => {},
  logout: () => {}
});

// Custom hook to access the user context
export const useUser = () => useContext(UserContext);

// UserProvider component manages user authentication state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      console.log(storedUser)
      return storedUser ? JSON.parse(storedUser) : { username: "", id: "" };
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return { username: "", id: "" };
    }
  });

  console.log(user)

  // Load user data from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Function to log in a user
  const login = (userData) => {
    setUser(userData);
  };

  // Function to log out a user
  const logout = () => {
    setUser({
      username: "",
      id: ""
    });
  };

  // Provide the user context to children components
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
