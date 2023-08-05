const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const PORT = 3000;
app.set("view engine","ejs");
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let username;
//router for all files 
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/LogSucess", (req, res) => {
  res.render("LogSucess");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/User_already", (req, res) => {
  res.render("User_already");
});
app.get("/wrongDetail", (req, res) => {
  res.render("wrongdetail");
});
app.get("/styles.css", (req, res) => {
  res.sendFile(__dirname + "../styles.css");
});
//logout
app.get("/logout", function (req, res) {
  res.redirect("/");
});


//user login post request 
app.post("/login", function (req, res) {
  const { name, password } = req.body;
  getAllusers(function (error, users) {
    if (error) {
      res.render("login", { error: error });
    } else {
      const match = users.find(function (user) {
        return user.username === name;
      });
      if (match === undefined) {
        res.send("User not registered ");
      } else {
        if (match.username === name && match.password === password) {
          res.render("header",{name:name});
        } else {
          res.render("wrongDetail");
        }
      }
    }
  });
});

//post signup
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const user = {
    username: username,
    email: email,
    password: password,
  };

  //save entry in file
  saveUser(user, function (error, flag) {
    if (error) {
      res.render("signup", { error: error });
    } else if (flag === true) {
      res.render("User_already");
    } else {
      res.redirect("/login");
    }
  });
});

//server starts here 
app.listen(PORT, () => {
  console.log(`Server start at port ${PORT}`);
})

// get all user func
function getAllusers(callback) {
  fs.readFile("./Data.txt", "utf-8", function (error, data) {
    if (error) {
      callback(error);
    } else {
      if (data.length === 0) {
        data = "[]";
      }
      try {
        let users = JSON.parse(data);
        callback(null, users);
      } catch (error) {
        callback(null, []);
      }
    }
  });
}

//func save users
function saveUser(newuser, callback) {
  getAllusers(function (error, users) {
    if (error) {
      callback(error);
    } else {
      const user = users.find(function (user) {
        return user.email === newuser.email;
      });
      if (user) {
        callback(null, true);
      } else {
        users.push(newuser);

        fs.writeFile("./Data.txt", JSON.stringify(users), function (error) {
          if (error) {
            callback(error);
          } else {
            callback();
          }
        });
      }
    }
  });
}


