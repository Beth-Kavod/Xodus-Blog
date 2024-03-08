"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

import User from '@/types/User'

interface UserContextType {
  user: User;
  login: (userData: User) => void;
  logout: () => void;
}

// Define the shape of the user object
const UserContext = createContext<UserContextType>({
  user: {
    username: "",
    id: ""
  },
  login: (userData: User) => {},
  logout: () => {}
});



// Custom hook to access the user context
export const useUser = () => useContext(UserContext);

// UserProvider component manages user authentication state
export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState(() => {
    try {
      // Check if localStorage is available in the browser environment
        const storedUser = localStorage.getItem('xodus-user');
        return storedUser ? JSON.parse(storedUser) : { username: "", id: "" };
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return { username: "", id: "" };
    }
  });

  // Load user data from localStorage when component mounts
  useEffect(() => {
    // Check if localStorage is available in the browser environment
      const storedUser = localStorage.getItem('xodus-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    // Check if localStorage is available in the browser environment
      localStorage.setItem('xodus-user', JSON.stringify(user));
  }, [user]);

  // Function to log in a user
  const login = (userData: User) => {
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
/* "use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

import User from '@/types/User'

// Define the shape of the user object
const UserContext = createContext({
  user: {
    username: "",
    id: ""
  },
  login: (userData: User) => {},
  logout: () => {}
});



// Custom hook to access the user context
export const useUser = () => useContext(UserContext);

// UserProvider component manages user authentication state
export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState(() => {
    try {
      // Check if localStorage is available in the browser environment
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('xodus-user');
        return storedUser ? JSON.parse(storedUser) : { username: "", id: "" };
      } else {
        return { username: "", id: "" };
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return { username: "", id: "" };
    }
  });

  // Load user data from localStorage when component mounts
  useEffect(() => {
    // Check if localStorage is available in the browser environment
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('xodus-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    // Check if localStorage is available in the browser environment
    if (typeof window !== 'undefined') {
      localStorage.setItem('xodus-user', JSON.stringify(user));
    }
  }, [user]);

  // Function to log in a user
  const login = (userData: User) => {
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
 */