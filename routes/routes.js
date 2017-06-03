var mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {
  console.log("Successful DB Connection.");
});

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  user_level: String,
  email: String,
  age: String,
  ans1: String,
  ans2: String,
  ans3: String
});

var Users = mongoose.model('User_DB', userSchema);

exports.admin = function (req, res) {
  Users.find(function (err, person) {
    if (err) return console.error(err);
    res.render('admin', {
      title: 'Admin Page',
      people: person
    });
  });
};

exports.authenticate = function (req, res) {
  var user = Users.find({ username: req.body.username }, { user: 1 });
  if (user) {
    if (checkPass(user, req.body.password)) {
      console.log('Successful login by ' + user);
    }
  }
};

function checkPass(username, password) {
  var authentic = false,
    dbPass = Users.find({ username: username }, { password: 1, _id: 0 });
    console.log("attempted password: " + password);
    console.log("hashed password: " + dbPass);
  bcrypt.compare(password, dbPass, function (err, res) {
    authentic = res;
  });
  return authentic;
}

exports.index = function (req, res) {
  res.render('index', {
    title: 'Home'
  });
};

exports.create = function (req, res) {
  res.render('create', {
    title: 'Add User'
  });
};

exports.createUser = function (req, res) {
  var hashedPass = hashIt(req.body.password);
  var person = new Users({
    username: req.body.username,
    password: hashedPass,
    user_level: req.body.user_level,
    email: req.body.email,
    age: req.body.age,
    ans1: req.body.ans1,
    ans2: req.body.ans2,
    ans3: req.body.ans3
  });
  person.save(function (err, user) {
    if (err) return console.error(err);
    console.log(req.body.username + ' added');
  });
  res.redirect('/');
};

function hashIt(toHash) {
  var hashed;
  bcrypt.hash(hashIt, null, null, function (err, hash) {
    if (err) {
      console.log(err);
      return;
    }
    hashed = hash;
  });
  return hashed;
}

exports.edit = function (req, res) {
  Users.findById(req.params.id, function (err, user) {
    if (err) return console.error(err);
    res.render('edit', {
      title: 'Edit User',
      person: user
    });
  });
};

exports.editUser = function (req, res) {
  Users.findById(req.params.id, function (err, user) {
    if (err) return console.error(err);
    user.username = req.body.username;
    user.password = req.body.password;
    user.user_level = req.body.user_level;
    user.email = req.body.email;
    user.age = req.body.age;
    user.ans1 = req.body.ans1;
    user.ans2 = req, body.ans2;
    user.ans3 = req.body.ans3;
    user.save(function (err, usr) {
      if (err) return console.error(err);
      console.log(req.body.username + ' updated');
    });
  });
  res.redirect('/');
};

exports.delete = function (req, res) {
  Users.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return console.error(err);
    res.redirect('/admin');
  });
};

exports.details = function (req, res) {
  Users.findById(req.params.id, function (err, usr) {
    if (err) return console.error(err);
    res.render('details', {
      title: usr.username + "'s Details",
      person: usr
    });
  });
};

exports.login = function (req, res) {
  res.render('login', {

  });
};