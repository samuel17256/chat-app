export interface ValidationResult {
  ok: true;
}

export interface ValidationError {
  ok: false;
  error: string;
}

export type ValidateResult = ValidationResult | ValidationError;

export function validateRegistration(
  username: string,
  email: string,
  password: string
): ValidateResult {
  if (!username || !email || !password) {
    return { ok: false, error: "Fill all inputs" };
  }

  if (username.trim().length < 6) {
    return { ok: false, error: "Username must be at least 6 characters" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, error: "Email must be valid" };
  }

  if (!isValidPassword(password)) {
    return {
      ok: false,
      error: "Password must contain uppercase, lowercase, number and special character (@#$%&)",
    };
  }

  return { ok: true };
}

export function validateLogin(email: string, password: string): ValidateResult {
  if (!email || !password) {
    return { ok: false, error: "Fill all inputs" };
  }
  return { ok: true };
}

export function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[@#$%&]/.test(password) &&
    !/\s/.test(password)
  );
}
