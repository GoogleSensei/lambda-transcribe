const AWS = require('aws-sdk');
const s3 = new AWS.S3({'region':'ap-northeast-1'});

exports.handler = async (event, context, callback) => {
    // Read File from S3

    const data = await s3.getObject(
        {
            Bucket:'taylor-transcribe-bucket',
            Key:'audio.json'
        }).promise()

    return {
        statusCode: 200,
        obj: JSON.parse(data.Body),
    }

};



    const word1 = "条件";
    const word2 = "文";
    const word3 = "実行";
    const wordArray = {words1:"条件", words2:"文", words3:"実行"};
    const result = [word1, word2, word3];
    const hogehoge = {};
    console.log(result)

    const hoge = result.map(word => {


        let place = 0;
        const wordPlace=[];
        const words = [];
        console.log(word);
        const text = "条件式が true の場合、文が再び実行されます。文の実行終了時に毎回条件がチェックされます。条件文によってはああああ"
        // 検索結果の上位10個を取り出す。
        do {
            place = text.indexOf(word, place);
            if (place === -1) {
                break;
            }
            wordPlace.push(place);
            console.log(place);
            place++
        } while (wordPlace.length < 10);
        console.log(wordPlace);

        // 配列の1つ目から前後５文字で単語を取得する
        wordPlace.map(number => {
            if (number < 5) {
                words.push(text.substr(number, 5));
            }
            words.push(text.substr(number - 5, 10));
        })
        console.log(words);

        // 取得した単語と単語の位置を配列に詰める
        let resultData = {};
        for (let i = 0; i < 10; i++) {
            if (words[i] === undefined) {
                break;
            }
            resultData["word"] = word;
            resultData["around" + `${i}`] = words[i];
            resultData["where" + `${i}`] = `${wordPlace[i]} words from beginning.`
        }

        console.log(`文字列:${words}`)
        console.log(`開始位置:${wordPlace}`)

        // const fuga = result.map(words => {
        //     if( words === word) {
        //         return words.resultData = resultData;
        //     } else {
        //         return;
        //     }
        // })

        if ( word === wordArray.words1) {
            wordArray.words1 = resultData;
        } else if ( word === wordArray.words2) {
            wordArray.words2 = resultData;
        } else if ( word === wordArray.words3) {
            wordArray.words3 = resultData;
        }

        console.log(JSON.stringify(resultData));
        return resultData
    })
console.log(hoge)
console.log(wordArray)

