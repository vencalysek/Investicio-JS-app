/***************************************************************/
//  DATA CONTROL
const dataControl = (function () {

    // Constructor

    let InvestmentConstructor = function (desc, initVal, monthInc, yearIncr, yearsAfter) {
        this.desc = desc;
        this.initVal = initVal;
        this.monthInc = monthInc;
        this.yearIncr = yearIncr;
        this.yearsAfter = yearsAfter;
        this.estimatedYears = 0;
        this.estimatedValue = 0;
    };

    // Prototype funkce pro vypocty navratnosti a hodnoty po X letech

    InvestmentConstructor.prototype.estReturn = function () {
        let years = 1;
        let monthAfterInc = this.monthInc;
        let returnWorth = this.monthInc * 12;
        while (returnWorth < this.initVal) {

            monthAfterInc *= 1 + (this.yearIncr / 100);
            returnWorth += monthAfterInc * 12;
            years++;
        }
        this.estimatedYears = years;
    };

    InvestmentConstructor.prototype.estValue = function () {
        let returnWorth = this.monthInc * 12;
        let monthAfterInc = this.monthInc;
        for (let i = 1; i < this.yearsAfter; i++) {

            monthAfterInc *= 1 + (this.yearIncr / 100);
            returnWorth += monthAfterInc * 12;
        }
        this.estimatedValue = Math.floor(returnWorth);
    };

    // Data uloziste
    let data = [];

    return {
        addItem: function (desc, initVal, monthInc, yearIncr, yearsAfter) {
            let newItem;

            // Vytvori novy objekt z inputu
            newItem = new InvestmentConstructor(desc, initVal, monthInc, yearIncr, yearsAfter);
            newItem.estReturn();
            newItem.estValue();

            // Push item do data array
            data.push(newItem);

            return newItem;
        },
        testing: function () {
            console.log(data);
        }
    };

})();




/***************************************************************/
//  UI CONTROL
const UIcontrol = (function () {

    const DOMStrings = {
        description: '.description',
        invest: '.initValue',
        monthIncome: '.incomeMonth',
        increaseYear: '.increaseYear',
        yearsAfter: '.estimatedValueYearsAfter',
        estimatedReturn: '.estimatedReturn',
        estimatedValue: '.estimatedValue',
        calcBtn: '.calculate-btn',
        estReturn: '.estimatedReturn',
        estValue: '.estimatedValue',
        toggleContainer: '.result-name-container',
        resultContainer: '.results',
    };

    return {
        getInput: function () {
            return {
                description: document.querySelector(DOMStrings.description).value,
                invest: parseFloat(document.querySelector(DOMStrings.invest).value),
                monthIncome: parseFloat(document.querySelector(DOMStrings.monthIncome).value),
                increaseYear: parseFloat(document.querySelector(DOMStrings.increaseYear).value),
                yearsAfter: parseFloat(document.querySelector(DOMStrings.yearsAfter).value),
            };
        },

        addListItem: function (obj) {
            let html, newHtml, element;

            element = DOMStrings.resultContainer;
            html = `<div class="line"></div><div class="result"><div class="result-name-container"><h2>%description%</h2><i class="fas fa-angle-double-down"></i></div>

            <div class="result-value-container hide">

            <div class="result-item"><p>Initial value:</p><p class="init-value">%initValue%</p></div><div class="result-item"><p>Monthly income:</p><p class="month-value">%monthIncome%</p></div><div class="result-item"><p>Yearly increase:</p><p class="year-increase">%yearlyIncrease% %</p></div><div class="result-item"><p>Estimated return:</p><p class="return">%estReturn% years</p></div></div></div>`;

            // zmena praceholderu za skutecna data
            newHtml = html.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%initValue%', obj.initVal);
            newHtml = newHtml.replace('%monthIncome%', obj.monthInc);
            newHtml = newHtml.replace('%yearlyIncrease%', obj.yearIncr);
            newHtml = newHtml.replace('%estReturn%', obj.estimatedYears);

            // vlozi html do DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },



        // tohle je proto abych mohl pouzivat inputy i v jine funkci
        // DOMStrings bude public funkce

        getDOMStrings: function () {
            return DOMStrings;
        }
    };
})();


/***************************************************************/
//  MAIN CONTROLLER
const mainController = (function (dataCtrl, UIctrl) {

    const DOM = UIctrl.getDOMStrings();

    const setupEventListeners = function () {


        // na kliknuti spusti 'ctrlAddItem' funkci
        document.querySelector(DOM.calcBtn).addEventListener('click', ctrlAddItem);


        // otevira a zavira detaily ulozenych vypoctu
        let accordions = document.querySelectorAll(DOM.toggleContainer);

        for (let i = 0; i < accordions.length; i++) {
            accordions[i].onclick = function () {
                this.nextElementSibling.classList.toggle('hide');
            };
        }
    };


    const ctrlAddItem = function () {

        let input, newItem;

        // 1. Input data
        // getInput vrati objekt z get input funkce do 'input' variably
        input = UIctrl.getInput();
        //console.log(input);

        if (input.description !== '' && input.invest && input.monthIncome > 0 && input.increaseYear >= 0) {
            // 2. Ukazat vysledky
            newItem = dataCtrl.addItem(input.description, input.invest, input.monthIncome, input.increaseYear, input.yearsAfter);
            document.querySelector(DOM.estReturn).textContent = newItem.estimatedYears;
            document.querySelector(DOM.estValue).textContent = newItem.estimatedValue;


            // 3. Prida item do historie
            UIctrl.addListItem(newItem);

            // 4. setupEvenListeners accordion 
            setupEventListeners();
        }
        else {
            alert('Please enter the necessary informations.');
        }
    };



    return {
        init: function () {
            console.log('App started');
            setupEventListeners();
        },
    };

})(dataControl, UIcontrol);

mainController.init();
