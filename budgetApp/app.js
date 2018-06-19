var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            // get last element of array and increase the id by one for new item
            if (data.allItems[type].length > 0 ) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // create new item based on type
            if(type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }
            
            // push it to specific type array
            data.allItems[type].push(newItem);
            return newItem;
        },
        testing: function() {
            console.log(data);
        }
    }
}());


var uiController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };
}());


var  appController = (function(budgetCtrl, uiCtrl) {
    
    var setupEventListeners = function() {
        var DOM = uiCtrl.getDOMstrings();    
        document.querySelector(DOM.inputBtn).addEventListener("click", function() {
            ctrlAddItem();
        });

        document.addEventListener("keypress", function(event) {
            if(event.keyCode === 13) {
                ctrlAddItem();
	        }
        });
    };

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get input data
        input = uiCtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add the new item to the UI

        // 4. Calc the budget

        // 5. Display the budget on the UI
    };
    
    return {
        init: function() {
            console.log('App has started');
            setupEventListeners();
        }
    };
}(budgetController, uiController));

appController.init();
