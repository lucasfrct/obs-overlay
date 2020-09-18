
/*
 * Author: Lucas Costa
 * Date: September 2020
 */

 const config = {
    root: "/../../",
 }

const exec = require('child_process').exec;
const express = require('express')
const cors = require('cors')
const Path = require('path')
const fs = require('fs')
const imageThumbnail = require('image-thumbnail')

const ex = express()

const Directory = {
    List: DirectoryList,
}

ex.use(cors())
ex.use(express.static(Path.join(__dirname+config.root)))
ex.use(express.static(Path.join('C:/')))
ex.use(express.static(Path.join('D:/')))

ex.get('/', (req, res)=> {
    res.sendFile(Path.join(__dirname+config.root+"index.html"))
})

ex.get('/panel', (req, res)=> {
    res.sendFile(Path.join(__dirname+config.root+'panel.html'));
})

ex.get('/display', (req, res)=> {
    res.sendFile(Path.join(__dirname+'/../../display.html'));
})

ex.get('/source', (req, res)=> {

    fs.readFile(Path.join(req.query.path), (err, data)=> {
        res.writeHead(200, {'Content-Type': 'image'})
        res.end(data);
    });

})

ex.get('/thumbnail', async(req, res)=> {

    if(req.query.path.length > 5) {
        var thumbnail = await imageThumbnail(Path.join(req.query.path))
        res.writeHead(200, {'Content-Type': 'image'})
        res.end(thumbnail)
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
    
    var extensions = [".jpg", ".jpeg", ".png", ".bmp", ".gif", ".webp", ".sgv"]

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
        
        console.log("DIR", dirent)

        var type = (dirent.isDirectory()) ? "directory" : "file"
        var letter = dirent.name.substring(0,1)
        
        if (!(letter == "$" || letter == ".") ) {
            directories.push({ name: String(Path.join(path+dirent.name)), type: type });
        }

    }

    callback(directories)
}

function DriveList(callback) {

    var drives = []

    exec('wmic logicaldisk get name', (error, stdout, stderr) => {

        list = stdout
            .replace(/Name/g, "")
            .replace(/\r/g, "")
            .replace(/\n/g, "")
            .replace(/ /g, "")
            .trim()
        list = list.split(":")
        
        list.forEach((drive)=> {
            if(drive.length > 0) {
                drives.push({ name: String(Path.join(drive.trim()+":")), type: "directory"})
            }
        })

        callback(drives)
    });
}