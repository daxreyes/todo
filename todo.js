Projects = new Meteor.Collection("Projects");
Tasks = new Meteor.Collection("Tasks");

if (Meteor.isClient) {

    ngMeteor.controller('TodoCtrl', ['$scope', '$collection', '$ionicModal', '$rootScope',
        function ($scope, $collection, $ionicModal, $rootScope) {

            // Load or initialize projects
            $collection("Projects", $scope);
            $collection("Tasks", $scope);

            // A utility function for creating a new project
            // with the given projectTitle
            var createProject = function (projectTitle) {
                var newProject = {
                    title: projectTitle,
                    active: false
                };
                $scope.Projects.add(newProject);
                $scope.selectProject(newProject, $scope.Projects.length - 1);
            }

            // Called to create a new project
            $scope.newProject = function () {
                var projectTitle = prompt('Project name');
                if (projectTitle) {
                    createProject(projectTitle);
                }
            };

            // Grab the last active, or the first project
            $scope.activeProject = function () {
                var activeProject = $scope.Projects[0];
                angular.forEach($scope.Projects, function (v, k) {
                    if (v.active) {
                        activeProject = v;
                    }
                });
                return activeProject;
            }

            // Called to select the given project
            $scope.selectProject = function (project, index) {
                var selectedProject = $scope.Projects[index];
                angular.forEach($scope.Projects, function (v, k) {
                    v.active = false;
                });
                selectedProject.active = true;
                $scope.Projects.add($scope.Projects);
                $scope.sideMenuController.close();
            };

            // Create our modal
            $ionicModal.fromTemplateUrl('new-task', function (modal) {
                $scope.taskModal = modal;
            }, {
                scope: $scope
            });

            $scope.createTask = function (task) {
                var activeProject = $scope.activeProject();
                if (!activeProject || !task) {
                    return;
                }

                $scope.Tasks.add({
                    project: activeProject._id,
                    title: task.title
                });

                $scope.taskModal.hide();

                task.title = "";
            };

            $scope.deleteTask = function (task) {
                $scope.Tasks.delete(task);
            }

            $scope.newTask = function () {
                $scope.taskModal.show();
            };

            $scope.closeNewTask = function () {
                $scope.taskModal.hide();
            }

            $scope.toggleProjects = function () {
                $scope.sideMenuController.toggleLeft();
            };

            // Try to create the first project, make sure to defer
            // this by using $timeout so everything is initialized
            // properly   
            $scope.Projects.ready(function () {
                if ($scope.Projects.length == 0) {
                    while (true) {
                        var projectTitle = prompt('Your first project title:');
                        if (projectTitle) {
                            createProject(projectTitle);
                            break;
                        }
                    }
                }
            });

        }

    ]);

}

if (Meteor.isServer) {

    Meteor.publish('Projects', function () {
        return Projects.find({});
    });

    Meteor.publish('Tasks', function () {
        return Tasks.find({});
    });

    Projects.allow({
        insert: function () {
            return true;
        },
        update: function () {
            return true;
        },
        remove: function () {
            return true;
        }
    });

    Tasks.allow({
        insert: function () {
            return true;
        },
        update: function () {
            return true;
        },
        remove: function () {
            return true;
        }
    });

}
