import express from 'express';
const app = express();
const PORT = 3000;
app.get("/", (req, res)=>{
    res.status(200).json({message:"Hello World"});
});
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

app.get("/notes", (req, res)=>{
     res.status(200).json({message: "Retrieved all notes"});
});
app.get("/notes/:noteId", (req, res)=> {
    const {noteId} =req.params;
    res.status(200).json({"message": `Retrieved note with ID: ${noteId}`});
});