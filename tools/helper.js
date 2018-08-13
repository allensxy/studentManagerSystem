const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// 数据库地址
const url = 'mongodb://127.0.0.1:27017';

// 数据库名字
const dbName = 'managerDB';

// 暴露出去
module.exports = {
    find(collectionName, obj, callback) {
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            const db = client.db(dbName);
            db.collection(collectionName).find(obj).toArray((err, result) => {
                if (err) throw err;
                // 关闭数据库
                client.close();
                callback(result);
            });
        });
    },
    insertOne(collectionName, obj, callback) {
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            const db = client.db(dbName);
            db.collection(collectionName).insertOne(obj, (err, result) => {
                if (err) throw err;
                // 关闭数据库
                client.close();
                callback(result);
            });
        });
    },
    tips(res, message, url) { //alert提示及跳转函数
        res.send(`<script> alert('${message}'); window.location.href='${url}'</script>`);
    }
}