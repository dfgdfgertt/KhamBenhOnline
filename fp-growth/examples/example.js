var fpgrowth = require("../dist/fpgrowth");
const readXlsxFile = require('read-excel-file/node');
const Diagnostic = require('./../../database/table/diagnostic');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

let transactions;
const arr = async function () {
    const arr = await readXlsxFile('./fp-growth/symptom-18.xlsx').then((rows) => {
        return rows.filter(row => row.filter(column => column != null).length > 0);
     });
     arr.forEach(element => {
        for( var i = 0; i < element.length; i++){ 
            if ( element[i] === null) {
                element.splice(i, 1);
                i--; 
            }
         }
     });
     transactions = arr;
}
//13 - 3

// Execute FPGrowth with a minimum support of 40%.
var fpgrowth = new fpgrowth.FPGrowth(0.1);
var support, items;

//var count = 0;

// Returns itemsets 'as soon as possible' through events.
fpgrowth.on('data', function (itemset) {
    support = itemset.support;
    items = itemset.items;
    if (items.length>3) {
        let diagnostic =  new Diagnostic();
        diagnostic.symptom = items;
        diagnostic.save().then( e =>{
            //console.log(diagnostic);
        }).catch(err =>{
            console.log(err);
        });
        
        //console.log(`Itemset { ${items.join(',')} } is frequent and have a support of ${support}`);
        //count++;
        //console.log(count);
    }
    //console.log(`Itemset { ${items.join(',')} } is frequent and have a support of ${support}`);
});


//Execute FPGrowth on a given set of transactions.
async function execute() {
    await delay(5000);
    fpgrowth.exec(transactions)
    .then(async function (itemsets) {
      console.log(`Finished executing FPGrowth. ${itemsets.length} frequent itemset(s) were found.`);
  });
}
//setTimeout(arr(), 100);
//setTimeout(execute(), 10000);

async function exe() {
    console.log(`Executing FPGrowth...`);
    await arr();
    await execute();
    //console.log(finallist);
};

module.exports = {
    exe
};