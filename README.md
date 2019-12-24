# KMeans
### [Author: Hussain Mir Ali]
![Image of K-Means](https://upload.wikimedia.org/wikipedia/commons/e/e5/KMeans-Gaussian-data.svg)

KMeans contains all the necessary logic for clustering unsupervised n-dimensional data.

## External Libraries Used:
* mathjs License: https://github.com/josdejong/mathjs/blob/master/LICENSE
* mocha License: https://github.com/mochajs/mocha/blob/master/LICENSE
* sinon License: https://github.com/sinonjs/sinon/blob/master/LICENSE
* yuidocjs License: https://github.com/yui/yuidoc/blob/master/LICENSE
* nodeJS License: https://github.com/nodejs/node/blob/master/LICENSE

## Installation:
*  Run 'npm install @softnami/kmeans'.

### Sample usage:

```javascript
//main.js file.

import {K_Means} from '@softnami/kmeans';

let callback = function (data) {
    console.log(data);
};

let data = [];
let data_generate = function() {
    for (let i = 0; i < 10000; i++) {
        data[i] = [];
        for (let j = 0; j < 5; j++) {
            data[i].push(Math.random() * 10 + j);
        }
    }
};

data_generate();

const kMeans = K_Means({
    random_Init_Count: 4,
    cluster_count: 7,
    max_iterations: 10000,
    iteration_callback: callback,
    notify_count: 10
});

kMeans.start_Clustering(data).then(function(clusters) {
    console.log(clusters);
});
```

## Testing:
* For unit testing Mocha and Sinon have been used. 
* Run 'npm test', if timeout occurs then increase timeout in test script.

## Documentation
*  The documentation is available in the 'out' folder of this project. Open the 'index.html' file under the 'out' folder with Crhome or Firefox.
*  To generate the  documentation run 'yuidoc .' command in the main directory of this project.
