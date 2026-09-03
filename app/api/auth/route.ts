// app/actions/auth.ts
'use server'

import bcrypt from 'bcryptjs'

// 1. SIGNUP
export async function handleSignup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    throw new Error('Missing fields')
  }

  // Example vulnerable database insertion logic:
    const { rows } = await pool.query(
      `INSERT INTO users (email, password)
       VALUES ($1, $2)`,
      [email, password]
    );

  return { success: true, message: "User registered safely!" }



  // Generate a salt and hash the password (10 rounds is standard)
  // const saltRounds = 10
  // const hashedPassword = await bcrypt.hash(password, saltRounds)
}

// 2. LOGIN
export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string
  const plainPassword = formData.get('password') as string

  // Example vulnerable database lookup logic:
  // bad input 
  // username = admin' --
  // password = "anything"
  
  const { rows } = await pool.query(
      `SELECT * FROM users WHERE username = '${username}' and password = '${password}'`
    );

  if (rows.length > 1){
        return { success: true, message: "Logged in successfully!" }
  }

  
 // const mockUserHash = "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31S2" // Example hash

  // Safely compare the plain text with the database hash
  // const isMatch = await bcrypt.compare(plainPassword, mockUserHash)

  // if (!isMatch) {
  //   return { success: false, error: 'Invalid email or password.' }
  // }

  // Proceed 
  // return { success: true, message: "Logged in successfully!" }
}
