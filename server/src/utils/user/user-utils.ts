import { verify } from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
  username: string;
}
export const getUserIdFromToken = (token: string): number | null => {
  const tokenData = verify(token, process.env.JWT_SECRET) as JwtPayload;
  if (tokenData) {
    const { id } = tokenData;
    if (id) return id;
  }
  return null;
};
