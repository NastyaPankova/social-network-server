import { CookieOptions } from 'express';

export const setCookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: true,
  //todo
  //убрать комментарий со строки ниже
  //secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge,
});
