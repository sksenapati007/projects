// Using MVC model


//Benefits whatever in IIFE return block are publicly available and rest are private (Data Encapsulation)
var AmountCalculation = (function () {

    //Functional Constructor to create 2 as many objects of Deposit & Withdraw
    var Withdraw = function (id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
    };

    var Deposit = function (id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
    };


    var sum = 0;
    var totalSum = function (option) {
        console.log("option " + option)
        console.log(rowData.items[option])

        if (option === "withdraws") {
            rowData.items[option].forEach(function (curr, index) {
                console.log("Current Value array " + curr.amount)
                if ((index === rowData.items[option].length - 1)) {
                    sum = sum - curr.amount;
                    // rowData.total.option -= sum;
                }
            });
            console.log("Sum : " + sum)
            rowData.total.option = sum
            console.log("TotalSum-W : " + rowData.total.option)
            console.log("rowdata-total-option : " + rowData.total.option)
        } else if (option === "deposits") {
            rowData.items[option].forEach(function (curr, index) {
                console.log("Current Value array " + curr.amount)
                if ((index === rowData.items[option].length - 1)) {
                    sum = sum + curr.amount;
                    rowData.total.option += sum;
                }
            });
            console.log("Sum : " + sum)
            rowData.total.option = sum
            console.log("TotalSum-D : " + rowData.total.option)
            console.log("rowdata-total-option : " + rowData.total.option)
        }
    };


    var rowData = {
        items: {
            withdraws: [],
            deposits: []
        },
        total: {
            withdraws: 0,
            deposits: 0
        },
        avl_balance: 0
    };

    return {
        addrow: function (option, desc, amnt) {
            var newRow, rowNumber;

            //Length greater than 0 then update the Row Number else Row Number 0
            if (rowData.items[option].length > 0) {
                rowNumber = rowData.items[option][rowData.items[option].length - 1].id + 1;
            } else {
                rowNumber = 0;
            }

            //Create Object based on choice in DropDown
            if (option === "deposits") {
                newRow = new Deposit(rowNumber, desc, amnt);
            } else if (option === "withdraws") {
                newRow = new Withdraw(rowNumber, desc, amnt);
            }

            //Pusshing a new Row having data as Objects of Withdraw & Deposits
            rowData.items[option].push(newRow);
            return newRow;
        },

        sumBalance: function (option) {

            if (option === "deposits") {
                totalSum(option);
                // rowData.avl_balance = Number(rowData.avl_balance + rowData.total.option);
                rowData.avl_balance = rowData.total.option - rowData.total.withdraws;
                console.log("Deposits " + rowData.total.option)
                console.log("Avail Bal" + rowData.avl_balance)
            } else if (option === "withdraws") {
                totalSum(option);
                // rowData.avl_balance = Number(rowData.avl_balance - rowData.total.option);
                rowData.avl_balance = rowData.total.option - rowData.total.withdraws;
                console.log("Withdraws " + rowData.total.option)
                console.log("Avail Bal" + rowData.avl_balance)
            }

        },

        getBalance: function () {
            return {
                updated_balance: rowData.avl_balance
            };
        }
    };
})();

// This IIFE to change UI 
var viewController = (function () {

    return {
        //Fetching Data from input elements and making those publicly accessible
        fetchData: function () {
            if (document.getElementById("menu_list").value === "null") {
                document.getElementById("err_msg").innerHTML = "<span>** Please Select Option </span>";
            } else if (parseFloat(document.querySelector(".amount").value) < 0 ) {
                document.getElementById("err_msg").innerHTML = "<span>x Enter a valid amount </span>";
            } else {
                return {
                    option: document.getElementById("menu_list").value,
                    desc: document.querySelector(".description").value,
                    amount: parseFloat(document.querySelector(".amount").value)
                };
            }
        },

        addTableItem: function (obj, option) {
            var html, newHtml, element;
            if (option === "deposits") {
                element = '.dep_table';
                html = '<tr id="dep-%id%"><td class="with_desc">%description%</td><td class="with_balance">%amount%</td></tr>'
            } else if (option === "withdraws") {
                element = '.wit_table';
                html = '<tr id="with-%id%"> <td class="with_desc">%description%</td><td class="with_balance">%amount%</td></tr>'
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%amount%', obj.amount);

            document.querySelector(element).insertAdjacentHTML('afterbegin', newHtml);
        },

        displayBalance: function (amount) {

            document.querySelector('.p_bal_val1').textContent = "Rs. " + amount.updated_balance;
        },

        resetInputs: function () {

            var input_elements = document.querySelectorAll('.description' + ', ' + ".amount");
            // var drpdown = document.getElementById("menu_list").value;
            // drpdown.value = null
            var input_elements_ar = Array.prototype.slice.call(input_elements);
            input_elements_ar.forEach(function (current, index, array) {
                current.value = "";
            });
            document.getElementById("err_msg").innerHTML = "<span id=\"err_msg\"></span>";
            console.log(input_elements_ar[0])
            input_elements_ar[0].focus();
        }

    };
})();


var bankingController = (function (amtcalc, vcontrol) {


    var calculateBalance = function () {
        var rowData = vcontrol.fetchData();

        amtcalc.sumBalance(rowData.option);

        var amount = amtcalc.getBalance()
        console.log("Amount in Controller" + amount.updated_balance)

        vcontrol.displayBalance(amount);
    }

    var logHistory = function () {

        var rowData = vcontrol.fetchData();
        console.log("Get Balance" + amtcalc.getBalance().updated_balance)
        //Log in History only if data is valid AND Withdrawal amount is more than available balance
        if ((rowData.description !== "" && !isNaN(rowData.amount)) && ((rowData.option === "withdraws" && rowData.amount < amtcalc.getBalance().updated_balance) || (rowData.option === "deposits" && rowData.amount > 0))) {
            var newRow = amtcalc.addrow(rowData.option, rowData.desc, rowData.amount);

            // console.log(newRow.amount)
            vcontrol.addTableItem(newRow, rowData.option);

            vcontrol.resetInputs();

            calculateBalance();
        } else {
            vcontrol.resetInputs();
            document.getElementById("err_msg").innerHTML = "<span>x Insufficient Balance </span>";
        }

    };

    document.querySelector('.ok_btn').addEventListener('click', logHistory);
    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            logHistory();
        }
    });

})(AmountCalculation, viewController);






//Dummy Code
// console.log("Len"+arr.length)
// console.log("index"+index)
// console.log("arr-val"+arr[index])
// console.log("Last value"+arr[arr.length-1].amount)