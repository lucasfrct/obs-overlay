/*
* Author: Lucas Costa
* Date: September 2020
*/  

const { app, BrowserWindow } = require("electron")
const path = require('path')

// Calls the file to start the server
const express = require(path.join(__dirname+"/app/path/path.server"))

var win = null

function createWindow() {

    win = new BrowserWindow({
        width: 960,
        height: 540,
        //rame: false, // remove the top bar from the menu
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: false,
            contextIsolation: false,
            sandbox: false,
        }
    });

    win.setIcon(path.join(__dirname+'/assets/images/logomarca-overlay.ico'))
    win.loadFile(path.join(__dirname+"/index.html")); 
}

app.on("ready", createWindow)