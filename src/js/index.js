$(document).ready(function() {
    
    lib.load_json_database("/database.json", function (db) {
        
        lib.set_title(db.meta.company_name + " financial year " +
                  db.meta.financial_year.start + " .. " +
                  db.meta.financial_year.stop);
    });
});
