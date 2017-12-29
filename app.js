var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var _ = require('underscore')
var Movie = require('./models/movie')
var mongoose = require('mongoose')
var port = process.env.PORT || 3000;
var app = express();

mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost:27017/imooc',{useMongoClient: true})


app.set('views','./views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//静态资源路径
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment')
app.listen(port);

console.log('imooc started on port 3000')

//index.jade
app.get('/',function(req,res){

	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
			title:'imooc 首页',
			movies: movies
		})
	})
})
//datail.jade
app.get('/movie/:id',function(req,res){

	var id = req.params.id
	Movie.findById(id,function(err,movie){
		res.render('detail',{
			title:'imooc 详情页',
			movie: movie
		})
	})
})
//list.jade
app.get('/admin/list',function(req,res){

	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'imooc 列表页',
			movies: movies
		})
	})
})
//admin.jade
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'imooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	})
})


//admin update movie
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title: 'imooc后台更新页',
				movie: movie
			})
		})
	}
})

//admin post movie
app.post('/admin/movie/new',function(req,res){
	console.log(req.body)
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			_movie =  _.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/'+movie._id)
			})
		})
	} else {

		console.log(id)
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		})
		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}

			console.log("我没问题，别处的问题")
			console.log(movie._id)
		 	res.redirect('/movie/'+movie._id)
		})
	}
})

//list delete movie
app.delete('/admin/list',function(req,res){
	var id = req.query.id
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);
			}
			else {
				res.json({success:1})
			}
		})
	}
})