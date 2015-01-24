//custom script loading data from the application server
//verificationToken is provided in the url as an identification and authorization for the particular
//user
function beforeRender(done) {
    require("request")({
        url: 'http://local.net:1000/data?verificationToken=' + request.options.verificationToken,
        json: true
    }, function (err, response, body) {

        //group the array into a structure requested from the chart component
        var hist = {};
        body.items.forEach(function (a) {
            if (a.Province in hist) {
                hist[a.Province]++;
            } else {
                hist[a.Province] = 1;
            }
        });

        var provinces = Object.keys(hist).map(function (key) {
            return [key, hist[key]]
        });

        request.data = {provinces: provinces};
        done();
    });
}