// This file contains the routes for debugging and manipulating the database.
// It includes routes for dropping users, retrieving all users, and dropping drawmap entries.
// Should never be included in production!

const {MapDrawing} = require("./drawmap")
const {MapCanvas} = require("./drawmap")


// log a bright red warning to the console that vulnerable routes are active
console.log('\x1b[31m%s\x1b[0m', 'WARNING: VULNERABLE DEBUG ROUTES ACTIVE! - ANYONE CAN DELETE THE DATABASES!');
// in yellow, how to remove these routes
console.log('\x1b[33m%s\x1b[0m', 'Remove server/debug.db.routes from server.js before hosting production.');

module.exports = function(app){
    app.get('/debug/dropusers', function(req, res){
        db.User.collection.drop();
        res.send("users dropped!")
    });
    
    
    // get all users from db
    app.get('/debug/users', async function(req, res){
        const users = await User.find();
        res.send(users);
    });
    
    // delete all drawmap entries
    app.get('/debug/dropdrawmap', async function(req, res){
        await MapDrawing.collection.drop();
        await MapCanvas.collection.drop();
        res.send("drawmap entries dropped!")
    });
    
    
}


