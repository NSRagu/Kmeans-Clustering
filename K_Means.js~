/**
Copyright (c) 2016 Hussain Mir Ali
**/
"use strict";

/**
 * The K_Means_Clustering class contains all the necessary logic for clustering unsupervised data.
 *
 * @class K_Means_Clustering
 * @constructor
 * @param {Object} args Contains all the necessary parameters for K-Means clustering as listed below.
 * @param {Number} args.random_Init_Count Required parameter for how many times to randomly initialize centroids.
 * @param {Number} args.cluster_count Required value to specify how many clusters in total are to be initialized.
 * @param {Number} args.notify_count Required value to execute the iteration_callback after every x number of iterations.
 * @param {Function} args.iteration_callback Required callback that can be used for getting information for diagnostics.
 **/


var K_Means_Clustering = function(args) {

	if (args.notify_count === undefined || args.random_Init_Count === undefined || args.cluster_count === undefined || args.max_iterations === undefined || args.iteration_callback === undefined) {
        throw({
            'name': "InvalidParam",
            'message': "The required constructor parameters cannot be empty."
             });
    } else {
        this.MathJS = require('mathjs');
        this.q = require('q');
        this.initArgs = args;
        this.notify_count = this.initArgs.notify_count || 100;
        this.random_Init_Count = this.initArgs.random_Init_Count || 5;
        this.cluster_count = this.initArgs.cluster_count || 2;
        this.max_iterations = this.initArgs.max_iterations || 1000;
        this.iteration_callback = this.initArgs.iteration_callback;
        this.centroids_changed = 1;
        this.random_vals = {};
        this.clusters = [];
        this.centroids = [];

    }
};

/**
 * This method serves as the logic for the calculating distance between centroids and data points.
 *
 * @method distance
 * @param {matrix} X This is the unsupervised input data for clustering.
 * @param {matrix} u This is the centroid from which distance relative to all input data points will be calculated.
 * @return {matrix} distance This is a matrix containing the distance of all data points relative to a centroid.
 */
K_Means_Clustering.prototype.distance = function(X, u) {
    var self = this;
    var ref_Matrx = this.MathJS.matrix();
    var scope = {};
    scope.diff_square_sum = [];

    for (var i = 0; i < X.size()[0]; i++) {
        scope.diff_square_sum[i] = self.MathJS.sum(self.MathJS.square(self.MathJS.subtract(u, X._data[i]))); // ||u-X||^2  = (u1-X1)^2+....+(un-Xn)^2
    }

    var distance = scope.diff_square_sum;
    return distance;
};

/**
 * This method updates each centroid by calculating the mean of the respective clusters.
 *
 * @method update_Centroids
 * @return {matrix} this.centroids Are the updated centroids for the given data.
 */
K_Means_Clustering.prototype.update_Centroids = function() {
    var i, j, cluster_len, sum, mean;

    for (i = 0; i < this.cluster_count; i++) {
        cluster_len = this.clusters[i].length;

        this.centroids_changed = (this.MathJS.sum(this.MathJS.abs(this.MathJS.subtract(this.centroids[i], this.MathJS.mean(this.clusters[i], 0)))));
        this.centroids[i] = this.MathJS.mean(this.clusters[i], 0);
    }

    return this.centroids;
};


/**
 * This method contains the logic to assign clusters points to different centroids.
 *
 * @method assign_Clusters
 * @param {matrix} X This is the unsupervised input data for clustering.
 * @return {matrix} this.clusters This is the matrix containing the clustered data.
 */
K_Means_Clustering.prototype.assign_Clusters = function(X) {
    var distances = new Array(this.cluster_count - 1);
    var reference_positions = {},
        previous_distance;

    for (var i = 0; i < this.cluster_count; i++) { //Calculating distance matrix for X values with respect to clusters.
        this.clusters[i] = new Array();
        distances[i] = this.distance(X, this.centroids[i]);
    }

    for (var i = 0; i < X.size()[0]; i++) { //Recording the position of the lowest distance of each value with respect to clusters.
        for (var j = 0; j < this.cluster_count; j++) {

            if (reference_positions[i] !== undefined) {
                if (distances[j][i] < previous_distance) {
                    reference_positions[i] = j;
                    previous_distance = distances[j][i];
                }
            } else {
                reference_positions[i] = j;
                previous_distance = distances[j][i];
            }

        }
    }

    for (var i = 0; i < X.size()[0]; i++) { //Assignment of X values to different clusters.
        this.clusters[reference_positions[i]].push(X._data[i]);
    }

    return this.clusters;

};


/**
 * This method contains the iterative implementation of the K-Means clustering algorithm.
 *
 * @method start_Clustering
 * @param {matrix} X The matrix to be used as the data input for clustering.
 * @return {Object} defered.promise Returns a promise upon completion.
 */
K_Means_Clustering.prototype.start_Clustering = function(X) {
    var X = this.MathJS.matrix(X);
    var iterations = 0;
    this.initiate_Centroids(X);
    var defered = this.q.defer();
    var info = [];


    while (iterations < this.max_iterations && this.centroids_changed > 0) {
        iterations++;
        this.previous_centroids = this.centroids;
        this.assign_Clusters(X);
        this.update_Centroids();

        if (iterations % this.notify_count == 0 && this.iteration_callback !== undefined) {
            this.apply_Callback(iterations, false);
        }
    }
    
    info = this.apply_Callback(iterations, true);
    delete info['clusters'];

    defered.resolve(info);

    return defered.promise;
};


/**
 * This method is reponsible for passing data to the provided callback function for the purpose of diagnostics.
 *
 * @method apply_Callback
 * @param {Boolean} isComplete The boolean value to indicate if the clustering is completed.
 * @param {Number} iterations Is the number of iterations for the K-Means clustering algorithm.
 * @return {Array} info Is the object containing information for diagnostics.
 */
K_Means_Clustering.prototype.apply_Callback = function(iterations, isComplete) {
    var info = [{
        'iteration': iterations /*iteration count*/ ,
        'clusters': this.clusters /*clustered data*/ ,
        'centroids': this.centroids /*centroids*/ ,
        'clustering_complete': !!isComplete
    }];
    this.iteration_callback.apply(null, info); //notify data for diagnosing the performance of learning algorithm.

    return info;
};

/**
 * This method is reponsible for generating unique random numbers and keeps track of previous random values.
 *
 * @method unique_Random_Val
 * @param {matrix} X The matrix to be used as the unsupervised data.
 * @return {Number} Returns the unique random value.
 */
K_Means_Clustering.prototype.unique_Random_Val = function(X) {
    var val = Math.floor((Math.random() * (X.size()[0] - 1)) + 0);
    while(true){
        if (this.random_vals[val] === true) {
            val = (Math.floor((Math.random() * (X.size()[0] - 1)) + 0));
        }
	else{
	  this.random_vals[val] = true;
	  break;
        }
    }

    return val;
};


/**
 * This method is responsible to randomly initiate centroids for the given data.
 *
 * @method initiate_Centroids
 * @param {matrix} X This is the unsupervised input data for clustering.
 * @return {matrix} this.centroids Are the randomly genrated centroids.
 */
K_Means_Clustering.prototype.initiate_Centroids = function(X) {
    var val;

    for (var j = 0; j < this.random_Init_Count; j++) {
        this.centroids = [];
        this.random_vals = [];
        for (var i = 0; i < this.cluster_count; i++) {
            val = this.unique_Random_Val(X);
            this.centroids.push(X._data[val]);
        }
    }
  return this.centroids;
};

module.exports = K_Means_Clustering;
