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

        $rootScope.PANEL = {
            update: Update,
            lower: Lower,
        }

        $rootScope.$watch("PANEL", (PANEL)=> {
            console.log("WATCH PANEL (ENVIRONMENT)", PANEL)
        }, true)

        $scope.effectTypes = [ "slide", "fade", "spin"]
        $scope.update = Update
        $scope.collections = storage.load()
        $scope.collection = CollectionLoad()
        
        $scope.newcollection = new Collection
        $scope.modalCollection = false
        $scope.modeEdit = false
        $scope.title = ""
        
        broadcast.send("control", $scope.collection.control)
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
                
                Update($scope.collection)
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
                
                Update($scope.collection)
            }
        }
        
        $scope.new = ()=> {
            $scope.toggleModalCollection()
            console.log("NEW", $scope.modeEdit)
            $scope.newcollection = new Collection
            $scope.title = ""
        }
        
        $scope.save = (title)=> {
            $scope.toggleModalCollection()

            if($scope.modeEdit) {
                $scope.modeEdit = false
                if(storage.remove($scope.collection)) {
                    $scope.collection.title = title
                    Update($scope.collection)
                }
            } else {
                let collection = new Collection
                collection.title = title
                $scope.collection = collection
                Update($scope.collection)
            }
            console.log("SAVE COLLECTION", $scope.collection)
        }

        $scope.cancel = (title)=> {
            $scope.toggleModalCollection()
            $scope.modeEdit = false
            console.log("CANCEL COLLECTION->TITLE: ", title)
        }

        $scope.edit = (collection)=> {
            $scope.toggleModalCollection()
            $scope.modeEdit = true
            $scope.title = collection.title
        }

        $scope.delete = (title)=> {
            $scope.toggleModalCollection()
            if($scope.modeEdit) {
                $scope.modeEdit = false
                if(storage.remove($scope.collection)) {
                    $scope.collection = null
                    Update()    
                    console.log("DELETE")
                }
            }
        }

        $scope.toggleModalCollection = ()=> {
            $scope.modalCollection = !$scope.modalCollection
        }

        $scope.select = (lower)=> {

            //$rootScope.SCREEN.lower = $scope.lower
            
            if(lower.active && $scope.control.go) {
                //broadcast.send("lower", lower)
            }

            if(!lower.active && $scope.control.go){
                //broadcast.send("lower", null)
                //$rootScope.SCREEN.lower = null
                //$scope.updade(lower)
            }
        }

        $scope.reset = ()=> {
            let reset = confirm("All Lower Thirds will be deleted. \n\nDo you want to confim this action?")
            if (reset === true) {
                storage.clear()
            }
        }

        $scope.toggleGo = ()=> {
            if ($scope.collection.control !== undefined) {
                $scope.collection.control.onAir = !$scope.collection.control.onAir
                Update($scope.collection)
            }
        }

        function CollectionLoad(collection = null) {
            if(null == collection && $scope.collections.length > 0) {
                return $scope.collections[0]
            }
            if (null !== collection && $scope.collections.length > 0) {
                return $scope.collections.find((coll)=>{
                    return (coll.title == collection.title)
                })
            } 
            return { }
        }

        // Stores the current collection, sends it to Lower thids and loads all collections from the database
        function Update (collection = null) {

            if(null !== collection) {
                storage.add(collection)
                $scope.collections = storage.load()
                $scope.collection = CollectionLoad(collection) 
            } else {
                $scope.collections = storage.load()
                if($scope.collection) {
                    $scope.collection = CollectionLoad($scope.collection)  
                } else {
                    $scope.collection = CollectionLoad()
                }
            }
                        
            $rootScope.LOWERS.send($scope.collection)
            broadcast.send("control", $scope.collection.control)

            console.log("UPDATE COLLECTION ", $scope.collection)
            console.log("UPDATE AND LOAD ALL COLLECTIONS", $scope.collections)
        }

        function Lower(lower) {
            console.log("PANEL LOWER", lower)
        }
    }

})()