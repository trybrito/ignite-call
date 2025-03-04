import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    full_name: string
    email: string
    username: string
    avatar_url: string
  }
}
