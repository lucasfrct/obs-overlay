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
            
            // LOAD/READ ONLY ONE COLLECTION
            if(null !== param && typeof param == "string") {
                return that.read({ title: param })
            }

            // SAVE/INSERT COLLECTION
            if(null !== param && typeof param == "object") {
                return that.add(param)
            }

            // LOAD/READ ALL COLLECTIONS
            if(null == param) {
                return that.load()
            }

        }

        that.read = (collection = { title: ''})=> {
            return JSON.parse(window.localStorage.getItem(collection.title))
        }

        that.add = (collection = null)=> {
            if(collection.title !== undefined) {
                window.localStorage.setItem(collection.title, JSON.stringify(collection))
                return true
            }
            return false
        }

        that.remove = (collection = null)=> {
            if(collection.title !== undefined) {
                window.localStorage.removeItem(collection.title)
                return true
            }
            return false
        }

        that.load = (collections = [])=> {
            var load = []
            var obj = Object.keys(localStorage).reduce((obj, title) => {
                let lower = JSON.parse(localStorage.getItem(title))
                
                if(lower.title == "") {
                    that.remove(lower)
                }

                if(lower.title !== undefined) {
                    load.push(lower)
                }
                return lower
            }, [])
            return (load.length > 0 ) ? load: collections
        }

        that.clear = ()=> {
            window.localStorage.clear()
            console.log("ERASE DATABSE")
            alert("Erase Database!!!")
            return true
        }
    }

})()