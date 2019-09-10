var mongoose = require('mongoose');
var Design= require('./models/Design');
var Comment= require('./models/Comment')
// import { create as _create } from './models/Comment';

designs=[
    {name:'Ship House',price:50000 , image:'images/1.jpg', 
    Description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam excepturi aliquam voluptatibus laborum! Nobis, atque laboriosam, eos nesciunt officiis explicabo culpa veritatis ducimus eum ipsam voluptate optio voluptatem, ab quisquam.'},
    {name:'Plane House',price:70000 , image:'images/2.jpg', 
    Description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam excepturi aliquam voluptatibus laborum! Nobis, atque laboriosam, eos nesciunt officiis explicabo culpa veritatis ducimus eum ipsam voluptate optio voluptatem, ab quisquam.'},
    {name:'Boat House',price:40000.00, image:'images/3.jpg',
    Description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam excepturi aliquam voluptatibus laborum! Nobis, atque laboriosam, eos nesciunt officiis explicabo culpa veritatis ducimus eum ipsam voluptate optio voluptatem, ab quisquam."},
    {name:'Boat House',price:80000.00, image:'images/4.jpg',
    Description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam excepturi aliquam voluptatibus laborum! Nobis, atque laboriosam, eos nesciunt officiis explicabo culpa veritatis ducimus eum ipsam voluptate optio voluptatem, ab quisquam."},
    {name:'Boat House',price:100000.00 ,image:'images/5.jpg',
    Description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam excepturi aliquam voluptatibus laborum! Nobis, atque laboriosam, eos nesciunt officiis explicabo culpa veritatis ducimus eum ipsam voluptate optio voluptatem, ab quisquam."},
    {name:'Boat House',price:130000.00 , image:'images/6.jpg',
    Description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam excepturi aliquam voluptatibus laborum! Nobis, atque laboriosam, eos nesciunt officiis explicabo culpa veritatis ducimus eum ipsam voluptate optio voluptatem, ab quisquam."},
    {name:'Boat House',price:120000.00 , image:'images/7.jpg',
    Description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam excepturi aliquam voluptatibus laborum! Nobis, atque laboriosam, eos nesciunt officiis explicabo culpa veritatis ducimus eum ipsam voluptate optio voluptatem, ab quisquam."},
    {name:'Boat House',price:70000.00 , image:'images/8.jpg',
    Description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam excepturi aliquam voluptatibus laborum! Nobis, atque laboriosam, eos nesciunt officiis explicabo culpa veritatis ducimus eum ipsam voluptate optio voluptatem, ab quisquam."},
    {name:'Boat House',price:150000.00, image:'images/9.jpg',
    Description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam excepturi aliquam voluptatibus laborum! Nobis, atque laboriosam, eos nesciunt officiis explicabo culpa veritatis ducimus eum ipsam voluptate optio voluptatem, ab quisquam."},
    {name:'Boat House',price:70000.00 , image:'images/10.jpg',
    Description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam excepturi aliquam voluptatibus laborum! Nobis, atque laboriosam, eos nesciunt officiis explicabo culpa veritatis ducimus eum ipsam voluptate optio voluptatem, ab quisquam."}
]

function seedDB(){
    Design.deleteMany({}, function(err){
    if(err){
        console.log(err)
    } else{
    var num=0;
    while (num < designs.length) {
    Design.create({
        name:designs[num].name,
        price:designs[num].price, 
        image:designs[num].image,
        Description:designs[num].Description
    }, function(err,design){
        if(err){
            console.log(err);
        }else{
            Comment.create({
                text:'This place is great, but i wish there was internet',
                author:'Durojaye Peter'
            }, function(err,comment){
                if(err){
                    console.log(err)
                }else{
                    design.comments.push(comment);
                    design.save();
                    console.log('Added comment')
                }
            })
        }
    });
    num++;    
    }
}
})
};    
module.exports=seedDB