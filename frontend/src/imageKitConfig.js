// src/imageKitConfig.js
import { IKContext } from 'imagekitio-react';
import React from 'react';
import API_BASE_URL from './config/Config';

// Define the authenticator function
const authenticator = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/imagekit-auth`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

// Set up ImageKit context with environment variables and authenticator
const ImageKitProvider = ({ children }) => (
  <IKContext
    publicKey={process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY}
    urlEndpoint={process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}
    authenticator={authenticator} // Pass authenticator function here
  >
    {children}
  </IKContext>
);

export default ImageKitProvider;
