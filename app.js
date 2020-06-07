/*
* Author: Lucas Costa
* Date: May of 2020
*/

const { app, BrowserWindow } = require("electron");
const path = require('path')
const express = require("./src/server")

var win = null

function createWindow() {

    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: false,
            contextIsolation: false,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.setIcon('./src/assets/images/logomarca-overlay.png')
    win.loadFile("./src/index.html"); 
}

app.on("ready", createWindow);