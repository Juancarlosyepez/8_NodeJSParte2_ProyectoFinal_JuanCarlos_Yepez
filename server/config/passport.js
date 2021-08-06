var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
TwitterStrategy = require('passport-twitter').Strategy;
facebookStrategy = require('passport-facebook');

var Usuario = require('../models/usuarios');

passport.serializeUser(function (user, done){
	if (user) {
		done(null, user);
	}
});

passport.deserializeUser(function (user, done){
	Usuario.findOne({_id : user._id})
	.exec(function (err, user){
		if (user) {
			return done(null, user);
		}else{
			return done(null, false);
		}
	});
});

passport.use('local',new LocalStrategy(
	function(username, password, done){
		Usuario.findOne({nombre_usuario : username})
		.exec(function (err, user){
			if (user && user.authenticate(password)) {
				return done(null, user)
			}else{
				return done(null, false)
			}
		})
	}
));

passport.use(
	new TwitterStrategy(
		{
			consumerKey: 'twjnk3nax8fvKi2Jgx9VYe17a',
			consumerSecret: '4jxuPeZBBwBFqgDGJr4hN4rmxXFChQEXwDXeXm4DNeG9x57slV',
			callbackURL: 'http://localhost:3000/auth/twitter/callback'
		},
		function (token, tokenSecret, profile, done) {
			Usuario.findOne({ nombre_usuario : profile.username })
			.exec(function (err, usuario){
				if (err) {
					console.log(err);
					return done(err);
				}

				if (usuario) {
					usuario.twitter = profile;
					usuario.save(function (err, user){
						if (err) {
							return done(err);
						}
						done(null, user);
					});
				}else{
					new Usuario({
						nombre_usuario : profile.username,
						nombre : profile.displayName,
						twitter : profile
					}).save(function(err, usuario){
						if(!err){
							return done(null, usuario);
						}else{
							return done(err);
						}
					});
				}

			});
		}
	)
);

passport.use(new facebookStrategy({
		clientID:'2780118098880307',
		clientSecret:'1d5b6cd635664c9e5cfe0ae8400b31aa',
		callbackURL:'http://localhost:3000/auth/facebook/callback/'
	},

		function (token, tokenSecret, profile, done) {
			Usuario.findOne({ nombre_usuario : profile.username })
			.exec(function (err, usuario){
				if (err) {
					console.log(err);
					return done(err);
				}

				if (usuario) {
					usuario.facebook = profile;
					usuario.save(function (err, user){
						if (err) {
							return done(err);
						}
						done(null, user);
					});
				}else{
					new Usuario({
						nombre_usuario : profile.username,
						nombre : profile.displayName,
						facebook : profile
					}).save(function(err, usuario){
						if(!err){
							return done(null, usuario);
						}else{
							return done(err);
						}
					});
				}

			});
		}
	
));

module.exports = passport;