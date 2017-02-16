var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy;
var Usuario = require('../models/usuarios');

passport.serializeUser(function (user, done) {
    if (user) {
        done(null, user);
    }
});

passport.deserializeUser(function (user, done) {
    Usuario.findOne({
            _id: user._id
        })
        .exec(function (err, user) {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
});

passport.use('local', new LocalStrategy(
    function (username, password, done) {
        Usuario.findOne({
                nombre_usuario: username
            })
            .exec(function (err, user) {
                if (user && user.authenticate(password)) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            })
    }
));

passport.use('twitter',
    new TwitterStrategy({
            consumerKey: 's19sNF3DITSXOTLPcJR4JlE4B',
            consumerSecret: 'jvrHIHctcEWTu8P60XmLxlhPXTaKR4Fj3h8guQ4cAVXHSzi9xw',
            callbackURL: 'http://localhost:3000/auth/twitter/callback'
        },
        function (token, tokenSecret, profile, done) {
            Usuario.findOne({
                    'twitter': profile.id
                },
                function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        var usuario = new Usuario({
                            nombre: profile.displayName,
                            nombre_usuario: profile.username,
                            twitter: profile.id
                        });
                        usuario.save(function (err, user) {
                            if (err) {
                                done(err, null);
                                return;
                            }
                            done(null, user);
                        });
                    } else {
                        return done(err, user);
                    }
                });
        }
    ));


module.exports = passport;