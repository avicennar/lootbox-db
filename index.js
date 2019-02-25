const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

var port = 2000;

var app = express({defaultErrrorHandler:false});

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));

const conn = mysql.createConnection({
    host:'localhost',
    user:'avis',
    password:'haidar123',
    database:'lootbox',
    port: 3306
});

app.get('/', (req,res) => {
    res.send('<a><center>CONNECTED TO DATABASE</center></a>')
})

app.get('/categories',(req,res) => {
    var sql = `select * from categories;`;
    conn.query(sql,(err,result) => {
        res.send(result)
    })
})

app.get('/produk',(req,res) => {
    var sql = `select * from product;`;
    conn.query(sql,(err,result) => {
        res.send(result)
        console.log(result)
    })
})

app.get('/produk/:id',(req,res) => {
    var sql = `select id,nama,deskripsi,image from product p where p.id = ${req.params.id};`
    conn.query(sql,(err,result) => {
        res.send(result)
        console.log(result)
    })
})

app.get('/produk-detail/:id',(req,res) => {
    var sql = `select
    p.nama as nama,
    p.deskripsi as deskripsi,
    p.harga as harga,
    p.image as image,
    c.nama as kategori
    from product p
    join categories c on p.id_kategori = c.id
    where p.id = ${req.params.id};`;
    conn.query(sql,(err,result) => {
        res.send(result)
        console.log(result)
    })
})

app.get('/produk-kategori/:id',(req,res) => {
    var sql= `select
    p.id as id,
    p.id_kategori as id_kategori,
    c.nama as kategori,
    p.nama as nama,
    p.deskripsi as deskripsi,
    p.image as image
    from product p 
    join categories c on c.id = p.id_kategori
    where p.id_kategori = ${req.params.id};`;
    conn.query(sql,(err,result) => {
        res.send(result)
        console.log(result)
    })
})

app.get('/users', (req,res) => {
    var sql = `select * from users;`;
    conn.query(sql,(err,result) => {
        console.log(result)
        res.send(result)
    })
})

app.post('/login',(req,res) => {
    var data = req.body;
    var sql = `select * from users where username = '${req.body.username}' and password = '${req.body.password}';`;
    conn.query(sql,data,(err,result) => {
        if (err) throw err;
        if(result !== undefined) {
            res.send(result)
        } else {
            res.send('Username or Password is Invalid')
        }
    })
})

app.get('/usercheck', (req,res) => {
    var username = req.query.username;
    var sql = `select * from users where username = '${username}';`;
    conn.query(sql,(err,result) => {
        res.send(result)
    })
})

app.post('/register', (req,res) => {
    var newUser = req.body
    var sql = `insert into users set ?;`;
    conn.query(sql,newUser,(err,result) => {
        if(err) {
            return res.status(500).json({ message: "there is a problem on server", error: err.message})
        } else {
            res.send(result)
        }
    })
})

app.get('/keeplogin', (req,res) => {
    var username = req.query.username
    var sql = `select * from users where username = '${username}';`;
    conn.query(sql,(err,result) => {
        if (err) throw err
        console.log(result)
        res.send(result)
    })   
})

app.post('/deleteuser/:id', (req,res) => {
    var sql = `delete from users where username= ${req.params.username};`;
    conn.query(sql,(err,result) => {
        console.log(result)
        res.send(result)
    })
})

app.delete('/deleteproduk/:id', (req,res) => {
    var sql = `delete from product where id= ${req.params.id};`;
    conn.query(sql,(err,result) => {
        console.log(result)
        res.send(result)
    })
})

app.delete('/deletekategori/:id', (req,res) => {
    var sql = `delete from categories where id=${req.params.id};`;
    conn.query(sql,(Err,result) => {
        console.log(result)
        res.send(result)
    })
})

app.post('/addkategori',(req,res) => {
    var addKategori = req.body;
    var sql = `insert into categories set ? `;
    conn.query(sql,addKategori,(err,result) => {
        console.log(result)
        res.send(result)
    })
})

app.post('/addproduk',(req,res) => {
    var addProduk = req.body
    var sql = `insert into product set ?`;
    conn.query(sql,addProduk,(err,result) => {
        console.log(result)
        res.send(result)
    })
})

app.post('/editproduk/:id',(req,res) => {
    var editProduk = req.body
    var sql = `update product set ? where id=${req.params.id};`;
    conn.query(sql,editProduk,(err,result) => {
        res.send(result)
        console.log(result)
    })
})

app.post('/editkategori/:id',(req,res) => {
    var editKategori = req.body
    var sql = `update categories set ? where id=${req.params.id};`;
    conn.query(sql,editKategori,(err,result) => {
        res.send(result)
        console.log(result)
    })
})

app.listen(port, ()=> console.log('API AKTIF DI PORT ' + port));