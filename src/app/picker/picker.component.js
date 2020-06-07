/*
 * Author: Lucas Costa
 * Date: May of 2020
 */
(()=> {
    "use stric"

    angular
        .module("obs.overlay")
        .component("picker", {
            templateUrl: "app/picker/picker.html",
            controller: ["$rootScope", "$scope", "$interval", PickerController],
        })
        .run(()=> {
            CreateLink("app/picker/classic.min.css")
            CreateScript("app/picker/pickr.min.js")
        })

    function CreateScript(src) {
        var script = create('script')
        script.src = src
        insert('head',script);
    }

    function CreateLink(href) {
        var link = create('link')
        link.rel = 'stylesheet'
        link.href = href
        insert('head', link);
    }

    function create(element) {
        return document.createElement(element)
    }

    function insert(tag, element) {
        angular.element(document.getElementsByTagName(tag)).append(element);
    }
        
    function PickerController($rootScope, $scope, $interval) {

        $rootScope.PICKER = {
            color: "#FFFFFFFF",
            swatches: [
                'rgba(0, 0, 0, 1)',
                'rgba(245, 245, 245, 1)',
                'rgba(255, 0, 0, 1)',
            ],
        }

        $rootScope.$watch('PICKER', (PICKER)=> {
            console.log("PICKER (ENVIRONMENT)", PICKER)
        }, true)

        $scope.Pickr = null

        var load = $interval(()=> {
            if (typeof Pickr !== 'undefined' && $rootScope.PICKER.swatches) {
                Factory(".color-picker", $rootScope.PICKER.color, $rootScope.PICKER.swatches)
                $interval.cancel(load)
            }
        }, 10)


        function Factory(element, color, swatches) {
            
            $scope.Pickr = new Pickr({
                el: element,
                theme: 'classic',
                default: color,
                swatches: swatches,
                components: {
                    preview: true,
                    opacity: true,
                    hue: true,
                    interaction: {
                        save: false,
                        clear: false,
                        hsva: false,
                        hsla: false,
                        cmyk: false,
                        rgba: true,
                        hex: true,
                        input: true,
                    }
                }
            })

            $scope.Pickr.on('changestop', (instance) => {
                
                $scope.Pickr.applyColor(instance._color.toRGBA().toString())
                
                $rootScope.PICKER.color = instance._color.toRGBA().toString()
                $rootScope.$apply()

            })
            
            $scope.Pickr.on('swatchselect', (color, instance) => {
        
                $scope.Pickr.applyColor(color.toRGBA().toString())
                
                $rootScope.PICKER.color = color.toRGBA().toString()
                $rootScope.$apply()
            })
            
            $scope.Pickr.on('hide', (instance) => {
                
                var color = instance._color.toRGBA().toString()
                var index = $rootScope.PICKER.swatches.indexOf(color)
                
                if(index == -1) {
                    $scope.Pickr.addSwatch(color)
                    $rootScope.PICKER.swatches.push(color)
                    $rootScope.$apply()
                }
            })
        }
       
    }
    

})()