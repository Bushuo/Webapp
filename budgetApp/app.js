var budgetController = (function() {
    var Expense = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id,description,value) {
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

}());


var uiController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: 'add__description',
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
        // 1. Get input data
        var input = uiCtrl.getInput();

        // 2. Add the item to the budget controller

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
