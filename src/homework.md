- Create backend/Node repository
- Initialise the Repo(npm init)
- node_modules, package.json, package-lock.json, versioning(major.minor.patch), ^ vs ~
- create src/App.js
- create a server(express/mongo)
- listen to port 3000
- write request handlers to defined routes and send response from the server
- install nodemon(auto run the server on save)
  when we install nodemon -g will install globally but if we haven't installed using sudo cmd(sudo npm i -g nodemon) you will have to set the PATH variable as below, else the nodemon is not set to access though installed globally.// npm i -g nodemon
  // Source - https://stackoverflow.com/a/17976504

      C:\>npm config get prefix
      C:\Users\<username>\AppData\Roaming\npm

      C:\>set PATH=%PATH%;C:\Users\<username>\AppData\Roaming\npm;

      C:\>nodemon
      31 Jul 22:30:29 - [nodemon] v0.7.8
      31 Jul 22:30:29 - [nodemon] to restart at any time, enter `rs`
      31 Jul 22:30:29 - [nodemon] watching: C:\
      31 Jul 22:30:29 - [nodemon] starting `node `
      ^CTerminate batch job (Y/N)? Y

- update package.json scripts with dev and start commands - "scripts": {
  "dev": "nodemon src/App.js",// auto restart on save
  "start": "node src/App.js",// manually restart the server
  },

---

initialize git (git init)
add .gitignore file and update with files that should not be committed. (node_modules)
write sample request handlers for different routes(/, /test, /login, /hello)
Order of placing the request handlers matters a lot.
app.listen(3000, () => {
console.log("Server is running on port 3000");
});
app.use("/", (req, res) => {
res.send("Sample route");
});
app.use("/login", (req, res) => {
res.send("Login route");
});
app.use("/hello", (req, res) => {
res.send("Hello route");
});

    ** here the server listening on port 3000 will return same response for different routes though they are present in the request handlers or not. i.e., "Sample route" is the output for localhost:3000/login (OR) localhost:3000/login1211 (OR) localhost:3000/hello (OR) localhost:3000/xyz (OR) localhost:3000/ (THE ACTUAL ROUTE WITH RESPONSE "Sample route")
    ** But below order or Routes work perfectly bcz it matches the route path sequentially and returns the response. '/' acts as a wild card and would work for any route.

    app.use("/login", (req, res) => {
      res.send("Login route");
    });
    app.use("/hello", (req, res) => {
      res.send("Hello route");
    });
    app.use("/", (req, res) => {
      res.send("Sample route");
    });

stage all files changed that needs to be commited. git commit -m "<COMMIT_MESSAGE>"
create git repo (Dev-Tinder)
git remote add origin https://github.com/mpokala-dev/Dev-Tinder.git
git branch -M main
git push -u origin main
install Postman app and make a Workspace(Dev-Tinder) > create a Collection(Test API calls) > create a HTTP request(GET Test)
Write logic to handle GET, POST, PATCH, DELETE, API calls and test them on Postman

---
