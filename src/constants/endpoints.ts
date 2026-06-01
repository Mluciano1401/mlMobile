
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  users: {
    base: '/users',
    byId: (id: string) => `/users/${id}`,
  },
  upload: '/upload',
} as const;
