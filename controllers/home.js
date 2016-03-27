module.exports = {
    index: function(req, res) {
        if(req.user) {
            if (!req.user.name) {
                req.user.name = req.user.username;
            }
        }

        res.render('index', { user: req.user });
    }
};
