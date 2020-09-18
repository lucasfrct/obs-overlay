/*
 * Autor: Lucas Costa
 * Contact: lucasfrct@gmail.com
 * Data: Julho de de 2020
 */
(()=> {
    "use strict";

    angular
        .module("obs.overlay")
        .service("storage.service", [StorageService])

    function StorageService() {
        var that = this
        
        that.check = ()=> {
            var check = false 

            if (typeof(Storage) !== "undefined") {
                check = true
            } else {
                check = false
                alert("No suport Storage")
            }

            return check;
        }

        that.collection = (param = null)=> {
            
            if(null !== param && typeof param == "string") {
                // LOAD/READ ONLY ONE COLLECTION
                return that.read(param)
            }

            if(null !== param && typeof param == "object") {
                // SAVE/ INSERT COLLECTION
                that.add(param)
            }

            if(null == param) {
                // LOAD/READ ALL COLLECtIONS
                that.load()
            }

        }

        that.read = (collection)=> {
            return JSON.parse(window.localStorage.getItem(collection.title))
        }

        that.add = (collection)=> {
            if(collection.title !== undefined) {
                window.localStorage.setItem(collection.title, JSON.stringify(collection))
            }
        }

        that.remove = (collection)=> {
            window.localStorage.removeItem(collection.title)
        }

        that.load = (collections = [])=> {
            var load = []
            var obj = Object.keys(localStorage).reduce((obj, title) => {
                var lower = JSON.parse(localStorage.getItem(title))
                if(lower.title !== undefined) {
                    load.push(lower)
                }
                return lower
            }, [])
            return (load.length > 0 ) ? load : collections
        }

        that.clear = ()=> {
            window.localStorage.clear()
            console.log("ERASE DATABSE")
            alert("Erase Database!!!")
        }
    }

})()