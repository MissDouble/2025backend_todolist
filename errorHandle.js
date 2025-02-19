

function errorHandle(res){
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',//headers可以允許哪一些資訊
        'Access-Control-Allow-Origin': '*',//跨網域會設置的，其他伺服器 IP 都能造訪
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
       'Content-Type': 'application/json'//把文字改成json格式的資料
     }
    res.writeHead(400, headers);
    res.write(JSON.stringify({//把物件格式轉換成字串格式，網頁封包無法解析物件
        "status":"false",
        "message":"欄位未填寫正確，或無此todo id",
    }));
    res.end();
}

module.exports = errorHandle;