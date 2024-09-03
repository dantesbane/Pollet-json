const express=require('express')
const { writeDb, readDb } = require('./dbfunctions')
const app=express()
const port=8383


app.use(express.static('public'))
app.use(express.json())



app.post('/',(req,res)=>{
    const {id,question, options}=req.body
    if(!id || !question || options.size==0)return res.status(400).send({status: "error"})
    console.log(id,question,options)
    const curpolls=readDb()
    writeDb({
        ...curpolls,
        [id]: {
            question,
            options: Array.from(options).reduce((acc,curr)=>{
                return {...acc,[curr]: 0} 
            },{})
        }
    })
    res.sendStatus(200)
})


app.get('/ids',(req,res)=>{
    const ids=readDb()
    res.status(200).send({ids: Object.keys(ids)})
})

app.get('/:id',(req,res)=>{
    const {id}=req.params
    console.log(id)
    try{
        return res.status(200).sendFile('poll.html',{root: __dirname+'/public'})
    }
    catch(err){
        console.log(err)
        res.status(500)}
    
}) 
app.get('/data/:id',(req,res)=>{
    const {id}=req.params
    const data=readDb()[id]
    console.log(data)
    res.status(200).send(data)
})

app.post('/vote',(req,res)=>{
    const {id,vote}=req.body
    const data=readDb()
    data[id]['options'][vote]+=1;
    writeDb(data)
    console.log(data[id][vote])
    res.sendStatus(200)
})

app.listen(port,()=>{console.log(`Server listening at port ${port}`)})
