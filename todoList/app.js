var taskController = (function() {
    var Task = function(id, description) {
        this.id = id;
        this.description = description;
    }
    
    var data = {
        allTasks: [],
        openTasks: [],
        completedTasks: []
    };
    return {
        addTask: function(des) {
            var newTask, ID;
            
            if(data.allTasks.length > 0) {
                ID = data.allTasks[data.allTasks.length-1].id + 1;
            } else {
                ID = 0;
            }

            newTask = new Task(ID, des);
            data.allTasks.push(newTask);
            data.openTasks.push(newTask);
            return newTask;
        },
        testData: function() {
            return data.allTasks;
        },
        getOpenTaskCount: function() {
            return data.openTasks.length;
        }
    }
})();

var uiController = (function () {
    var DOMstrings = {
        inputBtn: '.add__btn',
        inputDescription: '.add__description',
        taskContainer: '.tasks__container',
        taskCount: '.tasks__number',
        taskText: '.tasks__literal'
    };
    return{
        updateTaskCount: function(count) {
            let text = " tasks";
            document.querySelector(DOMstrings.taskCount).innerHTML = ""+count;
            if(count == 1) {
                text = " task";
            }
            document.querySelector(DOMstrings.taskText).innerHTML = text;
        }
        ,addListTask: function(obj) {
            var html, newHtml, pivotElement;
            pivotElement = DOMstrings.taskContainer;
            // html string with placeholder text marked by %%
            html = '<div class="item"><div class="item__description">%description%</div><div class="item__controls"><button class="item__complete--btn"><i class="ion-ios-checkmark-outline"></i></button><button class="item__boulder--btn"><i class="ion-ios-star-outline"></i></button><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            newHtml = html.replace("%description%", obj.description);
            // insert html string to DOM
            document.querySelector(pivotElement).insertAdjacentHTML('beforeend', newHtml);
        },
        resetInput: function() {
            document.querySelector(DOMstrings.inputDescription).value = "";
        },
        getInput: function() {
            return{
                description: document.querySelector(DOMstrings.inputDescription).value
            }
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();

var appController = (function(taskCtrl, uiCtrl) {
    var setupEventListeners = function() {
        var DOM = uiCtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener("click", function() {
            addTaskItem();
        });
        document.addEventListener("keypress", function(event) {
            if(event.keyCode === 13) {
                addTaskItem();
            }
        });
    };

    var setTaskCount = function() {
        let count = taskCtrl.getOpenTaskCount();
        uiCtrl.updateTaskCount(count);
    };

    var addTaskItem = function() {
        var input, newItem;
        // get input data
        input = uiCtrl.getInput();
        if(input.description != "") {
            // add task to internal data
            newItem = taskCtrl.addTask(input.description);
            // add task to UI
            uiCtrl.addListTask(newItem);
            // reset input
            uiCtrl.resetInput();
            // update task count
            setTaskCount();
        }
    }

    return {
        init: function() {
            console.log("app started");
            setupEventListeners();
            setTaskCount();
        }
    };
})(taskController, uiController);

appController.init();