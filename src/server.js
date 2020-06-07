
/*
 * Author: Lucas Costa
 * Date: May of 2020
 */
const exec = require('child_process').exec;
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const imageThumbnail = require('image-thumbnail')


const ex = express()

const Directory = {
    List: DirectoryList,
}

ex.use(cors())
ex.use(express.static(__dirname + '/'))
ex.use(express.static('C:/'))
ex.use(express.static('D:/'))

ex.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname+'/index.html'));
})

ex.get('/panel', (req, res)=> {
    res.sendFile(path.join(__dirname+'/panel.html'));
})

ex.get('/display', (req, res)=> {
    res.sendFile(path.join(__dirname+'/display.html'));
})

ex.get('/source', (req, res)=> {

    fs.readFile(req.query.path, (err, data)=> {
        res.writeHead(200, {'Content-Type': 'image'})
        res.end(data);
    });

})

ex.get('/thumbnail', async(req, res)=> {

    if(req.query.path.length > 5) {
        var thumbnail = await imageThumbnail(req.query.path);
        res.writeHead(200, {'Content-Type': 'image'})
        res.end(thumbnail);
    } else {
        res.json({ path: "no found" })
    }

})

ex.get('/directory', async (req, res)=> {
    
    if(req.query.path == "drives") {
        DriveList((drives)=> { res.json(drives) })
    }

    if(req.query.path != "drives") {   
        GetImages(req.query.path, (directories)=> {   
            res.json(directories)
        })
    }

})

ex.listen("1010", ()=> { })

function GetImages(path, callback) {
    
    Directory.List(path, (directories)=> {  
        
        var dir = directories.filter((directory)=> {
            if(directory.type == "file") {
                if(
                    compare(directory.name.toLowerCase(), ".jpg")
                    || compare(directory.name.toLowerCase(), ".jpeg")
                    || compare(directory.name.toLowerCase(), ".png")
                    || compare(directory.name.toLowerCase(), ".bmp")
                    || compare(directory.name.toLowerCase(), ".gif")
                    || compare(directory.name.toLowerCase(), ".webp")
                    || compare(directory.name.toLowerCase(), ".sgv")
                ) {
                    return directory
                }
            }
            if(directory.type == "directory") {
                return directory
            }

            return false
        })

        callback(dir)
    })

}

function compare(name, ext) {
    return (name.indexOf(ext) != -1)
}

async function DirectoryList(path, callback) {
    var directories = []
    
    const dir = await fs.promises.opendir(path);

    for await (const dirent of dir) {

        var type = (isDirectory(path+dirent.name)) ? "directory" : "file"
        var letter = dirent.name.substring(0,1)
        
        if (!(letter == "$" || letter == ".") ) {
            directories.push({ name: String(path+dirent.name), type: type });
        }

    }

    callback(directories)
}

function isDirectory(path) {
    try {
        var stat = fs.statSync(path); 
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

function DriveList(callback) {

    var drives = []

    exec('wmic logicaldisk get name', (error, stdout, stderr) => {

        list = stdout.replace(/Name/g, "").replace(/\r/g, "").replace(/\n/g, "").replace(/ /g, "").trim()
        list = list.split(":")
        
        list.forEach((drive)=> {
            if(drive.length > 0) {
                drives.push({ name: String(drive.trim()+":"), type: "directory"})
            }
        })

        callback(drives)
    });
}