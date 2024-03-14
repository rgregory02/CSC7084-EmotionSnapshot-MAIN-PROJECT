exports.isLoggedIn = (req, res, next) => {

    const { isloggedin } = req.session;

    if (isloggedin){
        return res.redirect('/');

    }

    next();
};