class Confession {
  
  constructor(){

  }
  analyzeWords(txt){
    var wordArr = txt.replace(/[^\w\s]/gi, '').split(' ')
    console.log(wordArr)
    var bulk = db.collection('wordcounts').initializeOrderedBulkOp()

    for(var word of wordArr) {
      bulk.find({ word: word.toLowerCase() }).upsert().update({ '$inc': { 'count': 1 } })
    }
    bulk.execute().then((result) => {
      console.log('Word counts updated')
    })
  }

  analyzeNames(txt){
    var wordArr = txt.replace(/[^\w\s]/gi, '').split(' ')
    console.log(wordArr)
    var bulk = db.collection('namecounts').initializeOrderedBulkOp()

    for(var word of wordArr) {
      bulk.find({ word: word.toLowerCase() }).upsert().update({ '$inc': { 'count': 1 } })
    }
    bulk.execute().then((result) => {
      console.log('Name counts updated')
    })
  }

}

module.exports.Confession = Confession;
