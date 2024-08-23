import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import prisma from "../utils/prismaClient"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://indieseo.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await prisma.user.upsert({
        where: { googleId: profile.id },
        update: { email: profile.emails![0].value, name: profile.displayName },
        create: {
          email: profile.emails![0].value,
          name: profile.displayName,
          googleId: profile.id,
        },
      })
      done(null, user)
    }
  )
)

try {
  passport.serializeUser((user: any, done) => {
    done(null, user.id)
  })
} catch (error) {
  console.log(error)
}

try {
  passport.deserializeUser(async (id: number, done) => {
    const user = await prisma.user.findUnique({ where: { id } })
    done(null, user)
  })
} catch (error) {
  console.log(error)
}
