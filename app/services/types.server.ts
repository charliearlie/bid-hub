export type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type ManufacturerForm = {
  name: string;
  country: string;
  discipline?: string;
};
