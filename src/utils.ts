import axios from "axios";
import { API_URL } from "./App";

export const isPasswordStrong = (password: string): boolean => {
  let isPasswordStrong = false;

  const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>/?`~\\";
  const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
  const NUMERICAL_CHARS = "1234567890";
  let hasSpecial = false;
  let hasUpper = false;
  let hasLower = false;
  let hasNumerical = false;

  if (password.length < 6) return false;

  for (const passwordChar of password) {
    if (hasSpecial && hasUpper && hasNumerical && hasLower) {
      isPasswordStrong = true;
      break;
    }

    if (!hasSpecial && SPECIAL_CHARS.includes(passwordChar)) {
      hasSpecial = true;
    }

    if (!hasUpper && UPPERCASE_CHARS.includes(passwordChar)) {
      hasUpper = true;
    }

    if (!hasLower && LOWERCASE_CHARS.includes(passwordChar)) {
      hasLower = true;
    }

    if (!hasNumerical && NUMERICAL_CHARS.includes(passwordChar)) {
      hasNumerical = true;
    }
  }

  if (isPasswordStrong) {
    return isPasswordStrong;
  } else {
    return hasSpecial && hasUpper && hasLower && hasNumerical;
  }
};

export const uploadFile = async (file: File) => {
  try {
    const response = await axios.post<{
      success: boolean;
      message: string;
      url: string;
    }>(
      `${API_URL}/api/file/upload`,
      {
        imageFile: file,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.url;
  } catch (error) {
    throw new Error("failed to upload file");
  }
};
