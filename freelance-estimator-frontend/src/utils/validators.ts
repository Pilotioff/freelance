export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function minLength(value: string, min: number): boolean {
  return value.length >= min;
}
