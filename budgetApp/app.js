// BUDGET CONTROLLER

// immediatly invoked function expression = iife
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
		this.value = value;
		this.percentage = -1;
	};
	
	// add this to the prototype so that it gets inherited
	Expense.prototype.calcPercentage = function(totalIncome) {
		if(totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	}

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    // PUBLIC
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
		
		calculatePercentages: function() {
			// calculate expense percentage for each expense object in the array
			/* sample
				a = 20
				b = 10
				c = 40
				total income = 100

				a = 20/100 = 20%
				b = 10/100 = 10%
				c = 40/100 = 40%
				total expense = 70%
			*/
			data.allItems.exp.forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function() {
			var allPercentages = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			return allPercentages;
		},

        calculateBudget: function() {
            // 1. total incomes and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // 2. calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // 3. calculate the percentage that was spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        deleteItem: function(type, id) {
			var ids, index;
			// map takes callback and creates new array with the returned values
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
			index = ids.indexOf(id);
			
            if (index === -1) {
                return;
            }
            data.allItems[type].splice(index, 1); // removes 1 at index position
        },

        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },

        testing: function() {
            console.log(data);
        }
    }
}()); // invokes the fuction


// UI CONTROLLER

var uiController = (function() {

    // place to store the DOM class names
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month',
	};
	
	var formatNumber = function(number, type) {
		var numSplit, int, dec;
		/* 
			+ or - before the number
			exaclty 2 decimal values
			space seperating the thousands

			2310.45123 -> + 2 310.45
		*/

		number = Math.abs(number);
		number = number.toFixed(2); // adds 2 fixed decimal values
		numSplit = number.split('.');
		int = numSplit[0];
		dec = numSplit[1];
		if(int.length > 3) {
			int = int.substr(0, int.length-3) + ' ' + int.substr(int.length-3, 3);
		}

		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
	}

	var nodeListForEach = function(list, callback) {
		for(var i = 0; i < list.length; i++) {
			callback(list[i], i);
		}
	};

    // PUBLIC
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === "exp")
            {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // replace the placeholder text with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
            newHtml = newHtml.replace("%description%", obj.description);
            // insert html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
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

        displayBudget: function(obj) {
			var type;
			obj.budget >= 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
		},

		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

			

			nodeListForEach(fields, function(cur, index){
				if(percentages[index] > 0) {
					cur.textContent = percentages[index] + '%';
				} else {
					cur.textContent = "---";
				}

			});
		},

		displayDate: function() {
			var now, year, month, months;
			
			now = new Date();

			month = now.getMonth();
			months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

			year = now.getFullYear();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

		},

		changedType: function() {
			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDescription + ',' +
				DOMstrings.inputValue
			);

			nodeListForEach(fields, function(cur) {
				cur.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

		},

        getDOMstrings: function() {
            return DOMstrings;
        }
    };
}());

// APP CONTROLLER

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

        document.querySelector(DOM.container).addEventListener("click", function(event) {
            ctrlDeleteItem(event);
		});
		
		document.querySelector(DOM.inputType).addEventListener("change", uiCtrl.changedType);
	};
	
	var updatePercentages = function() {
		
		// calculate percentages
		budgetCtrl.calculatePercentages();

		// read them from budgetcontroller
		var percentages = budgetCtrl.getPercentages();

		// update ui
		uiCtrl.displayPercentages(percentages);

	};

    var updateBudget = function() {
        var budget;

        // Calc the budget
        budgetCtrl.calculateBudget();

        // Return the budget
        budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        uiCtrl.displayBudget(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;

        // Get input data
        input = uiCtrl.getInput();

        if(input.description != "" && !isNaN(input.value) && input.value > 0) {
            // add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add the new item to the ui
            uiCtrl.addListItem(newItem, input.type);

            // reset input flieds
            uiCtrl.clearFieldsAndResetFocus();

            // calculate and update budget
			updateBudget();
			
			// calculate and update percentages
			updatePercentages();
        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
			// inc-1
			// create array from string that is split on the character provided
            splitID = itemID.split('-'); 
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete item from datastructe
            budgetCtrl.deleteItem(type, ID);

			// delete item from UI
			uiCtrl.deleteListItem(itemID);

			// update and show new budget
			updateBudget();

			// calculate and update percentages
			updatePercentages();
        }
    };


    // PUBLIC
    return {
        init: function() {
            console.log('App has started');
			setupEventListeners();
			uiCtrl.displayDate();
            uiCtrl.displayBudget({
                budget:0,
                percentage:-1,
                totalInc:0,
                totalExp:0
            });
        }
    };
}(budgetController, uiController));

appController.init();
