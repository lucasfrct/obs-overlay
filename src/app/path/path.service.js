/*
 * Author: Lucas Costa
 * Date: May of 2020
 */
(()=> {
    "use strict"

    angular
        .module("obs.overlay")
        .service("path.service", ["$window", "$http", PathSerice])
        
    function PathSerice($window, $http) {
        var that = this

        that.drop = (callback)=> {
            
            var files = []

            $window.addEventListener('drop', (event)=> {
                event.preventDefault()
                event.stopPropagation()

                for(const f of event.dataTransfer.files) {
                    files.push(f.path)
                }

                callback(files)
            })

            $window.addEventListener("dragover", (event)=> {
                event.preventDefault();
                event.stopPropagation();
            })

            return files
        }

        that.read = (target, callback)=> {
            target.addEventListener("change", (event)=> {
                callback(target.files[0].path)
            }, false)
        }

        that.list = (path)=> {
            return $http({method: "GET", url: "/directory",  params: {path: path}})
        }

    }

})()