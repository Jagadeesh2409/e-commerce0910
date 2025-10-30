const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const knex = require("../db/knexConfig");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await knex("users")
          .where({ google_id: profile.id })
          .first();

        if (!user) {
          // Create new user if not exists
          const newUser = {
            google_id: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || null,
            profile_img: profile.photos?.[0]?.value || null,
            login_provider: "google",
          };

          const [id] = await knex("users").insert(newUser);
          user = await knex("users").where({ id }).first();
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        // Attach token to user object
        user.token = token;

        return done(null, user);
      } catch (err) {
        console.error("Google Auth Error:", err);
        done(err, null);
      }
    }
  )
);

// Optional (if you use sessions)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await knex("users").where({ id }).first();
  done(null, user);
});

module.exports = passport;
