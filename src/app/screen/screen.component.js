/*
 * Author: Lucas Costa
 * Date: May of 2020
 */
(()=> {
    "use stric"

    angular
        .module("obs.overlay")
        .component('screen', {
            templateUrl: "app/screen/screen.html",
            controller: ["$rootScope","$scope", ScreenController]
        })

    function ScreenController($rootScope, $scope) {

        var orientation = { x: 0, y: 0 }
        var element = { ...orientation, size: 10, src: "", type: "", color: "", focused: false, }

        $rootScope.SCREEN = {
            preview: false,
            lower: { },
        }

        $rootScope.$watch("SCREEN", (SCREEN)=> {

            console.log("SCREEN (EMNIRONMENT): ", SCREEN)

            if(typeof SCREEN.lower != "undefined" && SCREEN.lower.elements) {
                $scope.lower = SCREEN.lower
            }

            if(typeof SCREEN.preview != "undefined" && SCREEN.preview) {
                $scope.control.preview = SCREEN.preview
            }

        }, true)

        $rootScope.$watch("PICKER", (PICKER)=> {

            console.log("PICKER (ENVIRONMENT): ", PICKER)
            
            if (typeof PICKER !== "undefined" && PICKER.color) {
                $scope.control.element.color = PICKER.color
                $rootScope.PANEL.update(unfocused($scope.lower))
            }

        }, true)

        $scope.control = {
            preview: false,
            element: angular.copy(element),
        }
        
        $scope.lower = {            
            active: false,
            title: "",
            scale: { ...element, size: 100 }, 
            elements: [],
        }
        
        $scope.changeLayer = (element)=> {
            
            var index = $scope.lower.elements.indexOf(element)
            var num = $scope.lower.elements.length
            
            if((index + 1) < num) {
                $scope.lower.elements.splice(index, 0, $scope.lower.elements.splice((index + 1), 1)[0]);
            }
        }

        $scope.focused = (element)=> {

            var state = element.focused

            $scope.lower.elements.forEach((el)=> {
                el.focused = false
            })
            
            element.focused = !state
            $scope.control.element = element

            $rootScope.PICKER.color = $scope.control.element.color
        }

        $scope.update = (element)=> {
            $rootScope.PANEL.update(unfocused($scope.lower))
        }

        $scope.dimension = (action)=> {

            if ("+" == action ) {
                $scope.control.element.size += 1;
            } else {
                $scope.control.element.size -= 1;
            }

            if($scope.control.element.size > 100 ) {
                $scope.control.element.size = 100
            }

            if($scope.control.element.size < 0) {
                $scope.control.element.size = 0
            }

            $rootScope.PANEL.update(unfocused(angular.copy($scope.lower)))
        }

        function unfocused(lower) {
            lower.elements.forEach((el)=> {
                el.focused = false
            })

            return lower
        }

    }
    
})()