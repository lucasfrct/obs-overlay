/*
 * Autor: Lucas Costa
 * Contact: lucasfrct@gmail.com
 * Data: Maio de de 2020
 */
(()=>{
    "use strict";

    angular
    .module("obs.overlay")
    .component("panel", {
        templateUrl: "app/panel/panel.html",
        controller: [
            "$rootScope",
            "$scope", 
            "storage.service", 
            "broadcast.service", 
            PanelController
        ]
    })
    
    function PanelController($rootScope, $scope, storage, broadcast) {
        
        broadcast.on()
        
        var orientation = { x: 0, y: 0 }
        var element = { ...orientation, size: 10, src: "", type: "", color: "", focused: false, }
        
        
        $rootScope.PANEL = {
            update: Update,
        }
        
        $scope.lower = {            
            active: false,
            title: "",
            scale: { ...element, size: 100 },           // size in 100%
            elements: [],
        }
        
        $scope.control = {
            title: "control-lower",  // congig
            storage: false,
            go: false,
            add: false,
            edit: false,
            window: false,
            effect: { on: 600, type: "slide" },
            path: "",
            subscribe: []
        }

        $scope.lowers = [ ]
        $scope.effects = [ "slide", "fade" ]
        
        $scope.control.window = $rootScope.window
        $rootScope.preview = true
        
        $scope.control.storage = storage.check()
        $scope.lowers = storage.load()
        $scope.control = storage.control($scope.control)
        
        
        broadcast.send("control", $scope.control)

        $rootScope.$watch("window",(value)=> {
            $scope.control.window = $rootScope.window
        });

        $rootScope.$watch("path",(path)=> {
            
            $scope.control.path = path

            if($scope.control.path) {

                $scope.control.subscribe.forEach((callback)=> {
                    callback(path)
                    $scope.control.subscribe = []
                })
                
                console.log("WATCH PATH", path)
            }
        });

        $scope.fade = (action)=> {

            if ("+" == action) {
                $scope.control.effect.on += 20;
            } else {
                $scope.control.effect.on -= 20;
            }

            storage.add($scope.control)
            broadcast.send("control", $scope.control)
        }

        $scope.effectsCtrl = (action)=> {

            var index = $scope.effects.indexOf($scope.control.effect.type);
            var i = (index + 1) % $scope.effects.length;

            $scope.control.effect.type = $scope.effects[i]

            storage.add($scope.control)
            broadcast.send("control", $scope.control)
        }

        $scope.addText = (lower)=> {
            var el = angular.copy(element)
            el.type = "text"
            lower.elements.push(el)
        }

        $scope.addImage = (lower)=> {
            
            $rootScope.window = !$rootScope.window

            $scope.control.subscribe.push((path)=> {
                var el = angular.copy(element)
                el.type = "image"
                el.src = path
                lower.elements.push(el)
            })
        }

        $scope.add = (lower)=> {
            $scope.toggleAdd()
        }

        $scope.removeElement = (lower, elem)=> {
            var index = lower.elements.indexOf(elem)
            lower.elements.splice(index, 1)
        }

        $scope.save = (lower)=> {
            $scope.toggleAdd()
            storage.add(lower)
            $scope.lowers = storage.load()
        }

        $scope.cancel = (lower)=> {
            $scope.lower.title = ""
            $scope.lower.elements = []
            $scope.toggleAdd()
        }

        $scope.storage = (lower)=> {
            $scope.toggleEdit()
            storage.add(lower)
            $scope.lowers = storage.load()
        }

        $scope.updade = Update

        $scope.edit = (lower)=> {
            $scope.toggleEdit()
        }

        $scope.remove = (lower)=> {
            $scope.toggleEdit()
            storage.remove(lower)
            $scope.lowers = storage.load()
        }

        $scope.select = (lower)=> {

            var active = !lower.active

            unselect()
            
            lower.active = active

            $scope.lower = lower
            $rootScope.SCREEN.lower = $scope.lower
            //$rootScope.$apply()
            
            if(lower.active && $scope.control.go) {
                broadcast.send("lower", lower)
            }

            if(!lower.active && $scope.control.go){
                broadcast.send("lower", null)
                $scope.updade(lower)
            }
            
        }

        $scope.reset = ()=> {
            var reset = confirm("TODAS AS LOWERS SERÃO DELETADAS. \n\nVocê deseja confirmar essa acão?")
            if (reset === true) {
                storage.clear()
            }
        }

        $scope.toggleAdd = ()=> {
            $scope.control.add = !$scope.control.add
        }

        $scope.toggleEdit = ()=> {
            $scope.control.edit = !$scope.control.edit
        }

        $scope.toggleGo = ()=> {
            $scope.control.go = !$scope.control.go
        }

        function Update (lower) {
            storage.add(lower)
            storage.add($scope.control)
            $scope.lowers = storage.load()
        }

        function  unselect() {
            $scope.lowers = $scope.lowers.map((lower)=> {
                lower.active = false;
                $scope.updade(lower)
                return lower
            })
        }







        $scope.upImage = (lower)=> {
            lower.image.size += 1
            $scope.updade(lower)
        }

        $scope.downImage = (lower)=> {
            lower.image.size -= 1
            $scope.updade(lower)
        }

        $scope.upText = (lower)=> {
            lower.text.size += 0.5
            $scope.updade(lower)
        }

        $scope.downText = (lower)=> {
            lower.text.size -= 0.5
            $scope.updade(lower)
        }

        
        function  unfocused() {
            $scope.control.select.elements = $scope.control.select.elements.map((element)=> {
                element.focused = false;
                $scope.updade($scope.control.select)
                return element
            })
        }

    }

})()