$(document).ready(function() {
    
    lib.load_json_database("/database.json", function (db) {
        
        lib.set_title(db.meta.company_name + " daybook " +
                  db.meta.financial_year.start + " .. " +
                  db.meta.financial_year.stop);
        
        (function build_meta($el) {
            
            var meta = _.template(
                $("script.daybook_meta_template").html()
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
            
        })($("#daybook_meta"));
        
        (function build_daybook($el) {
            
            var trans_template = _.template(
                $("script.transaction_template").html()
            );
            
            db.transaction.forEach(function (transaction) {
                $el.append(trans_template({
                    date: transaction.date,
                    voucher: transaction.voucher,
                    description: transaction.description,
                    debit_amount: transaction.amount,
                    credit_amount: transaction.amount,
                    debit_account_num: transaction.debit_account,
                    debit_account_name: db.account[transaction.debit_account].name,
                    credit_account_num: transaction.credit_account,
                    credit_account_name: db.account[transaction.credit_account].name,
                    debit_sum: transaction.amount,
                    credit_sum: transaction.amount
                }));
            });
            
        })($("#daybook"));
    });
});
