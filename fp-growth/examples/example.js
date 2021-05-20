var fpgrowth = require("../dist/fpgrowth");
const Diagnostic = require('./../../database/table/diagnostic');


// Execute FPGrowth with a minimum support of 40%.
var fpgrowth = new fpgrowth.FPGrowth(0.1);
var support, items;

//var count = 0;

// Returns itemsets 'as soon as possible' through events.
fpgrowth.on('data', function (itemset) {
    support = itemset.support;
    items = itemset.items;
    if (items.length>3) {
        Diagnostic.find({symptom: items}, function(err, diag){
            return;
        });
        let diagnostic =  new Diagnostic();
        diagnostic.symptom = items;
        diagnostic.save().then( e =>{
            //console.log(diagnostic);
        }).catch(err =>{
            console.log(err);
        });
        
        // console.log(`Itemset { ${items.join(',')} } is frequent and have a support of ${support}`);
        // count++;
        // console.log(count);
    }
    //console.log(`Itemset { ${items.join(',')} } is frequent and have a support of ${support}`);
});


//Execute FPGrowth on a given set of transactions.
async function execute(array) {
    fpgrowth.exec(array)
    .then(async function (itemsets) {
      console.log(`Finished executing FPGrowth. ${itemsets.length} frequent itemset(s) were found.`);
  });
}

async function exe(array) {
    console.log(`Executing FPGrowth...`);
    await execute(array);
};

module.exports = {
    exe
};