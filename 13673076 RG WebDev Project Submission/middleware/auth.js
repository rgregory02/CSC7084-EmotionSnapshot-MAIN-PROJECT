exports.isAuth = (req, res, next) => {

    const { isloggedin, userid } = req.session;

    if (!isloggedin) {
        req.session.route = req.originalUrl;
        return res.redirect('/login');
    } else if (!userid) {
        return res.redirect('/');
    } else {

        const snapshotUserId = req.params.userid;

        // Check if the authenticated user is the same as the target user
        if (snapshotUserId && snapshotUserId !== userid) {
            return res.redirect('/'); // Redirect if the user IDs don't match
        }
        // Proceed to the next middleware or route handler if the user IDs match
        next();
    }
};