angular.module('Teamapp').controller('dashboardCtrl', function ($scope, DashboardService, Socket) {
    $scope.today = new Date();
    $scope.timeline = [];

    DashboardService.getTimeline()
        .success(function (response) {
            $scope.unshiftTimeline(response);
        });

    $scope.unshiftTimeline = function (data) {
        _.each(data, function (item, i) {
            $scope.timeline.unshift(item);
        });
    }
    Socket.on('nueva:accion', function (data) {
        $scope.unshiftTimeline(data);
    });
});