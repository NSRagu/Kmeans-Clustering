# KMeans
### [Author: Hussain Mir Ali]
<div>
<img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/K-means_convergence.gif" target="_blank" alt="kmeans" width="30%" height="auto"></img>
</div>

This package contains logic for clustering unsupervised n-dimensional data using the K-Means clustering algorithm.

## Installation
```javascript
npm install @softnami/kmeans
```

## Sample usage

```javascript
import {K_Means} from '@softnami/kmeans';

//generate data or you can use your own data
let data = [];
let generateData = function() {
    for (let i = 0; i < 10000; i++) {
        data[i] = [];
        for (let j = 0; j < 5; j++) {
            data[i].push(Math.random() * 10 + j);
        }
    }
};
generateData();


//instantiate K_Means 
const kMeans = K_Means({
    random_Init_Count: 4, //number of times to initialize random centroids
    cluster_count: 7, //number of clusters needed
    max_iterations: 10000, //maximum iterations to run clustering
    iteration_callback: (debugInfo)=>{ console.log(debugInfo); }, //debug callback
    notify_count: 10 //execute callback after every 10 iterations
});

//start clustering
kMeans.start_Clustering(data).then(function(clusters) {
    console.log(clusters);
});
```

## Testing
* For unit testing Mocha and Sinon have been used. 
* Run 'npm test', if timeout occurs then increase timeout in test script.

## Documentation
*  The documentation is available in the 'out' folder of this project. Open the 'index.html' file under the 'out' folder with Crhome or Firefox.
*  To generate the  documentation install yuidocjs globall and run 'yuidoc .' command in the main directory of this project.

## Theory and Background
* To learn more about how the K-Means algorithm works visit [stanford.edu](https://stanford.edu/~cpiech/cs221/handouts/kmeans.html).

## 💡 Practice Daily Coding
Practice coding questions from top companies daily, visit [softnami.com/dailycoding](https://www.softnami.com/dailycoding/signup.html?ref=npm).