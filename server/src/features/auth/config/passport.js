import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from '../../../shared/config/env.js';
import { User } from '../../users/models/User.js';

export const configurePassport = () => {
  if (!env.google.clientId || !env.google.clientSecret) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.google.clientId,
        clientSecret: env.google.clientSecret,
        callbackURL: env.google.callbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            const email = profile.emails?.[0]?.value;
            user = await User.findOne({ email });
            if (user) {
              user.googleId = profile.id;
              user.avatar = profile.photos?.[0]?.value;
              await user.save();
            } else {
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName || 'Google User',
                email: email || `${profile.id}@google.oauth`,
                avatar: profile.photos?.[0]?.value,
                role: 'user',
              });
            }
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
};
