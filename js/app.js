var App = App || {};

App.Category = function(name) {
    this.name = ko.observable(name);
    this.annually = ko.observable(0);
    this.monthly = ko.observable(0);
    
    this.annually.subscribe(this.updateMonthlyAllowance.bind(this));
    this.monthly.subscribe(this.updateAnnualAllowance.bind(this));
};

App.Category.prototype = {
    updateAnnualAllowance: function (val) {
        var amount = Number(val * 12).toFixed(1);
        
        if (this.annually() != amount) {
            this.annually(amount);
        }
    },
    
    updateMonthlyAllowance: function (val) {
        var amount = Number(val / 12).toFixed(1);
        
        if (this.monthly() != amount) {
            this.monthly(amount);
        }
    }
};

App.ViewModel = function() {
    this.categories = ko.observableArray();
};

App.ViewModel.prototype = {
    addCategory: function (formEl) {
        var name = jQuery(formEl).find("input[type='text']").first().val();
        
        if (name) {
            this.categories.push(new App.Category(name));
        }
        
        // clear the form value
        jQuery(formEl).find("input[type='text']").first().val('');
    },
    
    annualTotal: function () {
        var total = 0;
        
        for (var i = 0; i < this.categories().length; i++) {
            total += +this.categories()[i].annually();
        }
        
        return total;
    },
    
    monthlyTotal: function () {
        var total = 0;
        
        for (var i = 0; i < this.categories().length; i++) {
            total += +this.categories()[i].monthly();
        }
        
        return total;
    }
}

ko.applyBindings(new App.ViewModel());