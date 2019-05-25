const mongoose = require("mongoose");
const config = require("../../../package");
var Db = require("../models/document");
mongoose.connect("mongodb://localhost:1212/" + config.name, {useNewUrlParser: true})
  .catch((err) => console.error(err.name +  " error: " + err + "\n\nTry running npm run mongo"));

const functions = {
    getAll(cb) {
        Db
        .find({})
        .exec((err, docs) => {
            if (err) {
                return cb(err, false);
            }
            if(docs) {
                return cb(null, docs);
            } else {
                return cb(null, false);
            }
        });
    },


    set(key, value, cb) {
        if(!key || !value) {
            return false;
        }
        var newDoc = new Db({key, value});
        console.log(JSON.stringify(newDoc));
        newDoc.save();
        cb(true);
    },


    get(key, cb) {
        Db.findOne({key}, function(err, res)  {
            if (err) {
                return cb(err, false);
            }
            if(res) {
                return cb(null, res);
            } else {
                return cb(null, false);
            }
        });
    }
};

module.exports = functions;
