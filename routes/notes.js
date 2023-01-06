const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../model/Notes')
const router = express.Router();
const {body ,validationResult} = require('express-validator');

// route 1 : Fetching all the notes 
router.get("/fetchallnotes",fetchUser,async(req,res)=>{
    try {
        const notes = await Notes.find({user : req.user.id})
        res.json(notes)
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server Error")
    }
})
// route 2  :  Add New note using post  :  api/notes/addnote   login require
router.post("/addnote",fetchUser,[
    body('title','Enter a valid title ').isLength({min:3}),
   body('description','description must be at least 5 char').isLength({min:5}) 
],async(req,res)=>{
    try {
        
   
    const {title ,description ,tag} = req.body
     // Cheack the email if aleready exists show error
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
    const note = new Notes({
      title ,description ,tag, user : req.user.id
    })
    const savedNotes = await note.save()
 res.json(savedNotes)
} catch (error) {
    console.log(error)
    res.status(500).send("Internal server Error")
}
})

//route 3  :  update existing note  using put  :  api/notes/updatenote  login require

router.patch("/updatenote/:id" ,fetchUser,async (req,res)=>{
    const {title , description ,tag} = req.body;
    const newNote = {};
    try {
         // creating a new note object
    
     if(title){newNote.title = title};
     if(description){newNote.description = description};
     if(tag){newNote.tag = tag};

    // for updating the note and check the user

     let note = await Notes.findById(req.params.id)

    if(!note){
        return res.status(404).send("Not Found")
    }
    if(note.user.toString() !== req.user.id ){
        return res.status(401).send("Not Allowed")
    }

     note = await Notes.findByIdAndUpdate(req.params.id , {$set : newNote} , {new : true})
     res.json(note)
    
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server Error")
    }
})

//route 4  :  Deleting  note  using delete method  :  api/notes/deletenote  login require,

router.delete("/deletenote/:id",fetchUser,async(req,res)=>{
    try {
        let note = await Notes.findById(req.params.id)

    if(!note){
        return res.status(404).send("Not Found")
    }
    if(note.user.toString() !== req.user.id ){
        return res.status(401).send("Not Allowed")
    }

     note = await Notes.findByIdAndDelete(req.params.id )
     res.json({"Success" : "Note has been deleted" , note : note})
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server Error")
    }
    
})

module.exports = router;