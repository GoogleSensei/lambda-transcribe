const AWS = require('aws-sdk');
const s3 = new AWS.S3({'region':'ap-northeast-1'});

exports.handler = async (event, context, callback) => {

    // URLパラメータの格納
    const { word1, word2, word3 } = event?.queryStringParameters || {};
    const wordArray = {words1:word1, words2:word2, words3:word3};
    const Array = [word1, word2, word3];

    console.log(wordArray)

    // テキスト化した音声ファイルの取得
    const data = await s3.getObject(
        {
            Bucket:'taylor-transcribe-bucket',
            Key:'audio.json'
        }).promise();
    const { text } = JSON.parse(data.Body);

    // 検索処理
    Array.map(word => {
        if (word === undefined) {
            return;
        }
        let place = 0;
        const wordPlace=[];
        const words = [];

        // 検索結果の上位10個を取り出す。
        do {
            place = text.indexOf(word, place);
            if (place === -1) {
                break;
            }
            wordPlace.push(place);
            console.log(place);
            place++;
        } while (wordPlace.length < 10);
        console.log(wordPlace);

        // 配列の1つ目から前後５文字で単語を取得する
        wordPlace.map(number => {
            if (number < 5) {
                words.push(text.substr(number, word.length+5));
            } else {
                words.push(text.substr(number - 5, word.length+10));
            }
        });

        // 取得した単語と単語の位置を配列に詰める
        let resultData = {};
        for (let i = 0; i < 10; i++) {
            if (words[i] === undefined || wordPlace[i] === undefined) {
                break;
            }
            resultData["word"] = word;
            resultData["around" + `${i}`] = words[i];
            resultData["where" + `${i}`] = `${wordPlace[i]} words from beginning.`;
        }

        // 対応する単語へ追加する
        if ( word === wordArray.words1) {
            wordArray.words1 = resultData;
        } else if ( word === wordArray.words2) {
            wordArray.words2 = resultData;
        } else if ( word === wordArray.words3) {
            wordArray.words3 = resultData;
        }
    });

    wordArray.text = text;
    console.log(wordArray);

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(wordArray),
    };
    return response;
};
