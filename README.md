# K-MeansJS
###[Author: Hussain Mir Ali]
K-MeansJS contains all the necessary logic for clustering unsupervised n-dimensional data.

##External Librarbies Used:
* mathjs License: https://github.com/josdejong/mathjs/blob/master/LICENSE
* mocha License: https://github.com/mochajs/mocha/blob/master/LICENSE
* sinon Licencse: https://github.com/sinonjs/sinon/blob/master/LICENSE
* yuidocjs License: https://github.com/yui/yuidoc/blob/master/LICENSE
* nodeJS License: https://github.com/nodejs/node/blob/master/LICENSE
* q License: https://github.com/kriskowal/q/blob/v1/LICENSE

##Installation:
*  Download the project and unzip it.
*  Copy the 'k-means' folder to your project directory and follow sample usage.

##Testing:
* For unit testing Mocha and Sinon have been used. Use 'mocha test' to start the test.
* If tests fail due to insufficient time run 'mocha test --timeout 100000' to allow sufficient time for running each case.


##Documentation
*  The documentation is available in the 'out' folder of this project. Open the 'index.html' file under the 'out' folder with Crhome or Firefox.
*  To generate the documentation run 'yuidoc .' command in the main directory of this project.

###Sample usage:

```
//main.js file.
var callback = function (data) {
    console.log(data);
};

var data = [];
var data_generate = function() {
    var i = 0,
        j = 0;
    for (i = 0; i < 10000; i++) {
        data[i] = [];
        for (j = 0; j < 5; j++) {
            data[i].push(Math.random() * 10 + j);
        }
    }
};

data_generate();

var KMeans = new window.K_Means_Clustering({
    random_Init_Count: 4,
    cluster_count: 7,
    max_iterations: 10000,
    iteration_callback: callback,
    notify_count: 10
});

KMeans.start_Clustering(data).then(function(return_Val) {
    console.log(return_Val);
});
```
```
        <!-- index.html -->

<!doctype html>
<html>
  <head>
  </head>
  <body >
        <script src="K-Means/lib/q.js"></script>
        <script src="K-Means/lib/math.js"></script>
        <script src="K-Means/K_Means.js"></script>
        <!--Include the main.js file where you use the algorithm.-->
        <script src="main.js"></script>
</body>
</html>


```