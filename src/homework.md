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
