/*
Balance sheet generator code.
In finnish: Tase

Assets
  Current Assets
    Cash and cash equivalents
      1910 (Bank account) + 1900 (Cash)
    Account receivable
      1701
    Prepaid expenses
      -
  Non-current assets
    -

Liabilities and Stakeholders' Equity
  Equity (stakeholders' equity, fi:oma pääoma, yksityistilit)
    Owner's investments
      2361
    Owner's withdrawals
      2365
    Net income (or loss) (fi:tilikauden voitto tai tappio yhteensä)

  Liabilities (fi:vieras pääoma)
    Accounts payable
      2871


Constraints
  Total Equity + Total Liabilities = Total Assets


References
  http://en.wikipedia.org/wiki/Balance_sheet
  http://www.dwmbeancounter.com/BCTutorSite/Courses/ChartAccounts/lesson02-6.html
*/

$(document).ready(function() {
  
  lib.load_json_database("/database.json", function (db) {
    
    lib.set_title("Balance sheet (TODO)");
    


    (function build_meta($el) {

      // Company name, financial year time range etc.
      
      var meta = _.template(
        $("script.balancesheet_meta_template").html()
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
      
    })($("#balancesheet_meta"));
    


    (function build_balancesheet($el) {
      
      // Assets
      // Current assets
      // non-current (long-term) assets
      
      var assets_template = _.template(
        $("script.assets_template").html()
      );
      
      var current_assets = [
        (function (key) {
          var account = db.account[key];
          var bal = lib.get_account_balance(db, key);
          var prev_bal = parseFloat(account.balance_forward);
          return {
            number: key,
            name: account.name,
            balance: bal,
            difference: bal - prev_bal,
            previous_balance: prev_bal
          };
        })("1910")
      ];
      
      var total = current_assets.reduce(function (a, b) {
        return a + b.balance;
      }, 0.0);
      
      var prev_total = current_assets.reduce(function (a, b) {
        return a + b.previous_balance;
      }, 0.0);
      
      $el.append(assets_template({
        financial_year: db.meta.financial_year,
        previous_financial_year: db.meta.previous_financial_year,
        current_assets: current_assets,
        total_current_assets: total,
        total_difference: total - prev_total,
        previous_total_current_assets: prev_total,
        noncurrent_assets: [],
        total_noncurrent_assets: 0.0
      }));
      
      
      
      // Owner's Equity (oma pääoma)
      // Liabilities (vieras pääoma, velat)
      
      var equity_template = _.template(
        $("script.equity_template").html()
      );
      
      $el.append(equity_template({
        private_account_investment: 0.00,
        previous_private_account_investment: 590.26,
        private_account_withdrawal: -2300.00,
        previous_private_account_withdrawal: -1250.00,
        private_account_total: -2300.00,
        previous_private_account_total: (590.26-1250.00),
        
        net_income: 1774.45,
        previous_net_income: 1671.05
      }));
      
      
    })($("#balancesheet"));
  });
});
