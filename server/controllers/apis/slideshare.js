var express = require('express')
	, router = express.Router()
	, http = require('http')
	, fs = require('fs')
	, path = require('path')
	
var Slideshare = require('../../libs/slideshare');

var s = new Slideshare('0HlOfdkl', 'a5k2kX3a');

router.get('/', function(req, res){
	res.end("api documentation");
});

router.get('/:username', function(req, res){
	s.getSlideshowsByUser(req.params.username, { limit: 10, detailed: 0 }, function(data){
		//console.log(data.Slideshow.DownloadUrl[0]);
		//res.json(data.User.Slideshow);
		var result = [], result_count = 0;
		if (data.User.Slideshow){
			for (var i=0; i<data.User.Slideshow.length; i++){
				var item = data.User.Slideshow[i];
				if (item.DownloadUrl){
					console.log(item);
					result[result_count] = {
							id: item.ID[0],
							thumbnail: "http:" + item.ThumbnailURL[0],
							title: item.Title[0]
					};
					
					result_count ++;
				}
			}
		}
		res.json(result);
	})
})

router.get('/download/:id', function(req, res){
	s.getSlideshowById(req.params.id, {}, function(data){
		//console.log(data.Slideshow.DownloadUrl[0]);
		//res.json(data);
		if (data.SlideShareServiceError){
			res.json({status:"404", message:"SlideShow Not Found"});
		}else{
			var filename = path.join(__dirname, "./../../../downloads/" + req.params.id + "." + data.Slideshow.Format[0]);
			var file = fs.createWriteStream(filename)
				.on('error', function(err){
					res.json({status:"402", message:"Failed in creating a file"});
				});
			var request = http.get(
					data.Slideshow.DownloadUrl[0],
					function(response) {
						response.pipe(file);
						file.on('finish', function() {
							file.close();  // close() is async, call some callback
						});
						res.json({status:0});
					}
				).on('error', function(err) { // Handle errors
				    fs.unlink(file); // Delete the file async. (But we don't check the result)
				    res.json({status:"401", message:"Failed in downloading"});
				});
		}
	})
})

module.exports = router;