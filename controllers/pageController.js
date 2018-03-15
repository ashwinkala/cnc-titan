exports.get_index = function(req, res){
    res.render('index');
}
exports.get_settings = function(req, res){
    res.render('settings');
}
exports.ensure_authenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}