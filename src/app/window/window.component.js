/*
 * Author: Lucas Costa
 * Date: May of 2020
 */
(()=> {
    "use stric"

    angular
        .module('obs.overlay')
        .component("window", {
            templateUrl: "app/window/window.html",
            controller: ["$rootScope", "$scope", "$document", "path.service", WindowController],
        })

    function WindowController($rootScope, $scope, $document, $Path) {

        $rootScope.WINDOW = {
            preview: false,
            open: false,
            path: "",
        }

        $scope.control = {
            open: false,
            base: "/Images",
            history: [],
            path: "",
            paths: ""
        }   

        $rootScope.$watch("WINDOW",(WINDOW)=> {
            if(WINDOW !== 'undefined') {
                $scope.control.open = WINDOW.open
                $scope.control.preview = WINDOW.preview     
                $scope.control.path = WINDOW.path
                
                if($scope.control.open){
                    access($scope.control.base+"/") 
                }

            }
        });

        $scope.open = ()=> {
            $scope.toggleWindow() 
            access($scope.control.base+"/")
        }

        $scope.selectFile = (file, $event)=> {
            $scope.toggle($event)
            $scope.control.path = file
        }

        $scope.loadFile = ()=> {
            $scope.toggleWindow()
            $rootScope.WINDOW.path = $scope.control.path 
        }

        $scope.selectDirectory = (directory)=> {
            access(directory+"/")
        }

        $scope.back = ()=> {
            $scope.control.history.splice(-1,1)
            var temp = $scope.control.history.slice(-1)[0]
            $scope.control.history.splice(-1,1)
            
            if (!temp) {
                temp = $scope.control.base
                access("drives")
            } else {
                access(temp)
            }
             
        }

        $scope.toggleWindow = ()=> {
            $scope.control.open = !$scope.control.open
            $rootScope.WINDOW.open = !$rootScope.WINDOW.open
        }

        $scope.toggle = ($event)=> {
            var $element = angular.element($event.target).parent()
            var elements = $document[0].querySelectorAll(".window-list li");
            
            elements.forEach((element)=> {
                angular.element(element).removeClass("active")
            })

            $element.addClass("active")
        }

        $scope.extract = (path)=> {
            
            var file = path.substring(digestPath(path).lastIndexOf('/') + 1)

            var extension = file.substring(file.lastIndexOf('.') + 1)

            return {file: file, extension: extension}
        }

        function digestPath(path = "C:/") {
            return path.replace(/\\/g, "\/")
        }

        function access(pathDir) {

            $Path.list(pathDir).then((response)=> {

                $scope.control.history.push(digestPath(pathDir))
                $scope.control.path = digestPath(pathDir)
                $scope.control.paths = response.data

            })

        }
    
    }
})()