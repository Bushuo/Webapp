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
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // convert to number
            };
        
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // create string with placeholder text
            if (type === "inc") 
            {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === "exp") 
            {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // replace the placeholder text with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%value%", obj.value);
            newHtml = newHtml.replace("%description%", obj.description);
            // insert html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFieldsAndResetFocus: function() {
            var fields, fieldsArray;

            // select the fields to clear
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // borrow array.slice metod to call on list
            fieldsArray = Array.prototype.slice.call(fields);

            // clear selected fields
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            }); 

            //reset focus
            fieldsArray[0].focus();
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

    var updateBudget = function() {
        // 1. Calc the budget
        
        // 2. Return the budget
        // 3. Display the budget on the UI
        
    }
    
    var ctrlAddItem = function() { var input, newItem;

        // 1. Get input data
        input = uiCtrl.getInput();

        if(input.description != "" && !isNaN(input.value) && input.value > 0) {
            // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            
            // 3. add the new item to the ui
            uiCtrl.addListItem(newItem, input.type);

            // 4. reset input flieds
            uiCtrl.clearFieldsAndResetFocus();
            
            // 5. calculate and update budget
            updateBudget();
        }
    };
    
    return {
        init: function() {
            console.log('App has started');
            setupEventListeners();
        }
    };
}(budgetController, uiController));

appController.init();
