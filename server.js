const http = require('http');//引用內建模組
const { v4: uuidv4 } = require('uuid');//npm模組 去 npm 網站查詢 uuid 引入的寫法
const errorHandle = require('./errorHandle');//自己寫的模組
const todos = [
    // {
    //     "title":"今天要刷牙",
    //     "id":uuidv4()
    // }
];//暫時先把資料存在node.js的記憶體上

const requestListener = (req, res)=>{
    // const headers = {
    //     "Content-Type":"text/plain"
    // }
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',//headers可以允許哪一些資訊
        'Access-Control-Allow-Origin': '*',//跨網域會設置的，其他伺服器 IP 都能造訪
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
       'Content-Type': 'application/json'//把文字改成json格式的資料
     }

    let body = "";
    // req.on('end',()=>{
    //     console.log("body_end:",JSON.parse(body).title);//用JSON parse轉成物件格式，才能讀取.title
    // })
    req.on('data',chunk => {
        console.log("chunk:",chunk)
        body+=chunk;
    })//end會在data執行完之後才執行，放前面可以，因為只作為註冊用，會等data全部都跑完，才會觸發req.on("end",)，此req.on('end',)req.on('data',)為node.js的原生語法，


    console.log(req.url);//路徑
    console.log(req.method);//get post delete patch...
    if(req.url == '/todos' && req.method == "GET"){//偵測首頁
        res.writeHead(200, headers);
        res.write(JSON.stringify({//把物件格式轉換成字串格式，網頁封包無法解析物件
            "status":"success",
            "data":todos,
        }));
        res.end();
    // }else if(req.url == '/' && req.method == "DELETE"){//可以針對同一個網址發出刪除請求
    //     res.writeHead(200, headers);
    //     res.write("刪除成功！");
    //     res.end();
    }else if(req.url == '/todos' && req.method == "POST"){//偵測首頁
        req.on('end',()=>{
            try{
                const title = JSON.parse(body).title;
                //console.log(title);
                if(title !== undefined){
                    const todo = {
                        "title":title,
                        "id":uuidv4()
                    };
                    todos.push(todo)
                    //console.log(todo);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({//把物件格式轉換成字串格式，網頁封包無法解析物件
                        "status":"success",
                        "data":todos,
                    }));
                    res.end();
                }else{
                    errorHandle(res)
                }
            }
            catch(error){
                errorHandle(res)
    }})
    }else if(req.url == '/todos' && req.method == "DELETE"){//為什麼不需要req.on('end',) 因為delete及get不需要發body的內容，post需要
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify({//把物件格式轉換成字串格式，網頁封包無法解析物件
            "status":"success",
            "data":todos,
        }));
        res.end();
    }else if(req.url.startsWith("/todos/") && req.method == "DELETE"){//為什麼不需要req.on('end',) 因為delete及get不需要發body的內容，post需要
        const id = req.url.split('/').pop();
        const index = todos.findIndex(element => element.id === id)
        console.log(id,index);
        if(index!== -1){
            todos.splice(index,1);
            res.writeHead(200, headers);
            res.write(JSON.stringify({//把物件格式轉換成字串格式，網頁封包無法解析物件
                "status":"success",
                "data":todos,
            }));
            res.end();
        }else{
            errorHandle(res);
        }
    }else if(req.url.startsWith("/todos/") && req.method == "PATCH"){//為什麼不需要req.on('end',) 因為delete及get不需要發body的內容，post需要
        req.on('end',()=>{
            try{
                const todo = JSON.parse(body).title;
                const id = req.url.split('/').pop();
                const index = todos.findIndex(element => element.id == id);
                if(todo !== undefined && index !== -1){
                    todos[index].title = todo;
                    res.writeHead(200,headers);
                    res.write(JSON.stringify({
                        "status":"success",
                        "data":todos,
                    }));
                    res.end();
                }else{
                    errorHandle(res);
                }
            }catch{
                errorHandle(res);
            }
        })
    }else if(req.method == 'OPTIONS'){//preflights 要在heroku才能測試 
        res.writeHead(200,headers);
        res.end();
    }else{//其他路由都會倒到這裡
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status":"false",
            "message":"無此網站路由",
        }));;
        res.end();
    }

}

const server = http.createServer(requestListener);//當使用者造訪網站時會被觸發 會執行requestListener函數
server.listen(process.env.PORT || 3005);//左邊沒吃到的時候，就會吃右邊的設定檔 有些會看到3005自己幫你改有些不會


