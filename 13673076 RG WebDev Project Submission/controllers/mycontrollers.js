const conn = require('../utils/dbconn');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');


exports.getSnapshot = (req, res) => {

    var userinfo = {};
    const { isloggedin, userid } = req.session;
    console.log(`User data from session: ${isloggedin} ${userid}`);

    if (isloggedin) {
        const getuserSQL = `SELECT user.first_name, user.last_name, user_type.role, user.user_id
                            FROM user
                            INNER JOIN user_type ON user.user_type_id = user_type.user_type_id
                            WHERE user.user_id = ?`;

        conn.query(getuserSQL, [userid], (err, rows) => {
            if (err) throw err;
            console.log(rows);
            const userId = rows[0].user_id;
            const username = rows[0].first_name;
            const userrole = rows[0].role;

            const session = req.session;
            session.name = username;
            session.role = userrole;
            session.id = userId;
            console.log(session);

            userinfo = { name: username, role: userrole, id: userId };
            console.log(userinfo);
        });
    }

    const selectSQL = `SELECT * FROM emotion_snapshot WHERE user_id = ?`;
    conn.query(selectSQL, [userid], (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render('index', { summary: rows, loggedin: isloggedin, user: userinfo });
        }
    });
};

exports.getAddNewSnapshot = (req, res) => {

    res.render('addemotion');
};

exports.postNewSnapshot = (req, res) => {
    const { isloggedin, userid } = req.session;
    console.log(`User data from session: ${isloggedin}${userid}`);

    if (isloggedin && userid) {
        let selectedOptions = req.body.listTrigger;
        let commaDelimitedString;

        // Check if selectedOptions is an array
        if (Array.isArray(selectedOptions)) {
            commaDelimitedString = selectedOptions.join(', ');
        } else {
            commaDelimitedString = selectedOptions; // Assuming selectedOptions is a single value
        }

        const { enjoyment_level, sadness_level, anger_level, contempt_level, disgust_level, fear_level, surprise_level, contextual_trigger, new_date } = req.body;

        const vals = [enjoyment_level, sadness_level, anger_level, contempt_level, disgust_level, fear_level, surprise_level, commaDelimitedString, contextual_trigger, new_date, userid];

        const insertSQL = `INSERT INTO emotion_snapshot (enjoyment_level, sadness_level, anger_level, contempt_level, disgust_level, fear_level, surprise_level, list_contextual_trigger, contextual_trigger, timestamp, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        conn.query(insertSQL, vals, (err, rows) => {
            if (err) {
                console.error('Error inserting snapshot:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            console.log('Snapshot inserted successfully');
            res.redirect('/');
        });
    } else {
        res.status(401).send('Unauthorized');
    }
};

exports.selectSnapshot = (req, res) => {

    const { isloggedin, userid } = req.session;
    const snapshotId = req.params.id;

    const selectSQL = `SELECT * FROM emotion_snapshot WHERE emotion_snapshot_id = ?`;

    conn.query(selectSQL, [snapshotId], (err, rows) => {
        if (err) {
            console.error('Error fetching snapshot data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // Check if any rows were returned
        if (rows.length === 0) {
            // Handle case where no data was found for the given snapshotId
            res.status(404).send('Snapshot not found');
            return;
        }
        const snapshotUserId = rows[0].user_id;
        if (!isloggedin || userid !== snapshotUserId) {
            // Redirect or handle unauthorized access
            return res.redirect('/');
        }
        // Check if the logged-in user is authorized to view this snapshot
        res.render('editemotion', { summary: rows });
    });
};

exports.updateSnapshot = (req, res) => {

    const summary_id = req.params.id;
    const selectedOptions = req.body.listTrigger;
    let commaDelimitedString;

    // Check if selectedOptions is an array
    if (Array.isArray(selectedOptions)) {
        commaDelimitedString = selectedOptions.join(', ');
    } else {
        commaDelimitedString = selectedOptions; // Assuming selectedOptions is a single value
    }

    const { enjoyment_level, sadness_level, anger_level, contempt_level, disgust_level, fear_level, surprise_level, contextual_trigger, new_date } = req.body;
    const vals = [enjoyment_level, sadness_level, anger_level, contempt_level, disgust_level, fear_level, surprise_level, commaDelimitedString, contextual_trigger, new_date, summary_id];

    console.log(vals);

    const updateSQL = 'UPDATE emotion_snapshot SET enjoyment_level = ?, sadness_level = ?, anger_level = ?, contempt_level = ?, disgust_level = ?, fear_level = ?, surprise_level = ?, list_contextual_trigger = ?, contextual_trigger = ?, timestamp = ? WHERE emotion_snapshot_id = ?';

    conn.query(updateSQL, vals, (err, rows) => {
        if (err) {
            console.error('Error updating snapshot:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Snapshot updated successfully');
        res.redirect('/');
    });
};

exports.deleteSnapshot = (req, res) => {

    const summary_id = req.params.id;

    const deleteSQL = `DELETE FROM emotion_snapshot WHERE emotion_snapshot_id = ?`;

    conn.query(deleteSQL, summary_id, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/');
        }
    });
};

exports.getSummaryChart = (req, res) => {
    const { isloggedin, userid } = req.session;

    // Function to fetch summary data
    const fetchSummaryData = (query, params) => {
        return new Promise((resolve, reject) => {
            conn.query(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    if (isloggedin) {

        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        if (startDate && endDate) {

            const selectSQL = `SELECT * FROM emotion_snapshot WHERE user_id = ? AND timestamp BETWEEN ? AND ?`;
            const params = [userid, startDate, endDate];

            fetchSummaryData(selectSQL, params)
                .then(rows => {
                    // Process the retrieved rows (data) for filters
                    const { counts, snapshotData } = processSummaryData(rows);
                    // Render the view with the processed data for filters
                    res.render('summarychart', { snapshotData, counts });
                })
                .catch(err => {
                    console.error('Error fetching filtered summary data:', err);
                    res.status(500).send('Internal Server Error');
                });
        } else {
            // No filters provided, fetch all data
            const selectAllSQL = `SELECT * FROM emotion_snapshot WHERE user_id = ?`;
            const paramsAll = [userid];

            fetchSummaryData(selectAllSQL, paramsAll)
                .then(rows => {
                    // Process the retrieved rows (data) for all
                    const { counts, snapshotData } = processSummaryData(rows);
                    // Render the view with the processed data for all
                    res.render('summarychart', { snapshotData, counts });
                })
                .catch(err => {
                    console.error('Error fetching all summary data:', err);
                    res.status(500).send('Internal Server Error');
                });
        }
    } else {
        // If the user is not logged in, send unauthorized response
        res.status(401).send('Unauthorized');
    }
};

// Function to process the retrieved rows (data) and calculate counts and store emotion levels for each snapshot date
const processSummaryData = (rows) => {
    var countsocial = 0;
    var countphysical = 0;
    let countfamily = 0;
    var countwork = 0;
    var countsleep = 0;
    var countweather = 0;
    const snapshotData = {};

    rows.forEach(row => {
        const { timestamp, enjoyment_level, sadness_level, anger_level, contempt_level, disgust_level, fear_level, surprise_level } = row;

        const contextualTriggers = row.list_contextual_trigger ? row.list_contextual_trigger.split(',') : [];
        contextualTriggers.forEach(trigger => {
            switch (trigger.trim()) {
                case 'Social Interaction':
                    countsocial++;
                    break;
                case 'Physical Activity':
                    countphysical++;
                    break;
                case 'Family':
                    countfamily++;
                    break;
                case 'Work':
                    countwork++;
                    break;
                case 'Sleep':
                    countsleep++;
                    break;
                case 'Weather':
                    countweather++;
                    break;
                default:
                    break;
            }
        });

        if (!snapshotData[timestamp]) {
            snapshotData[timestamp] = {
                enjoyment: [],
                sadness: [],
                anger: [],
                contempt: [],
                disgust: [],
                fear: [],
                surprise: []
            };
        }

        snapshotData[timestamp].enjoyment.push(enjoyment_level);
        snapshotData[timestamp].sadness.push(sadness_level);
        snapshotData[timestamp].anger.push(anger_level);
        snapshotData[timestamp].contempt.push(contempt_level);
        snapshotData[timestamp].disgust.push(disgust_level);
        snapshotData[timestamp].fear.push(fear_level);
        snapshotData[timestamp].surprise.push(surprise_level);
    });

    const counts = [countsocial, countphysical, countfamily, countwork, countsleep, countweather];
    return { counts, snapshotData };
};

exports.getLogin = (req, res) => {

    res.render('login', { error: null, success: null });
};

exports.postLogin = (req, res) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        return res.status(422).render('login', { error: errors.array()[0].msg, success: null });
    }

    const { username, userpass } = req.body;
    const vals = [username, userpass];
    const checkuserSQL = `SELECT * FROM user WHERE user.user_name = ?`;

    conn.query(checkuserSQL, username, (err, rows) => {
        if (err) throw err;

        const numrows = rows.length;
        console.log(numrows);

        if (numrows === 0) {
            return res.status(422).render('login', { error: 'User does not exist. Please check your username and try again.', success: null });
        }

        bcrypt.compare(userpass, rows[0].user_password, (err, response) => {
            if (err) {
                return res.status(500).render('login', { error: 'An unexpected error occurred. Please try again later.', success: null });
            }
            if (response) {
                const session = req.session;
                session.isloggedin = true;
                session.username = rows[0].user_name;
                session.userid = rows[0].user_id;
                session.user_password = rows[0].user_password;

                console.log(`postLogin: session: ${session}`);

                var orig_route = session.route;
                console.log(`postLogin: orig_route: ${orig_route}`);

                if (!orig_route) {
                    orig_route = '/';
                }
                res.redirect(`${orig_route}`);
            } else {
                return res.status(422).render('login', { error: 'Incorrect password - please try again!', success: null });
            }
        });
    });
};

exports.getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getSignup = (req, res) => {
    res.render('signup', { error: null, success: null });
};

exports.postSignup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('signup', { error: errors.array()[0].msg, success: null });
    }

    const { firstname, lastname, username, userpass, user_type_id } = req.body;
    const hash = await bcrypt.hash(userpass, 12);

    // Check if the username already exists in the database
    conn.query('SELECT COUNT(*) AS count FROM user WHERE user_name = ?', [username], (err, rows) => {
        if (err) {
            // Handle query error
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        const count = rows[0].count;
        if (count > 0) {
            // Username already exists, send error message to the client
            return res.status(422).render('signup', { error: 'Username already exists!', success: null });
        }

        // Username is unique, proceed with insertion
        const insertSQL = 'INSERT INTO user (first_name, last_name, user_name, user_password, user_type_id) VALUES (?, ?, ?, ?, 1)';
        const vals = [firstname, lastname, username, hash, user_type_id];

        conn.query(insertSQL, vals, (err, rows) => {
            if (err) {
                // Handle insertion error
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            // Redirect with success message
            return res.render('login', { summary: rows, success: 'Account created successfully - please log in', error: null });
        });
    });
};

exports.selectUserDetails = (req, res) => {

    const { isloggedin, userid } = req.session;
    console.log(`User data from session: ${isloggedin}${userid}`);

    if (isloggedin && userid) {
        const selectSQL = `SELECT * FROM user WHERE user_id = ?`;

        conn.query(selectSQL, [userid], (err, rows) => {
            if (err) {
                console.error('Error fetching user details:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Check if any rows were returned
            if (rows.length === 0) {
                // Handle case where no data was found for the given user ID
                res.status(404).send('User details not found');
                return;
            }

            res.render('userdetails', { summary: rows, error: null, success: null });
        });
    }
};

exports.postUpdateDetails = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Handle validation errors
        return res.render('userdetails', { summary: [], error: errors.array()[0].msg, success: null });
    }

    // If validation passes, continue with the update logic
    const { firstname, lastname, username, userpass } = req.body;
    const userId = req.session.userid;

    try {
        // Check if the username already exists in the database (excluding the current user)
        conn.query('SELECT COUNT(*) AS count FROM user WHERE user_name = ? AND user_id != ?', [username, userId], async (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            const count = rows[0].count;
            if (count > 0) {
                return res.status(422).render('userdetails', { summary: [], error: 'Username already exists!', success: null });
            }

            // Hash the new password
            const hash = await bcrypt.hash(userpass, 12);

            // Update user details in the database
            conn.query('UPDATE user SET first_name = ?, last_name = ?, user_name = ?, user_password = ? WHERE user_id = ?',
                [firstname, lastname, username, hash, userId], (err, rows) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }
                    // Fetch updated user details after the update and render the page with the summary
                    conn.query('SELECT * FROM user WHERE user_id = ?', [userId], (err, rows) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Internal Server Error');
                        }
                        // Render the 'userdetails' page with the updated summary data and success message
                        return res.render('userdetails', { summary: rows, success: 'Information updated successfully!', error: null });
                    });
                });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};