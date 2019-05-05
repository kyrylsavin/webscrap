const express = require('express');
const app = new express();

app.get('/',function(request, response) {
	response.sendfile('usedcars.json');
})
app.listen(3000);