const adminAuth = (req, resp, next) => {
    const adminToken = "xysz";
    const authorized = adminToken == "xyz";
    if (!authorized) {
        resp.status(404).send("Unauthorized admin");
    } else {
        resp.send("Authorized admin");
    }
};

const userAuth = (req, resp, next) => {
    const adminToken = "xyz";
    const authorized = adminToken == "xyz";
    if (!authorized) {
        resp.status(404).send("Unauthorized user");
    } else {
        next();
    }
};


module.exports = {
    adminAuth,
    userAuth
};