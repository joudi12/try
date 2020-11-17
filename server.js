// const express = require('express');
// let app = express();
// require('dotenv').config();
// let cors = require('cors');
// const methodoverride = require('method-override');
// app.use(cors());
// const pg = require('pg');
// const superagent = require('superagent');
// const PORT = process.env.PORT || 3000;

// //-------- EJS -------------------------
// app.use(express.urlencoded({ extended: true }));
// app.use('/public', express.static('./public'));
// app.use(methodoverride('_method'));
// app.set('view engine', 'ejs');
// //--------------------------------------------------------------

// app.get('/', handelfunction);
// app.post('/Fav', addtoFav);
// app.get('/Fav', showFav);
// app.get('/Fav/:id', showdetails);


// function handelfunction(req, res) {
//     let arr = [];
//     let url = `https://cat-fact.herokuapp.com/facts`
//     superagent(url).then(element => {
//         element.body.all.forEach(data => {
//             arr.push(new Fact(data))
//         })
//         res.render('home', { result: arr });
//     }).catch(error => {
//         console.log('wrong', error);
//     })
// }


// function Fact(data) {
//     this.text = data.text;
//     this.type = data.type;
// }


// function addtoFav(req,res){
//     let query='INSERT INTO  facts (text, type) VALUES ($1,$2);';
//     let values=[req.body.text, req.body.type];
//     client.query(query,values).then(value=>{
//         res.redirect('/Fav');
//     })
// }


// function showFav(req,res){
//     let query='SELECT * FROM facts;';
//     client.query(query).then(value=>{
//         res.render('favorite',{result: value.rows})
//     }).catch(eror=>{
//         console.log('wrong', eror);
//     })
// }

// function showdetails(req,res){
//     let query = 'SELECT * FROM facts WHERE id =$1; '
//     let value = [req.params.id]
//     client.query(query,value).then(val=>{
//         res.send(val.rows[0])
//     })
// }


// //--------------------------------------------
// let client = new pg.Client(process.env.DATABASE_URL)
// client.connect().then(()=>{
//     app.listen(PORT, () => {
//         console.log('its work', PORT);
//     })

// })



///////////////////////////////////////////////////////////////////////////////


const express = require('express');
let app = express();
require('dotenv').config();
let cors = require('cors');
const methodoverride = require('method-override');
app.use(cors());
const pg = require('pg');
const superagent = require('superagent');
const PORT = process.env.PORT;

//-------- EJS -------------------------
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('./public'));
app.use(methodoverride('_method'));
app.set('view engine', 'ejs');


//----------------rout--------------------------------------------------------------------------
//بالترتيب يا جودي ضعي كل شي حسب الترتيب
app.get('/search/new', searchpage);
app.post('/search', showtheresult);
app.get('/', showfav);
app.post('/fav', mainpage);
// في نقطتين فوق بعض انتبهي
app.get('/fav/:id',showdetails);
app.put('/fav/:id', handelupdating);
app.delete('/fav/:id', handeldeleting)

// نضع هذه اخر شي ولا نضع اي شي تحتها
app.get('*', errorfunction);


function searchpage(req, res) {
    res.render('new');
}

function errorfunction(req, res) {
    res.send('not found');
}

function mainpage(req, res) {
    //be carful
    let query = 'INSERT INTO details (title, authors, image_url, description) VALUES ($1, $2, $3, $4) RETURNING id; ';
    //حسب اسمها بالنيم بالفورم 
    let value = [req.body.title, req.body.authors, req.body.img, req.body.description]
    console.log('ggggggggg', value);
    client.query(query, value).then(val => {
//لاتنسي rows
        res.redirect(`/fav/${val.rows[0].id}`);
    }).catch(err => {
        console.log(err)
    })

}
function showfav(req, res) {
    let query = 'SELECT * FROM details;'
    client.query(query).then(value => {
        console.log('uuuuuuuuuuuuuuuuuuu', value)
        //***** */
        res.render('index', { result: value.rows });
    })
}

 function showdetails(req,res){
     let query ='SELECT * FROM details WHERE id=$1;'
     let values=[req.params.id]
     client.query(query,values).then(val =>{
         //ما تنسي rows[0]
         res.render('showdetails', {result:val.rows[0]})
     }).catch(err=>{
         console.log(err)
     })
 }



 function  handelupdating(req,res){
     let query = 'UPDATE  details SET title=$1, authors=$2, description=$3 WHERE  id=$4; '
     let val=[req.body.title,req.body.authors,req.body.description,req.params.id]
      console.log('aaaaaaaaaaaaaa',val)
     client.query(query,val).then(()=>{
        
         res.redirect(`/fav/${req.params.id}`)
     })
 }

 function handeldeleting(req,res){
     let query = 'DELETE FROM details WHERE id =$1;'
     let val=[req.params.id]
    client.query(query,val).then(()=>{
        res.redirect('/')
    })
 }

function showtheresult(req, res) {
    let arr = [];
    //لا تنسي تنتبهي على طريقة تشغيل الينك وشو بتحطي بقلبو للينك 
    // يلي بنحطو بعد req.body هو الاسم يلي بنحطو بالفورم
    let url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.titly}`
    console.log('sssssssss', req.body.titly);
    console.log('ffffffffffffff', url)
    superagent(url).then(val => {
        val.body.items.forEach(element => {
            //نحط element قبل ازا كان في شي بدنا ندخل علي
            arr.push(new Book(element.volumeInfo))
        })
        console.log('eeeeeeeee', arr)
        res.render('show', { result: arr })
    }).catch(err => {
        console.log('wrong', err)
    })
}



function Book(item) {
    this.title = item.title;
    this.authors = item.authors[0];
    this.description = item.description || 'no description';
    this.img = item.imageLinks.thumbnail;

}






let client = new pg.Client(process.env.DATABASE_URL)
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log('every thing good ', PORT)
    })
})






























