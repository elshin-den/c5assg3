(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com/menu_items.json')
        .directive('foundItems', FoundItems);

    function FoundItems() {
        var ddo = {
            templateUrl: 'list.html',
            restrict: 'A',
            scope: {
                found: '<foundItems',
                onRemove: '&'
            },
            transclude: true
        };
        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var list = this;
        list.found = [];
        list.search_was_launched = false;

        list.matchMenuItems = function () {
            var promise = MenuSearchService.getMatchedMenuItems(list.searchTerm);
            promise.then(function (foundItems) {
                list.found = foundItems;
                list.search_was_launched = true;
            });
        };

        list.removeItem = function (itemIndex) {
            list.found.splice(itemIndex, 1);
        }
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            var response = $http({
                method: "GET",
                url: ApiBasePath
            }).then(function (result) {
                var foundItems = [];
                if (searchTerm == '') {
                    return foundItems;
                }
                var menu_items = result.data['menu_items'];
                for (var i = 0; i < menu_items.length; i++) {
                    if (menu_items[i].description.indexOf(searchTerm) !== -1) {
                        foundItems.push(menu_items[i])
                    }
                }
                return foundItems;
            })
            .catch(function (error) {
              console.log(error);
                return [];
            });

            return response;
        }
    }

})();