// Ledger generator
// In finnish: pääkirja
$(document).ready(function() {
    
    lib.load_json_database("database.json", function (db) {
        
        lib.set_title(db.meta.company_name + " ledger " +
                  db.meta.financial_year.start + " .. " +
                  db.meta.financial_year.stop);
        
        (function build_meta($el) {
            
            var meta = _.template(
                $("script.ledger_meta_template").html()
            );
            
            $el.append(meta({
                company_name: db.meta.company_name,
                financial_year: db.meta.financial_year,
                currency: db.meta.currency,
                date_format: {
                    title: db.meta.date_format[0],
                    source: db.meta.date_format[1]
                }
            }));
            
        })($("#ledger_meta"));
        
        (function build_ledger($el) {
            
            var account_template = _.template(
                $("script.account_template").html()
            );
            
            for (k in db.account) {
                
                (function (account, key) {
                    var debit_sum = 0.00;
                    var credit_sum = 0.00;
                    var balance_forward = parseFloat(account.balance_forward);
                    
                    $el.append(account_template({
                        number: key,
                        name: account.name,
                        balance_forward: account.balance_forward,
                        description: account.description,
                        transaction: (function build_transactions() {
                            var related_transactions = db.transaction.filter(
                                function condition(elem) {
                                    return elem.debit_account == key ||
                                           elem.credit_account == key;
                                }
                            );
                            
                            related_transactions.sort(function compare(a,b) {
                                // String comparison works here.
                                // Preserve order.
                                return a.date >= b.date ? 1 : -1;
                            });
                            
                            return related_transactions.map(
                                function to_ledger_transaction(elem) {
                                    
                                    var debit_amount = (function debit() {
                                        if (elem.debit_account == key) {
                                            return elem.amount;
                                        } else {
                                            return "0.00";
                                        }
                                    })();
                                    
                                    var credit_amount = (function credit() {
                                        if (elem.credit_account == key) {
                                            return elem.amount;
                                        } else {
                                            return "0.00";
                                        }
                                    })();
                                    
                                    debit_sum += parseFloat(debit_amount);
                                    credit_sum += parseFloat(credit_amount);
                                    
                                    
                                    return {
                                        date: elem.date,
                                        voucher: elem.voucher,
                                        description: elem.description,
                                        debit_amount: debit_amount,
                                        credit_amount: credit_amount,
                                        account_balance: (function current_balance() {
                                            return balance_forward + debit_sum - credit_sum;
                                        })()
                                    };
                                }
                            );
                        })(),
                        debit_sum: debit_sum,
                        credit_sum: credit_sum,
                        end_balance: (balance_forward + debit_sum - credit_sum)
                    }));
                })(db.account[k], k);
            }
            
        })($("#ledger"));
    });
});
