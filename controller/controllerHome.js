const path = require('path');
const controller = {
    index:function(req, res) {
        res.render('index.ejs');
    }
}

module.exports = controller;