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
        
        //broadcast.on()

        $rootScope.PANEL = {
            update: Update,
        }

        $rootScope.$watch("PANEL", (PANEL)=> {
            console.log("WATCH PANEL (ENVIRONMENT)", PANEL)
        }, true)

        $scope.effectTypes = [ "slide", "fade", "spin"]
        $scope.update = Update
        $scope.collections = storage.load()
        
        $scope.collection = CollectionLoad($scope.collections)
        $scope.control = $scope.collection.control
        
        //broadcast.send("control", $scope.control)
        //$rootScope.PREVIEW = true
        
        console.log("PANEL >>> COLLECTIONS:", $scope.collections)
        console.log("PANEL >>> COLLECTION:", $scope.collection)

        $scope.speed = (action)=> {
            
            if('effect' in $scope.collection) {
                let incrementer = 20
                
                if ("+" == action) {
                    $scope.collection.effect.speed += incrementer
                } else {
                    $scope.collection.effect.speed -= incrementer
                }
                
                Update()
            }
        }

        $scope.effectType = (action)=> {

            if( "effect" in $scope.collection) {

                let index = $scope.effectTypes.indexOf($scope.collection.effect.type)
                let i = 0
                
                if("+" == action ) {
                    i = (index + 1) % $scope.effectTypes.length
                } else {
                    i = (index - 1) % $scope.effectTypes.length
                    if(i < 0 ) {
                        i = ($scope.effectTypes.length - 1)
                    }
                }
                
                $scope.collection.effect.type = $scope.effectTypes[i]
                
                Update()
            }
        }

        $scope.new = ()=> {
            console.log("NEW COLLECTION")
        }

        $scope.select = (lower)=> {

            var active = !lower.active

            unselect()
            
            lower.active = active

            $scope.lower = lower

            $rootScope.SCREEN.lower = $scope.lower
            
            if(lower.active && $scope.control.go) {
                //broadcast.send("lower", lower)
            }

            if(!lower.active && $scope.control.go){
                broadcast.send("lower", null)
                $rootScope.SCREEN.lower = null
                $scope.updade(lower)
            }
            
        }

        $scope.reset = ()=> {
            let reset = confirm("TODAS AS LOWERS SERÃO DELETADAS. \n\nVocê deseja confirmar essa acão?")
            if (reset === true) {
                storage.clear()
            }
        }

        $scope.toggleGo = ()=> {
            $scope.collection.control.onAir = !$scope.collection.control.onAir
            Update()
        }

        function CollectionLoad(collections) {
            if(collections.length > 0) {
                return collections[0]
            }
            return { }
        }

        // Strores the current collection and loads all collections from the database
        function Update (collection = null) {

            console.log("SELECT", $scope.collection)
            
            if(null === collection) {
                storage.add($scope.collection)
                $rootScope.LOWERS.send($scope.collection)
            }
            
            
            $scope.collections = storage.load($scope.collections)

            console.log("UPDATE COLLECTION AND LOAD ALL COLLECTIONS", $scope.collections)
        }
    }

})()