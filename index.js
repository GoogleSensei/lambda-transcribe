const AWS = require('aws-sdk');
const s3 = new AWS.S3({'region':'ap-northeast-1'});

exports.handler = async (event, context, callback) => {

    // URLパラメータの格納
    const { word1, word2, word3 } = event?.queryStringParameters || {};
    const result = {words1:word1, words2:word2, words3:word3};
    const wordArray = [word1, word2, word3];

    // テキスト化した音声ファイルの取得
    const text = await getTextObjectFromS3();

    // 検索処理
    wordArray.map(word => {
        if (word === undefined) {
            return;
        }

        // 単語の位置を配列に格納する
        const wordPlaceList = getIndexList(word, text);

        // 配列の1つ目から前後５文字で単語を取得する
        const wordAroundList = getWordAround(wordPlaceList, word, text);

        // 取得した単語と単語の位置を配列に詰める
        const resultData = formatResult(word, wordAroundList, wordPlaceList);

        // 対応する単語へ追加する
        if ( word === result.words1) {
            result.words1 = resultData;
        } else if ( word === result.words2) {
            result.words2 = resultData;
        } else if ( word === result.words3) {
            result.words3 = resultData;
        }
    });

    result.text = text;
    console.log(result);

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(result),
    };
    return response;
};

/**
 * 検索対象の位置を上位10個を配列に格納する
 * 10個は決めなので変更可能
 * @param word
 * @param text
 * @returns {[]}
 */
function getIndexList(word, text) {
    let place = 0;
    const wordPlaceList = [];

    // 検索結果の上位10個を取り出す。
    do {
        place = text.indexOf(word, place);
        if (place === -1) {
            break;
        }
        wordPlaceList.push(place);
        console.log(place);
        place++;
    } while (wordPlaceList.length < 10);

    return wordPlaceList;
}

/**
 * 検索対象を前後の5文字ずつ含めて配列に格納する。
 * @param wordPlaceList
 * @param word
 * @param text
 * @returns {[]}
 */
function getWordAround(wordPlaceList, word, text) {
    const wordAroundList = [];

    wordPlaceList.map(number => {
        if (number < 5) {
            wordAroundList.push(text.substr(number, word.length+5));
        } else {
            wordAroundList.push(text.substr(number - 5, word.length+10));
        }
    });
    return wordAroundList;
}

/**
 * 単語、前後5文字を含んだ単語のリスト、単語の位置を一つのオブジェクトにまとめる
 * @param word
 * @param wordAroundList
 * @param wordPlaceList
 * @returns {{}}
 */
function formatResult(word, wordAroundList, wordPlaceList) {
    const resultData = {};
    for (let i = 0; i < 10; i++) {
        if (wordAroundList[i] === undefined || wordPlaceList[i] === undefined) {
            break;
        }
        resultData["word"] = word;
        resultData["around" + `${i}`] = wordAroundList[i];
        resultData["where" + `${i}`] = `${wordPlaceList[i]} words from beginning.`;
    }

    return resultData;
}

/**
 * s3からテキスト化した音声ファイルを取得する。
 * @returns {Promise<*>}
 */
async function getTextObjectFromS3() {
    const data = await s3.getObject(
        {
            Bucket:'taylor-transcribe-bucket',
            Key:'audio.json'
        }).promise();
    const { text } = JSON.parse(data.Body);

    return text;
}