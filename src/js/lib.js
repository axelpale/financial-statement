var lib = {};

lib.load_json_database = function (src, callback) {
    $.ajax({
        dataType: "json",
        url: src,
        isLocal: true,
        success: function (json_reply) {
            var database = json_reply;
            callback(database);
        }
    });
    
};

lib.set_title = function (title) {
    document.title = title;
    $("#title").text(title);
};

lib.get_account_balance = function (db, account_key) {
    var init_balance = parseFloat(db.account[account_key]["balance_forward"]);
    var debit_sum = 0.0;
    var credit_sum = 0.0;
    
    db.transaction.forEach(function iterate(elem) {
        if (elem.debit_account == account_key) {
            debit_sum += parseFloat(elem.amount);
        }
        
        if (elem.credit_account == account_key) {
            credit_sum += parseFloat(elem.amount);
        }
    });
    
    return init_balance + debit_sum - credit_sum;
};

lib.get_gross_revenue = function (db) {
    // Fi: liikevaihto
    // http://en.wikipedia.org/wiki/Income_statement
    return this.get_account_balance(db, 3010);
};

lib.get_net_income = function (db) {
    // FI: tilikauden voitto (tappio) yhteensä
};