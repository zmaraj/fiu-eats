// app/actions/auth.ts
'use server'

import bcrypt from 'bcryptjs'

// 1. SIGNUP: Hash the password before saving to your database
export async function handleSignup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    throw new Error('Missing fields')
  }

  // Generate a salt and hash the password (10 rounds is standard)
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  // Example database insertion logic:
  // await db.user.create({ data: { email, password: hashedPassword } })

  return { success: true, message: "User registered safely!" }
}

// 2. LOGIN: Compare incoming plain text password against stored hash
export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string
  const plainPassword = formData.get('password') as string

  // Example database lookup logic:
  // const user = await db.user.findUnique({ where: { email } })
  const mockUserHash = "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31S2" // Example hash

  // Safely compare the plain text with the database hash
  const isMatch = await bcrypt.compare(plainPassword, mockUserHash)

  if (!isMatch) {
    return { success: false, error: 'Invalid email or password.' }
  }

  // Proceed with session management/JWT creation...
  return { success: true, message: "Logged in successfully!" }
}
