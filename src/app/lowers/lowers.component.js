/*
 * Autor: Lucas Costa
 * Contact: lucasfrct@gmail.com
 * Data: September 2020
 */
(()=>{
    "use strict";

    angular
        .module("obs.overlay")
        .component("lowers", {
            templateUrl: "app/lowers/lowers.html",
            controller: ["$rootScope", "$scope", "storage.service", LowerComponent]
        })

    function LowerComponent($rootScope, $scope, storage) {
        
        $rootScope.LOWERS = {
            send: Update
        }

        $rootScope.$watch("LOWERS", (LOWERS)=> {
            console.log("WATCH LOWERS (ENVIRONMENT)", LOWERS)
        }, true)

        $scope.collection = { }
        $scope.lower = new Lower
        $scope.modeEdit = false

        $scope.new = ()=> {
            if(!$scope.modeEdit) { $scope.lower = new Lower }
            $scope.toggleNew()
        }

        $scope.toggleNew = ()=> {
            $scope.collection.control.open = !$scope.collection.control.open
        }

        $scope.removeElement = (lower, elem)=> {
            lower.elements.splice(lower.elements.indexOf(elem), 1)
        }

        $scope.addText = (lower)=> {
            var element = angular.copy(lower.element)
            element.type = "text"
            lower.elements.push(element)
        }

        $scope.addImage = (lower)=> {
            
            /*$rootScope.WINDOW.open()
            
            $scope.collection.control.update.subscribe.push((path)=> {
                
                var element = angular.copy(lower.element)
                element.type = "image"
                element.src = path
                lower.elements.push(element)
                
            })*/

            console.log("ADD IMAGE", lower)
        }

        $scope.save = (lower)=> {
            
            if($scope.modeEdit) {
                $scope.toggleNew()
                storage.add($scope.collection)
                $scope.modeEdit = false
            } else {  
                let result = $scope.collection.lowers.find( lo => lo.title === lower.title)
                
                if((typeof result == "undefined")) {
                    $scope.toggleNew()
                    $scope.collection.lowers.push(lower)
                    storage.add($scope.collection)
                } else {
                    alert("This title already exists.\n Type another title")
                }  
            } 
            
            $rootScope.PANEL.update($scope.collection)
            console.log("SAVE LOWERS", $scope.collection.lowers)
        }

        $scope.cancel = (lower)=> {
            $scope.toggleNew()
            $scope.modeEdit = false
        }

        $scope.delete = (lower)=> {
            $scope.toggleNew()
            let index = $scope.collection.lowers.indexOf(lower)
            $scope.collection.lowers.splice(index, 1)
            storage.add($scope.collection)
            $scope.modeEdit = false
        }

        $scope.edit = (lower)=> {
            $scope.toggleNew()
            $scope.modeEdit  = true
            $scope.lower = lower
        }

        function Update(collection) {
            $scope.collection = collection
        }
    }
    
})()