import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

const mysqlConnection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"enterprenuer",
    password:"roshanjohnrj"
});


const app=express();
const port=3000;


mysqlConnection.connect((err)=>{
    if(err)
        console.log("error in db connection"+JSON.stringify(err,undefined,2));
    else
        console.log("db connected successfully");
});

//middle were
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.render("index.ejs", {content: "waiting for data....."})
});
// app.get("/get-details",(req,res)=>{
//     mysqlConnection.query("SELECT * FROM users",(err,rows)=>{
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log(rows);
//             res.send(rows);
//         }
//     });
// });


app.post("/get-details",(req,res)=>{
     mysqlConnection.query("SELECT * FROM users WHERE id=?",[req.body.id],(err,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            if(rows[0]!==0)
               res.render("index.ejs",{content:JSON.stringify(rows)});
            else
               res.render("index.ejs",{content:"User with this id doesn't exist"});
            // console.log(rows);
            // res.send(rows);
        }
    });
});


app.post("/delete-details",(req,res)=>{
    mysqlConnection.query("DELETE FROM users WHERE id=?",[req.body.id],(err,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("index.ejs",{content:"successfully deleted"});
            // console.log(rows);
            // res.send(rows);
        }
    });
});

app.post("/post-details",(req,res)=>{
    mysqlConnection.query("INSERT INTO users(name,company) VALUES(?,?)",[req.body.name,req.body.company],(err,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("index.ejs",{content:"successfully inserted"});
            // console.log(rows);
            // res.send(rows);
        }
    });
});

app.post("/patch-details",(req,res)=>{
    mysqlConnection.query("UPDATE users SET ? WHERE id="+req.body.id,[req.body],(err,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("index.ejs",{content:"successfully updated.."});
            // console.log(rows);
            // res.send(rows);
        }
    });
});

app.post("/put-details",(req,res)=>{
    mysqlConnection.query("UPDATE users SET ? WHERE id="+req.body.id,[req.body],(err,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            if(rows.affectedRows==0){
                mysqlConnection.query("INSERT INTO users(name,company) VALUES(?,?)",[req.body.name,req.body.company],(err,rows)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.render("index.ejs",{content:"updated successfully..."});

                        // console.log(rows);
                        // res.send(rows);
                    }
                });
            }
            else
                res.send(rows);
            
        }
    });
});





app.listen(port,()=>{
    console.log("listening on port ${port}");
});