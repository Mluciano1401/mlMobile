export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isNotEmpty = (value: string): boolean =>
  value.trim().length > 0;

export const minLength = (value: string, min: number): boolean =>
  value.trim().length >= min;

export const validateLogin = (email: string, password: string) => {
  const errors: Record<string, string> = {};
  if (!isValidEmail(email)) errors.email = 'Correo electrónico inválido';
  if (!minLength(password, 6))
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  return errors;
};

export const validateUserForm = (
  name: string,
  email: string,
  password?: string,
) => {
  const errors: Record<string, string> = {};
  if (!isNotEmpty(name)) errors.name = 'El nombre es obligatorio';
  if (!isValidEmail(email)) errors.email = 'Correo electrónico inválido';
  if (password !== undefined && !minLength(password, 6))
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  return errors;
};
