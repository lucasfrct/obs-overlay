/*
 * Autor: Lucas Costa
 * Contact: lucasfrct@gmail.com
 * Data: Maio de de 2020
 */
(()=>{
    "use strict";

    angular
        .module("obs.overlay")
        .service("storage.service", [PanelService])

    function PanelService() {
        var that = this
        
        that.ctrl = null

        this.control = (control)=> {
            return (that.ctrl == null) ? control : that.ctrl
        }

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

        that.add = (lower)=> {
            if (typeof lower.title != undefined && lower.title.length > 1) {
                window.localStorage.setItem(lower.title, JSON.stringify(angular.copy(lower)));
                //console.log("ADD/UPDATE", lower)
            }
        }

        that.remove = (lower)=> {
            window.localStorage.removeItem(lower.title);
            //console.log("REMOVE", lower)
        }

        that.load = ()=> {
            var load = []
            var obj = Object.keys(localStorage).reduce((obj, title) => {
                
                var lower = JSON.parse(localStorage.getItem(title))
                
                if(lower.title == "control-lower") {
                    //console.log("LOAD CONTROLS: ", lower)
                    that.ctrl = lower
                } else {
                    load.push(lower)
                }

                return lower

            }, []);

            //console.log("LOAD LOWERS", load)
            return load
        }

        that.clear = ()=> {
            window.localStorage.clear()
            console.log("ERASE")
            alert("Erase!")
        }
    }

})()