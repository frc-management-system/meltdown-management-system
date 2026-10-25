# Development Machine Setup

## Install Git

- Git is a source control tool we use to manage and share our code
- [Windows Install](https://git-scm.com/downloads/win)
- [Mac/Linux Install](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Install Visual Studio Code

### To install VSCode
1. Install Visual Studio Code [here](https://code.visualstudio.com/download)

### Required VSCode extensions
- Prettier - Code Formatter
- Draw.io Integration

### Optional but useful extensions (especially if working with the AWS stuff)
- GitLens
- HashiCorp Terraform
- Markdown All in One
- The Python extension by Microsoft (Will install Python Debugger and Pylance as well)
- AWS Toolkit

### Auto-formatting in VS-code
1. Press `ctrl + ~` to open your console in VS Code
2. Run npm install, this will install our prettier packages that handle formatting
3. Press `crtl + lshift + p` to open the command pallete
4. Search for and select `Preferences: Open User Settings (JSON)`
5. Copy/Paste the following configs into your JSON file.

```
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
```

6. This configures your default formatter to use prettier and formats your code when you save


## Clone the repository

1. Create a folder somewhere on your machine for all your repositories, ex: `C:/repos/`
2. Open command prompt and navigate to the folder you want to clone your repositories in
3. Run: `git clone https://github.com/frc2357/FRC-2025.git`

## NVM and Node.js

1. Node.js is used to control the formatting in our repository
2. To manage multiple version of Node, we will first install Node Version Manager

   - [Windows Install](https://github.com/coreybutler/nvm-windows/releases/latest)
   - [Mac/Linux Install](https://github.com/nvm-sh/nvm/releases/latest)

3. Once NVM is installed, open `command prompt`
4. Run `nvm install 20.18.1`
5. Run `nvm use 20.18.1`
6. Your machine is now setup to run Node 20.18.1!

## Installing Node Packages
This project uses workspaces to allow for easy install of all Node packages
1. Run `npm install` from the repo root to install all node packages 

## Expo
Expo is a fundamental part of the SDLC (software development lifecycle ) and allows to debug, build, and publish artifacts for the Sentinel project. The easiest way to develop on Sentinel is running a deb build of Sentinel on a tablet.

1. Make an EXPO account: https://expo.dev/login
2. Ask Nolan to add you to the systemmeltdown2357 organization
3. Log into expo on the browser of the tablet you are going to develop alongside with. It is strongly recommended to use an Amazon Fire 7 tablet as that is what all the actual scouting tablets are.
4. Navigate to `https://expo.dev/accounts/systemmeltdown2357/projects/scouting-Sentinel`
5. Download and install the latest artifact with a `development` profile. 
6. This will install a special build of Sentinel that has the hardware-specific code compiled and allows you to connect to your developer server from your machine to allow you to develop with hot-refreshes enabled.

## Developing on Sentinel
Sentinel is a [React Native](https://reactnative.dev/) application and we use [Expo](https://docs.expo.dev/get-started/introduction/) to help develop and build it

1. To start the dev server for Sentinel start at the root of the repo
2. From your terminal, run `cd scouting/Sentinel` to change your working directory to Sentinel
3. Make sure the tablet you are using and your machine is on the same network
3. Run `npm run start` to start the developer server
4. Open the Sentinel developer build on your tablet
5. When the developer server finishes spinning up, it will display a QR code and below a URL corresponding to the address of the server
6. The line with the URL will look something like:
   
    `Metro waiting on exp+scouting-sentinel://expo-development-client/?url=http%3A%2F%2F10.110.96.9%3A8081`
  
    The `http%3A%2F%2F10.110.96.9%3A8081` is the URL your server is at

    You'll notice there are some strange characters in the URL like `%3A` and `%2f`. That is because it is encoded using URL encoding. The `%3A` is equivalent to `:` and `%2f` is equivalent to `/`. So when decoding this URL we get `http://10.110.96.9:8081`. 

7. On your tablet, you can try scanning the QR code to connect to the server, but it will likely not work
8. It is more reliable to just type in the displayed URL.
    - Be sure to decode the URL as you type it in.
9. After typing in the URL, press `connect`. This may take a second, but the tablet should connect to your dev server and show the startup screen for Sentinel.
10. Try making some visible changes in Sentinel, you should see your tablet will hot-reload and show the changes.

## Developing on Overseer
Overseer is an [Electron](https://www.electronjs.org/) application.

1. To start Overseer for developing start at the root of the repo
2. From your terminal, run `cd scouting/overseer` to change your working directory to overseer
3. Run `npm run start`. This will build and run the main and preload process of the Electron application, and start a vite dev server. 
4. This will open a dev application.
5. If you examine the overseer project structure you will a structure similair to this:
    ```
     src
     | - main
     | - preload
     | - renderer
    ```
    Any code in the main and preload folders is   built and ran once on startup. Any code in  renderer is included in the vite dev server  and will hot-reload as you make changes  while you work
  
6. Try making some visible changes in the components in the `renderer` folder, it will hot-reload and show your changes in the open dev application. 