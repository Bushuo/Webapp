var budgetController = (function() {

}());


var uiController = (function() {
	
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: 'add__description',
        inputValue: '.add__value',
        inputBtn: 'add__btn'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        
        }

        getDOMstrings: function() {
            return DOMstrings;
        }
    };
}());


var  appController = (function(budgetCtrl, uiCtrl) {

    var ctrlAddItem = function() {
        // 1. Get input data
        var input = uiCtrl.getInput();
        console.log(input);

        // 2. Add the item to the budget controller
        

        // 3. Add the new item to the UI

        // 4. Calc the budget

        // 5. Display the budget on the UI
    };

    document.querySelector(".add__btn").addEventListener("click", function() {
        ctrlAddItem();
    });

    document.addEventListener("keypress", function(event) {
        if(event.keyCode === 13) {
            ctrlAddItem();
	}
	
    });
}(budgetController, uiController));
